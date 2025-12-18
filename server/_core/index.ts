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

// Removidas as linhas soltas que estavam no topo antes dos imports

async function startServer() {
  const app = express();
  const server = createServer(app);

  // --- CONFIGURAÇÃO PARA DEPLOY (Koyeb/Railway/Render) ---
  // Esta linha deve ficar exatamente aqui, logo após a criação do 'app'
  app.set('trust proxy', 1); 

  // --- DEBUG LOGS ---
  console.log("\n" + "=".repeat(70));
  console.log("FLAYVE SERVER INITIALIZATION");
  console.log("=".repeat(70));
  
  const cwd = process.cwd();
  const distPath = path.join(cwd, "dist");
  const publicPath = path.join(distPath, "public");

  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  
  // CORS Configuration
  app.use((req, res, next) => {
    const allowedOrigins = [
      "https://flayve-1f4j79n20-felipes-projects-30ef9130.vercel.app",
      "https://flayve-6lwu2fi17-felipes-projects-30ef9130.vercel.app",
      "https://seu-app-no-koyeb.koyeb.app", // Adicione sua URL do Koyeb aqui
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
    
    if (req.method === "OPTIONS") return res.sendStatus(200);
    next();
  });
  
  setupHelmet(app);
  app.use(securityHeadersMiddleware);
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(sanitizeInput);

  // Eventos Socket.io
  io.on("connection", (socket) => {
    console.log(`[Socket.io] User connected: ${socket.id}`);
    socket.on("disconnect", () => console.log(`[Socket.io] User disconnected`));
  });

  // Rotas
  registerOAuthRoutes(app);

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'OK', proxy: app.get('trust proxy') });
  });

  app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));

  serveStatic(app);

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  }

  // No Koyeb, a porta DEVE ser a definida pela variável de ambiente PORT
  const port = process.env.PORT ? parseInt(process.env.PORT) : 8000;
  
  server.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });

  return server;
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});