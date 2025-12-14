import helmet from "helmet";
import { Express, Request, Response, NextFunction } from "express";
import crypto from "crypto";
import CryptoJS from "crypto-js";

declare global {
  namespace Express {
    interface Request {
      session?: { csrfToken?: string };
    }
  }
}

export function setupHelmet(app: Express) {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
          styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
          imgSrc: ["'self'", "data:", "https:"],
          fontSrc: ["'self'", "fonts.gstatic.com"],
          connectSrc: ["'self'", "https:", "wss:"],
          frameSrc: ["'self'"],
          objectSrc: ["'none'"],
        },
      },
    } )
  );
}

// Dummy rate limiters (desabilitados temporariamente)
export const globalLimiter = (req: any, res: any, next: any) => next();
export const authLimiter = (req: any, res: any, next: any) => next();
export const paymentLimiter = (req: any, res: any, next: any) => next();
export const kycLimiter = (req: any, res: any, next: any) => next();

export function csrfTokenMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.session) {
    req.session = {};
  }
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString("hex");
  }
  res.setHeader("X-CSRF-Token", req.session.csrfToken);
  (res.locals as any).csrfToken = req.session.csrfToken;
  next();
}

export function validateCsrfToken(req: Request, res: Response, next: NextFunction) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }
  if (req.path === "/health") {
    return next();
  }
  const token = (req.headers["x-csrf-token"] as string) || (req.body as any)?.csrfToken;
  const sessionToken = (req.session as any)?.csrfToken;
  if (!token || token !== sessionToken) {
    return res.status(403).json({
      error: "CSRF token inválido",
      code: "CSRF_VALIDATION_FAILED",
    });
  }
  next();
}

export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = req.body[key]
          .replace(/[<>]/g, "")
          .trim();
      }
    }
  }
  next();
}
