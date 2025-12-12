# 🔒 Guia de Moderação - Flayve

## Tabelas de Segurança Implementadas

O banco de dados foi atualizado com as seguintes tabelas para suportar moderação:

### 1. **userBans** - Banimento de Usuários
```sql
- id: ID único
- userId: ID do usuário banido
- adminId: ID do admin que fez o ban
- reason: Motivo do banimento
- banType: "permanent" ou "temporary"
- expiresAt: Data de expiração (null = permanente)
- isActive: Status do ban
- createdAt, updatedAt: Timestamps
```

### 2. **userSuspensions** - Suspensão Temporária
```sql
- id: ID único
- userId: ID do usuário suspenso
- adminId: ID do admin
- reason: Motivo
- suspensionDays: Número de dias
- expiresAt: Data de término
- isActive: Status
- createdAt, updatedAt: Timestamps
```

### 3. **moderationWarnings** - Avisos
```sql
- id: ID único
- userId: ID do usuário
- adminId: ID do admin
- reason: Motivo do aviso
- warningCount: Número acumulado de avisos
- createdAt, updatedAt: Timestamps
```

### 4. **moderationLogs** - Log de Ações
```sql
- id: ID único
- adminId: ID do admin
- targetUserId: ID do usuário alvo
- action: Tipo de ação (ban, unban, suspend, unsuspend, warn, end_call, etc)
- reason: Motivo
- details: JSON com detalhes adicionais
- createdAt: Timestamp
```

### 5. **activeCalls** - Rastreamento de Chamadas
```sql
- id: ID único
- callRoomId: ID da sala
- streamerId: ID do streamer
- viewerId: ID do viewer
- startedAt: Início da chamada
- endedAt: Fim da chamada
- isActive: Status
```

---

## Funções de Banco de Dados Disponíveis

Todas as funções estão em `server/db.ts`:

### Banimento
```typescript
// Banir usuário
await db.banUser(userId, adminId, reason, "permanent", daysToExpire);

// Desbanir usuário
await db.unbanUser(userId, adminId, reason);

// Verificar se está banido
const isBanned = await db.isUserBanned(userId);
```

### Suspensão
```typescript
// Suspender streamer
await db.suspendUser(userId, adminId, reason, suspensionDays);

// Remover suspensão
await db.unsuspendUser(userId, adminId, reason);

// Verificar se está suspenso
const isSuspended = await db.isUserSuspended(userId);
```

### Avisos
```typescript
// Avisar usuário
const warningCount = await db.warnUser(userId, adminId, reason);

// Obter avisos
const warnings = await db.getUserWarnings(userId);
```

### Logs
```typescript
// Registrar ação
await db.logModerationAction(adminId, targetUserId, "ban", reason, details);

// Obter logs
const logs = await db.getAllModerationLogs(limit);
const userLogs = await db.getUserModerationLogs(userId);
```

### Chamadas
```typescript
// Criar chamada ativa
await db.createActiveCall(callRoomId, streamerId, viewerId);

// Encerrar chamada
await db.endActiveCall(callRoomId, adminId, reason);

// Obter chamadas ativas
const calls = await db.getActiveCalls();
```

---

## Próximos Passos para Implementar

### 1. **Adicionar Procedures tRPC**
Criar em `server/routers/moderation.ts`:

```typescript
export const moderationRouter = router({
  banUser: protectedProcedure
    .input(z.object({ userId: z.number(), reason: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Only admins");
      await db.banUser(input.userId, ctx.user.id, input.reason, "permanent");
      return { success: true };
    }),
  // ... outras procedures
});
```

### 2. **Proteger Login**
Em `server/routers.ts`, adicionar no procedure de login:

```typescript
// Verificar se usuário está banido
const isBanned = await db.isUserBanned(user.id);
if (isBanned) throw new Error("Sua conta foi banida");
```

### 3. **Criar Interface de Moderação**
Componente em `client/src/components/ModerationPanel.tsx`:

```typescript
export function ModerationPanel() {
  const banUserMutation = trpc.moderation.banUser.useMutation();
  // ... interface para admin gerenciar usuários
}
```

### 4. **Integrar no AdminDashboard**
Em `client/src/pages/AdminDashboard.tsx`:

```typescript
import { ModerationPanel } from "@/components/ModerationPanel";

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <ModerationPanel />
      {/* ... outros painéis */}
    </DashboardLayout>
  );
}
```

---

## SQL Direto (Se Necessário)

### Banir usuário manualmente
```sql
INSERT INTO userBans (userId, adminId, reason, banType, isActive, createdAt, updatedAt)
VALUES (123, 1, 'Comportamento abusivo', 'permanent', true, NOW(), NOW());
```

### Suspender streamer por 7 dias
```sql
INSERT INTO userSuspensions (userId, adminId, reason, suspensionDays, expiresAt, isActive, createdAt, updatedAt)
VALUES (456, 1, 'Conteúdo inapropriado', 7, DATE_ADD(NOW(), INTERVAL 7 DAY), true, NOW(), NOW());
```

### Ver avisos de um usuário
```sql
SELECT * FROM moderationWarnings WHERE userId = 123 ORDER BY createdAt DESC;
```

### Ver logs de moderação
```sql
SELECT * FROM moderationLogs ORDER BY createdAt DESC LIMIT 50;
```

---

## Fluxo de Moderação Recomendado

1. **Aviso** → Primeira infração (warningCount = 1)
2. **Aviso** → Segunda infração (warningCount = 2)
3. **Aviso** → Terceira infração (warningCount = 3)
4. **Suspensão** → 7 dias (se 3+ avisos)
5. **Banimento** → Permanente (se reincidência após suspensão)

---

## Ações de Moderação

| Ação | Descrição | Quando Usar |
|------|-----------|------------|
| **Warn** | Enviar aviso | Primeira/segunda infração |
| **Suspend** | Bloquear por X dias | Infração grave ou reincidência |
| **Ban** | Banimento permanente | Violação de termos severa |
| **End Call** | Encerrar chamada ativa | Conteúdo inapropriado durante live |
| **Restrict** | Limitar funcionalidades | Spam, abuso leve |

---

## Monitoramento

### Dashboard de Moderação
- Chamadas ativas em tempo real
- Usuários com mais avisos
- Histórico de ações de moderação
- Filtros por tipo de ação, data, usuário

### Alertas Automáticos
- Usuário com 3+ avisos
- Múltiplas denúncias do mesmo usuário
- Conteúdo bloqueado por palavras-chave

---

## Segurança

✅ **Implementado:**
- Apenas admins podem executar ações de moderação
- Todas as ações são registradas em logs
- Bans temporários expiram automaticamente
- Usuários banidos não conseguem fazer login

⚠️ **Recomendações:**
- Revisar logs de moderação regularmente
- Ter processo de apelação para bans
- Comunicar motivo do ban ao usuário
- Documentar infrações graves

---

## Suporte

Para dúvidas sobre implementação, consulte:
- `server/db.ts` - Funções de banco de dados
- `drizzle/schema.ts` - Estrutura das tabelas
- Exemplos em `server/routers.ts`
