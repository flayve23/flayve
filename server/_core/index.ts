const app = express();

// ADICIONE ESTA LINHA AQUI:
app.set('trust proxy', 1);

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
import { setupHelmet, sanitizeInput, securityHeadersMiddleware } from "./security";

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
  
  // CORS Configuration - Manual implementation
  app.use((req, res, next) => {
    const allowedOrigins = [
      "https://flayve-1f4j79n20-felipes-projects-30ef9130.vercel.app",
      "https://flayve-6lwu2fi17-felipes-projects-30ef9130.vercel.app",
      "http://localhost:3000",
      "http://localhost:5173"
    ];
    
    const origin = req.headers.origin as string;
    if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
    
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    
    next();
  });
  
  // Segurança: Helmet para headers HTTP
  setupHelmet(app);

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

  // OAuth routes
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
  
  // File upload endpoint
  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
  app.post('/api/upload', upload.single('file'), async (req, res) => {
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

  // tRPC API endpoint
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // Serve static files from dist/public
  serveStatic(app);

  // Setup Vite for development
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  }

  // Find available port and start server
  const port = process.env.PORT ? parseInt(process.env.PORT) : 8000;
  
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });

  return server;
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
