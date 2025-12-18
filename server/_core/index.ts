import "dotenv/config";
import express from "express";
import { createServer } from "http";
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

async function startServer() {
  const app = express();
  const server = createServer(app);
  
  // CONFIGURAÇÃO ESSENCIAL PARA KOYEB/RAILWAY
  // Deve vir logo após a criação do 'app'
  app.set('trust proxy', 1);

  const io = new SocketIOServer(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });
  
  // Middlewares de Segurança e Parsing
  setupHelmet(app);
  app.use(securityHeadersMiddleware);
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(sanitizeInput);

  // Health Check (Para o Koyeb saber que o site está vivo)
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // tRPC e Rotas Estáticas
  app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));
  
  // Se removeu o OAuth, comente a linha abaixo ou verifique se a função está vazia
  // registerOAuthRoutes(app);

  serveStatic(app);

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  }

  // No deploy, 0.0.0.0 é obrigatório para aceitar conexões externas
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