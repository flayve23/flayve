import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "default-key-change-in-production";
const ALGORITHM = "aes-256-gcm";

/**
 * Criptografar dados sensíveis (dados bancários)
 */
export function encryptSensitiveData(data: string): string {
  try {
    const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag();

    // Retornar IV + authTag + dados criptografados
    return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
  } catch (error) {
    console.error("Erro ao criptografar dados:", error);
    throw new Error("Falha ao criptografar dados sensíveis");
  }
}

/**
 * Descriptografar dados sensíveis
 */
export function decryptSensitiveData(encryptedData: string): string {
  try {
    const [ivHex, authTagHex, encrypted] = encryptedData.split(":");

    if (!ivHex || !authTagHex || !encrypted) {
      throw new Error("Formato de dados criptografados inválido");
    }

    const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32);
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Erro ao descriptografar dados:", error);
    throw new Error("Falha ao descriptografar dados sensíveis");
  }
}

/**
 * Hash de senha com salt
 */
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return { hash, salt };
}

/**
 * Verificar senha
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const hashToCompare = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return hashToCompare === hash;
}

/**
 * Gerar token seguro
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString("hex");
}

/**
 * Gerar hash de dados para verificação de integridade
 */
export function generateHash(data: string): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

/**
 * Verificar hash
 */
export function verifyHash(data: string, hash: string): boolean {
  return generateHash(data) === hash;
}
