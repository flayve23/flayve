import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist", "public");
  
  console.log("[serveStatic] Serving from:", distPath);
  console.log("[serveStatic] Directory exists:", fs.existsSync(distPath));

  // Servir arquivos de assets com fs.readFile
  app.get("/assets/*", (req, res) => {
    const filePath = path.resolve(distPath, "assets", (req.params as Record<string, string>)[0]);
    console.log("[serveStatic] Requested:", req.path, "-> File:", filePath);
    
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath);
      const ext = path.extname(filePath);
      const mimeTypes: Record<string, string> = {
        ".js": "application/javascript",
        ".css": "text/css",
        ".svg": "image/svg+xml",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".gif": "image/gif",
        ".woff": "font/woff",
        ".woff2": "font/woff2",
      };
      res.set("Content-Type", mimeTypes[ext] || "application/octet-stream");
      res.send(content);
    } else {
      console.log("[serveStatic] File not found:", filePath);
      res.status(404).send("File not found");
    }
  });

  // Servir test.html
  app.get("/test.html", (_req, res) => {
    const filePath = path.resolve(distPath, "test.html");
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      res.set("Content-Type", "text/html");
      res.send(content);
    } else {
      res.status(404).send("test.html not found");
    }
  });

  // NOTE: SPA fallback é feito em index.ts DEPOIS das rotas tRPC
  // Não adicionar aqui para evitar conflito com /api/trpc
}
