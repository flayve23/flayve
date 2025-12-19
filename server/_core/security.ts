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

/**
 * Configurar Helmet para proteção de headers HTTP
 */
export function setupHelmet(app: Express) {
  app.use(
    helmet({
      contentSecurityPolicy: false, // Desabilitar CSP temporariamente para desenvolvimento
    })
  );
}

/**
 * Middleware para gerar CSRF token
 */
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

/**
 * Middleware para validar CSRF token
 */
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

/**
 * Middleware para sanitizar inputs
 */
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

/**
 * Middleware para adicionar security headers
 */
export function securityHeadersMiddleware(req: Request, res: Response, next: NextFunction) {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  next();
}

/**
 * Validar CPF com algoritmo correto
 */
export function isValidCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11) return false;

  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;

  if (remainder !== parseInt(cpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;

  if (remainder !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}

/**
 * Validar email com regex simples
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validar telefone brasileiro
 */
export function isValidPhoneBR(phone: string): boolean {
  const phoneRegex = /^(\+55)?(\d{2})?(\d{4,5})(\d{4})$/;
  return phoneRegex.test(phone.replace(/\D/g, ""));
}

/**
 * Validar CEP brasileiro
 */
export function isValidCEP(cep: string): boolean {
  const cepRegex = /^\d{8}$/;
  return cepRegex.test(cep.replace(/\D/g, ""));
}

/**
 * Gerar hash seguro para dados sensíveis
 */
export function hashSensitiveData(data: string, salt: string = ""): string {
  const crypto = require("crypto");
  return crypto.createHash("sha256").update(data + salt).digest("hex");
}

/**
 * Validar força de senha
 */
export function isStrongPassword(password: string): {
  isStrong: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Senha deve ter no mínimo 8 caracteres");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Senha deve conter pelo menos uma letra maiúscula");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Senha deve conter pelo menos uma letra minúscula");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Senha deve conter pelo menos um número");
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push("Senha deve conter pelo menos um caractere especial (!@#$%^&*)");
  }

  return {
    isStrong: errors.length === 0,
    errors,
  };
}
