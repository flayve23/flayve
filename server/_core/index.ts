import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import fs from "fs";
import path from "path";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { Server as SocketIOServer } from "socket.io";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import multer from "multer";
import { storagePut } from "../storage";
import { setupHelmet, globalLimiter, authLimiter, paymentLimiter, kycLimiter, sanitizeInput, securityHeadersMiddleware } from "./security";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  
  // ============================================================
  // DETAILED FILESYSTEM DEBUG LOGS
  // ============================================================
  console.log("\n" + "=".repeat(70));
  console.log("FLAYVE SERVER INITIALIZATION - FILESYSTEM DEBUG");
  console.log("=".repeat(70));
  
  const cwd = process.cwd();
  console.log("\n[1] Current Working Directory:");
  console.log("    " + cwd);
  
  console.log("\n[2] Contents of ROOT directory:");
  try {
    const files = fs.readdirSync(cwd);
    console.log("    Total items: " + files.length);
    files.forEach((f: string) => {
      const fullPath = path.join(cwd, f);
      const stat = fs.statSync(fullPath);
      const type = stat.isDirectory() ? "[DIR]" : "[FILE]";
      console.log("    " + type + " " + f);
    });
  } catch (e) {
    console.error("    ERROR:", e);
  }
  
  const distPath = path.join(cwd, "dist");
  console.log("\n[3] Contents of DIST directory:");
  console.log("    Path: " + distPath);
  console.log("    Exists: " + fs.existsSync(distPath));
  try {
    const distFiles = fs.readdirSync(distPath);
    console.log("    Total items: " + distFiles.length);
    distFiles.forEach((f: string) => {
      const fullPath = path.join(distPath, f);
      const stat = fs.statSync(fullPath);
      const type = stat.isDirectory() ? "[DIR]" : "[FILE]";
      console.log("    " + type + " " + f);
    });
  } catch (e) {
    console.error("    ERROR:", e);
  }
  
  const publicPath = path.join(cwd, "dist", "public");
  console.log("\n[4] Contents of DIST/PUBLIC directory:");
  console.log("    Path: " + publicPath);
  console.log("    Exists: " + fs.existsSync(publicPath));
  try {
    const publicFiles = fs.readdirSync(publicPath);
    console.log("    Total items: " + publicFiles.length);
    publicFiles.forEach((f: string) => {
      const fullPath = path.join(publicPath, f);
      const stat = fs.statSync(fullPath);
      const type = stat.isDirectory() ? "[DIR]" : "[FILE]";
      console.log("    " + type + " " + f);
    });
  } catch (e) {
    console.error("    ERROR:", e);
  }
  
  console.log("\n[5] Key Files Check:");
  const keyFiles = [
    path.join(publicPath, "index.html"),
    path.join(publicPath, "test.html"),
    path.join(publicPath, "assets"),
  ];
  keyFiles.forEach((f: string) => {
    console.log("    " + f + " -> " + (fs.existsSync(f) ? "EXISTS" : "MISSING"));
  });
  
  console.log("\n" + "=".repeat(70) + "\n");
  
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  import cors from "cors";

// Adicione isto ANTES de setupHelmet
app.use(cors({
  origin: [
    "https://flayve-6lwu2fi17-felipes-projects-30ef9130.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173"
  ],
  credentials: true
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
} ));
  // Segurança: Helmet para headers HTTP
  setupHelmet(app);

  // Segurança: Rate limiting global
  app.use(globalLimiter);

  // Segurança: Headers customizados
  app.use(securityHeadersMiddleware);

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Segurança: Sanitizar inputs
  app.use(sanitizeInput);

  // Socket.io event handlers
  io.on("connection", (socket) => {
    console.log(`[Socket.io] User connected: ${socket.id}`);

    socket.on("join-user", (userId: number) => {
      socket.join(`user-${userId}`);
      console.log(`[Socket.io] User ${userId} joined room: user-${userId}`);
    });

    socket.on("disconnect", () => {
      console.log(`[Socket.io] User disconnected: ${socket.id}`);
    });
  });

  // OAuth routes com rate limiting
  app.use('/api/oauth', authLimiter);
  registerOAuthRoutes(app);

  // Webhook endpoint for Mercado Pago
  app.post('/api/webhooks/mercadopago', async (req, res) => {
    try {
      const { data } = req.body;
      if (data?.id) {
        console.log('[Webhook] Mercado Pago payment notification:', data.id);
      }
      res.json({ success: true });
    } catch (error) {
      console.error('[Webhook] Erro:', error);
      res.status(500).json({ error: 'Webhook error' });
    }
  });
  
  // File upload endpoint com rate limiting
  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
  app.post('/api/upload', kycLimiter, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
      }
      
      const fileKey = `streamer-photos/${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const { url } = await storagePut(fileKey, req.file.buffer, req.file.mimetype);
      
      res.json({ url });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Upload failed' });
    }
  });
  
  // HEALTH CHECK ENDPOINT - Simple test to confirm Express is responding
  app.get('/health', (_req, res) => {
    console.log('[Health] GET /health - Server is responding');
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // DEBUG PATH ENDPOINT
  app.get('/debug-path', (_req, res) => {
    const distPath = path.resolve(process.cwd(), 'dist', 'public');
    const indexPath = path.resolve(distPath, 'index.html');
    res.json({
      cwd: process.cwd(),
      distPath,
      indexPath,
      distExists: fs.existsSync(distPath),
      indexExists: fs.existsSync(indexPath),
      distContents: fs.existsSync(distPath) ? fs.readdirSync(distPath) : [],
    });
  });

  // tRPC API - MUST be before SPA fallback
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // SPA Fallback: qualquer rota que nao seja encontrada, retorna index.html
  // MUST be last to not interfere with API routes
  app.get('*', (_req, res) => {
    const indexPath = path.resolve(process.cwd(), 'dist', 'public', 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ error: 'index.html not found', path: indexPath });
    }
  });

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
