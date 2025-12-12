# 🔄 Guia de Migração: Planetscale → Supabase

## Por que Supabase?

| Aspecto | Planetscale | Supabase |
|--------|------------|----------|
| Custo | Pago | **Grátis** |
| Tipo | MySQL | PostgreSQL |
| Limite Grátis | Nenhum | 500MB |
| Backup | Pago | Grátis |
| Auth | Não | **Sim** |
| Realtime | Não | **Sim** |
| Storage | Não | **Sim** |

---

## ✅ Passo 1: Criar Conta Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Use GitHub para login (mais fácil)
4. Clique em "New project"
5. Preencha:
   - **Project name:** `flayve`
   - **Database password:** (gere uma senha forte)
   - **Region:** `South America (São Paulo)` ou `us-east-1`
6. Clique em "Create new project"

**Aguarde 2-3 minutos enquanto o banco é criado...**

---

## 🔐 Passo 2: Obter String de Conexão

1. Vá em "Settings" → "Database"
2. Em "Connection string", selecione "URI"
3. Copie a string (exemplo):
```
postgresql://postgres:password@db.supabase.co:5432/postgres
```

**Guarde essa string! 🔐**

---

## 🔄 Passo 3: Atualizar Código

### 3.1 Instalar Driver PostgreSQL

```bash
pnpm add pg
pnpm add -D @types/pg
```

### 3.2 Atualizar drizzle.config.ts

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  driver: "pg", // Mudou de "mysql2" para "pg"
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
});
```

### 3.3 Atualizar Schema (se necessário)

Supabase usa PostgreSQL, que tem algumas diferenças:

```typescript
// Antes (MySQL):
export const users = mysqlTable("users", {
  id: int().primaryKey().autoincrement(),
  // ...
});

// Depois (PostgreSQL):
export const users = pgTable("users", {
  id: serial().primaryKey(),
  // ...
});
```

**Nota:** Se o schema já usa `pgTable`, não precisa mudar nada!

---

## 🚀 Passo 4: Fazer Migrations

```bash
# Gerar migrations
pnpm drizzle-kit generate:pg

# Executar migrations
pnpm drizzle-kit migrate
```

---

## 📊 Passo 5: Verificar Dados

1. Vá em Supabase → "SQL Editor"
2. Execute:
```sql
SELECT * FROM users LIMIT 5;
```

Se aparecer dados, funcionou! ✅

---

## 🔧 Passo 6: Configurar Variáveis de Ambiente

Atualize seu `.env.production`:

```env
# Antes (Planetscale):
# DATABASE_URL=mysql://user:pass@aws.connect.psdb.cloud/flayve

# Depois (Supabase):
DATABASE_URL=postgresql://postgres:password@db.supabase.co:5432/postgres
```

---

## 🧪 Passo 7: Testar Localmente

```bash
# Instalar dependências
pnpm install

# Testar conexão
pnpm build

# Se compilar sem erros, está tudo certo!
```

---

## 🌐 Passo 8: Deploy no Vercel

1. Vá em Vercel → Seu projeto → "Settings"
2. Vá em "Environment Variables"
3. Atualize `DATABASE_URL` com a string do Supabase
4. Clique em "Save"
5. Redeploy o projeto

---

## ⚠️ Diferenças MySQL vs PostgreSQL

| Aspecto | MySQL | PostgreSQL |
|--------|-------|-----------|
| Tipos | `int`, `varchar` | `serial`, `text` |
| Timestamps | `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` | `timestamp DEFAULT now()` |
| Booleanos | `TINYINT(1)` | `boolean` |
| Strings | `VARCHAR(255)` | `text` |
| Enums | Não nativo | Nativo |
| JSON | `JSON` | `jsonb` |

**Supabase cuida disso automaticamente!**

---

## 🆘 Troubleshooting

### Erro: "Connection refused"

**Solução:**
1. Verifique se DATABASE_URL está correto
2. Aguarde 5 minutos (Supabase pode estar iniciando)
3. Teste no SQL Editor do Supabase

### Erro: "Table does not exist"

**Solução:**
1. Execute migrations: `pnpm drizzle-kit migrate`
2. Verifique se as tabelas foram criadas no SQL Editor

### Erro: "Permission denied"

**Solução:**
1. Verifique a senha do banco
2. Verifique se o usuário é `postgres`
3. Regenere a senha em Supabase → Settings → Database

---

## 📈 Vantagens do Supabase

✅ **Grátis** (500MB)
✅ **PostgreSQL** (mais robusto)
✅ **Realtime** (WebSockets inclusos)
✅ **Auth** (autenticação nativa)
✅ **Storage** (arquivos inclusos)
✅ **Backups** (automáticos)
✅ **Suporte** (comunidade ativa)

---

## 🎯 Próximos Passos

1. ✅ Criar conta Supabase
2. ✅ Obter string de conexão
3. ✅ Atualizar código
4. ✅ Fazer migrations
5. ✅ Testar localmente
6. ✅ Deploy no Vercel

---

## 📞 Suporte

- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)
- **Drizzle ORM:** [orm.drizzle.team](https://orm.drizzle.team)
- **PostgreSQL:** [postgresql.org/docs](https://www.postgresql.org/docs/)

---

**Pronto! Seu banco agora é grátis e mais poderoso! 🚀**
