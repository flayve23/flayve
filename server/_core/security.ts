import helmet from "helmet";
import rateLimit from "express-rate-limit";
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
          ...(process.env.NODE_ENV === "production" && { upgradeInsecureRequests: [] }),
        },
      },
      hsts: {
        maxAge: 31536000, // 1 ano
        includeSubDomains: true,
        preload: true,
      },
      frameguard: { action: "deny" },
      noSniff: true,
      xssFilter: true,
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    })
  );
}

/**
 * Rate limiting por IP
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requisições por janela
  message: "Muitas requisições deste IP, tente novamente mais tarde.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Não aplicar rate limit em health checks
    return req.path === "/health";
  },
});

/**
 * Rate limiting mais restritivo para login/registro
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas por janela
  message: "Muitas tentativas de login. Tente novamente em 15 minutos.",
  skipSuccessfulRequests: true,
  keyGenerator: (req) => {
    return req.body?.email || req.ip || "unknown";
  },
});

/**
 * Rate limiting para APIs de pagamento
 */
export const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // 10 requisições por hora
  message: "Limite de requisições de pagamento excedido.",
});

/**
 * Rate limiting para KYC
 */
export const kycLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 horas
  max: 3, // 3 submissões por dia
  message: "Você já atingiu o limite de submissões de KYC por dia.",
});

/**
 * Middleware para gerar CSRF token
 */
export function csrfTokenMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.session) {
    req.session = {};
  }

  // Gerar token CSRF se não existir
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString("hex");
  }

  // Adicionar token ao response header
  res.setHeader("X-CSRF-Token", req.session.csrfToken);

  // Adicionar ao locals para templates
  (res.locals as any).csrfToken = req.session.csrfToken;

  next();
}

/**
 * Middleware para validar CSRF token
 */
export function validateCsrfToken(req: Request, res: Response, next: NextFunction) {
  // Pular validação para GET, HEAD, OPTIONS
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  // Pular validação para health check
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
  // Sanitizar strings em req.body
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        // Remover caracteres perigosos
        req.body[key] = req.body[key]
          .replace(/[<>]/g, "") // Remove < e >
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
  // Prevenir clickjacking
  res.setHeader("X-Frame-Options", "DENY");

  // Prevenir MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Ativar XSS protection
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Política de referrer
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions policy (antigo Feature-Policy)
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=(), payment=()"
  );

  next();
}

/**
 * Validar CPF com algoritmo correto
 */
export function isValidCPF(cpf: string): boolean {
  // Remover caracteres especiais
  cpf = cpf.replace(/\D/g, "");

  // Verificar se tem 11 dígitos
  if (cpf.length !== 11) return false;

  // Verificar se não é uma sequência repetida
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Calcular primeiro dígito verificador
  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;

  if (remainder !== parseInt(cpf.substring(9, 10))) return false;

  // Calcular segundo dígito verificador
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
