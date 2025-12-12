/**
 * Cache Module - Implementação com fallback em memória
 * Em produção, integrar com Redis real
 */

interface CacheEntry {
  value: any;
  expiresAt: number;
}

class MemoryCache {
  private cache: Map<string, CacheEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Limpar cache expirado a cada 5 minutos
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Obter valor do cache
   */
  get(key: string): any {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Verificar se expirou
    if (entry.expiresAt < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Definir valor no cache
   */
  set(key: string, value: any, ttlSeconds: number = 3600): void {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  /**
   * Deletar valor do cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Limpar todo o cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Limpar entradas expiradas
   */
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    this.cache.forEach((entry, key) => {
      if (entry.expiresAt < now) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => this.cache.delete(key));
  }

  /**
   * Destruir cache
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.clear();
  }
}

// Instância global de cache
const cache = new MemoryCache();

/**
 * Obter valor do cache
 */
export function cacheGet(key: string): any {
  return cache.get(key);
}

/**
 * Definir valor no cache
 */
export function cacheSet(key: string, value: any, ttlSeconds: number = 3600): void {
  cache.set(key, value, ttlSeconds);
}

/**
 * Deletar valor do cache
 */
export function cacheDelete(key: string): void {
  cache.delete(key);
}

/**
 * Limpar todo o cache
 */
export function cacheClear(): void {
  cache.clear();
}

/**
 * Padrão: Obter ou calcular
 */
export async function cacheGetOrCompute<T>(
  key: string,
  compute: () => Promise<T>,
  ttlSeconds: number = 3600
): Promise<T> {
  const cached = cacheGet(key);
  if (cached !== null) {
    return cached as T;
  }

  const value = await compute();
  cacheSet(key, value, ttlSeconds);
  return value;
}

/**
 * Invalidar cache por padrão (ex: "user:*")
 */
export function cacheInvalidatePattern(pattern: string): void {
  // Nota: MemoryCache não suporta padrões, apenas limpeza total
  // Em produção com Redis, usar KEYS pattern
  if (pattern === "*") {
    cacheClear();
  }
}

/**
 * Chaves de cache comuns
 */
export const CACHE_KEYS = {
  // Usuários
  USER_PROFILE: (userId: number) => `user:profile:${userId}`,
  USER_STATS: (userId: number) => `user:stats:${userId}`,
  STREAMER_PROFILE: (userId: number) => `streamer:profile:${userId}`,

  // Chamadas
  ACTIVE_CALLS: "calls:active",
  CALL_HISTORY: (userId: number) => `calls:history:${userId}`,

  // Transações
  USER_BALANCE: (userId: number) => `wallet:balance:${userId}`,
  TRANSACTION_HISTORY: (userId: number) => `transactions:history:${userId}`,

  // Leaderboard
  LEADERBOARD: "leaderboard:top",
  LEADERBOARD_EARNINGS: "leaderboard:earnings",

  // Tags
  ALL_TAGS: "tags:all",
  POPULAR_TAGS: "tags:popular",

  // Configurações
  PLATFORM_STATS: "platform:stats",
  PLATFORM_CONFIG: "platform:config",
};

/**
 * TTLs recomendados
 */
export const CACHE_TTL = {
  SHORT: 5 * 60, // 5 minutos
  MEDIUM: 30 * 60, // 30 minutos
  LONG: 60 * 60, // 1 hora
  VERY_LONG: 24 * 60 * 60, // 24 horas
};

/**
 * Destruir cache ao encerrar
 */
process.on("exit", () => {
  cache.destroy();
});
