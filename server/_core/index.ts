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
// ADICIONE ESTA IMPORTAÇÃO:
import { rateLimit } from "express-rate-limit";

async function startServer() {
  const app = express();
  const server = createServer(app);
  
  // CONFIGURAÇÃO ESSENCIAL PARA KOYEB/RAILWAY
  app.set('trust proxy', 1);

  // DEFINIÇÃO DO LIMITER (O que estava faltando no seu log de erro)
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    limit: 100, // limite de 100 requisições por IP
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    validate: { xForwardedForHeader: false }
  });

  const io = new SocketIOServer(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });
  
  // Middlewares de Segurança e Parsing
  setupHelmet(app);
  app.use(securityHeadersMiddleware);
  
  // APLICA O LIMITER AQUI:
  app.use(globalLimiter);

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(sanitizeInput);

  // Health Check
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // tRPC e Rotas Estáticas
  app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));
  
  // OAuth Routes (Verifique se a variável OAUTH_SERVER_URL está no Koyeb)
  registerOAuthRoutes(app);

  serveStatic(app);

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  }

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