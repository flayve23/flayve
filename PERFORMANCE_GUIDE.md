# 🚀 Guia de Performance - Flayve

## Implementações Realizadas

### 1. **Cache em Memória** (`server/_core/cache.ts`)
- ✅ Implementado cache com TTL automático
- ✅ Limpeza automática de entradas expiradas
- ✅ Padrão "get or compute" para queries
- ✅ Chaves de cache padronizadas

**Uso:**
```typescript
import { cacheGetOrCompute, CACHE_KEYS, CACHE_TTL } from "./cache";

// Obter perfil com cache
const profile = await cacheGetOrCompute(
  CACHE_KEYS.USER_PROFILE(userId),
  () => getProfileFromDB(userId),
  CACHE_TTL.MEDIUM
);
```

### 2. **Database Indexing** (`server/migrations/add_indexes.sql`)
- ✅ Índices em colunas frequentemente consultadas
- ✅ Índices compostos para queries comuns
- ✅ Índices em timestamps para ordenação

**Índices Adicionados:**
- `users`: openId, email, role, created_at
- `profiles`: userId, username, isStreamer, verified
- `callsHistory`: streamerId, viewerId, created_at, status
- `transactions`: userId, created_at, type, status
- `withdrawals`: userId, created_at, status
- `kycVerifications`: userId, status, created_at, cpf

### 3. **Rate Limiting** (Segurança + Performance)
- ✅ Global: 100 req/15min por IP
- ✅ Auth: 5 tentativas/15min
- ✅ Pagamento: 10 req/hora
- ✅ KYC: 3 submissões/dia

### 4. **Security Headers** (Performance + Segurança)
- ✅ Helmet para proteção de headers
- ✅ CSP para prevenir XSS
- ✅ HSTS para força HTTPS

---

## Próximas Otimizações (Recomendadas)

### **Fase 1: Redis Real** (Crítico para escala)
```bash
# Instalar Redis
docker run -d -p 6379:6379 redis:latest

# Instalar cliente Node.js
pnpm add redis
```

**Implementação:**
```typescript
import { createClient } from "redis";

const redisClient = createClient({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
});

export async function cacheGet(key: string) {
  const value = await redisClient.get(key);
  return value ? JSON.parse(value) : null;
}
```

### **Fase 2: CDN para Assets**
- Usar Cloudflare ou similar
- Servir imagens/vídeos via CDN
- Cache de 30 dias para assets estáticos

### **Fase 3: Database Connection Pooling**
```typescript
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
```

### **Fase 4: Query Optimization**
- Usar `SELECT` apenas colunas necessárias
- Evitar N+1 queries
- Usar `JOIN` em vez de múltiplas queries
- Implementar pagination

### **Fase 5: Image Optimization**
- Comprimir imagens no upload
- Gerar thumbnails
- Servir WebP quando possível

---

## Monitoramento

### **Logs de Performance**
```typescript
import { performance } from "perf_hooks";

function measureQuery(name: string, fn: () => Promise<any>) {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  
  if (duration > 1000) {
    console.warn(`[SLOW QUERY] ${name}: ${duration}ms`);
  }
  
  return result;
}
```

### **Métricas Recomendadas**
- Tempo de resposta médio
- Queries lentas (>1s)
- Taxa de cache hit
- Uso de memória
- Conexões ativas

---

## Checklist de Deployment

- [ ] Executar migrations de índices
- [ ] Configurar Redis (ou usar cache em memória)
- [ ] Configurar CDN para assets
- [ ] Ativar compression (gzip)
- [ ] Configurar rate limiting
- [ ] Implementar logging estruturado
- [ ] Configurar monitoramento (Sentry)
- [ ] Testar com 100+ usuários simultâneos
- [ ] Validar tempos de resposta (<200ms)
- [ ] Verificar uso de memória

---

## Benchmarks Esperados

| Métrica | Esperado | Crítico |
|---------|----------|---------|
| Tempo de resposta | <100ms | >500ms |
| Taxa de cache hit | >70% | <30% |
| Queries/segundo | 1000+ | <100 |
| Memória | <500MB | >2GB |
| CPU | <50% | >80% |

---

## Troubleshooting

### Problema: Queries Lentas
1. Verificar índices com `EXPLAIN`
2. Adicionar índice faltante
3. Refatorar query para usar JOIN

### Problema: Alto Uso de Memória
1. Reduzir TTL do cache
2. Limitar tamanho de resultados
3. Implementar pagination

### Problema: Taxa de Cache Hit Baixa
1. Aumentar TTL
2. Revisar padrões de acesso
3. Adicionar mais chaves ao cache

---

## Recursos

- [MySQL Indexing Best Practices](https://dev.mysql.com/doc/)
- [Redis Documentation](https://redis.io/documentation)
- [Node.js Performance](https://nodejs.org/en/docs/guides/simple-profiling/)
- [Web Performance Optimization](https://web.dev/performance/)
