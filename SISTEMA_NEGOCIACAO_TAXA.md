# 💰 SISTEMA DE NEGOCIAÇÃO DE TAXA POR STREAMER

## Visão Geral

Para reter modelos TOP e ser competitivo, você precisa oferecer comissões personalizadas baseadas em:

- **Número de clientes que traz** (referrals)
- **Volume de chamadas** (performance)
- **Tempo de permanência** (lealdade)
- **Qualidade de conteúdo** (avaliações)

---

## Modelo de Comissão Escalonada

### Estrutura Base:

```
Modelo Iniciante (0-50 chamadas/mês)
├─ Comissão: 60%
├─ Você recebe: 40%
└─ Objetivo: Incentivar a começar

Modelo Intermediária (50-200 chamadas/mês)
├─ Comissão: 70%
├─ Você recebe: 30%
└─ Objetivo: Retenção

Modelo Experiente (200-500 chamadas/mês)
├─ Comissão: 75%
├─ Você recebe: 25%
└─ Objetivo: Fidelização

Modelo TOP (500+ chamadas/mês)
├─ Comissão: 80-85%
├─ Você recebe: 15-20%
├─ Benefícios: Salário fixo, bônus, suporte VIP
└─ Objetivo: Parceria estratégica
```

---

## Bônus por Performance

### Bônus Mensal de Volume:

```
Se modelo faz X chamadas no mês:
├─ 100 chamadas → Bônus R$ 100
├─ 200 chamadas → Bônus R$ 300
├─ 300 chamadas → Bônus R$ 600
├─ 500 chamadas → Bônus R$ 1.000
└─ 1.000 chamadas → Bônus R$ 2.500
```

### Bônus de Referral:

```
Modelo convida amiga que se cadastra:
├─ 1 amiga → R$ 100
├─ 3 amigas → R$ 500
├─ 5 amigas → R$ 1.000
└─ 10 amigas → R$ 3.000 + 1% de comissão vitalícia
```

### Bônus de Avaliação:

```
Modelo recebe média de avaliação:
├─ 4.5+ estrelas (50+ avaliações) → +2% comissão
├─ 4.8+ estrelas (100+ avaliações) → +3% comissão
└─ 4.9+ estrelas (200+ avaliações) → +5% comissão
```

---

## Implementação Técnica

### 1. Tabela de Comissões no Banco de Dados

```sql
CREATE TABLE streamer_commissions (
  id INT PRIMARY KEY,
  streamer_id INT FOREIGN KEY,
  base_commission DECIMAL(5,2),  -- 60-85%
  referral_bonus DECIMAL(10,2),  -- R$ 0-3000
  performance_bonus DECIMAL(10,2),  -- R$ 0-2500
  loyalty_bonus DECIMAL(5,2),  -- 0-5%
  total_commission DECIMAL(5,2),  -- Soma de tudo
  effective_date DATE,
  notes TEXT,  -- Motivo da negociação
  created_at TIMESTAMP
);
```

### 2. Procedure tRPC para Calcular Comissão

```typescript
// server/routers.ts

streamer: router({
  getCommission: protectedProcedure
    .input(z.object({ streamerId: z.number() }))
    .query(async ({ input, ctx }) => {
      const streamer = await db.getStreamerById(input.streamerId);
      const commission = await db.getStreamerCommission(input.streamerId);
      
      // Calcular comissão total
      const totalCommission = 
        commission.base_commission +
        (commission.loyalty_bonus || 0) +
        (commission.referral_bonus > 0 ? 2 : 0);
      
      return {
        baseCommission: commission.base_commission,
        loyaltyBonus: commission.loyalty_bonus,
        referralBonus: commission.referral_bonus,
        performanceBonus: commission.performance_bonus,
        totalCommission,
        notes: commission.notes
      };
    }),

  updateCommission: adminProcedure
    .input(z.object({
      streamerId: z.number(),
      baseCommission: z.number().min(60).max(85),
      notes: z.string(),
    }))
    .mutation(async ({ input }) => {
      await db.updateStreamerCommission({
        streamerId: input.streamerId,
        baseCommission: input.baseCommission,
        notes: input.notes,
        effectiveDate: new Date()
      });
      
      return { success: true };
    }),
});
```

### 3. Dashboard Admin para Gerenciar Comissões

```typescript
// client/src/pages/AdminCommissions.tsx

export function AdminCommissions() {
  const [streamers, setStreamers] = useState([]);
  const updateCommissionMutation = trpc.admin.updateCommission.useMutation();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Comissões</h1>
      
      <table className="w-full border">
        <thead>
          <tr>
            <th>Modelo</th>
            <th>Chamadas/Mês</th>
            <th>Comissão Base</th>
            <th>Bônus Lealdade</th>
            <th>Bônus Referral</th>
            <th>Total</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {streamers.map(streamer => (
            <tr key={streamer.id}>
              <td>{streamer.name}</td>
              <td>{streamer.callsPerMonth}</td>
              <td>
                <input 
                  type="number" 
                  value={streamer.commission.baseCommission}
                  onChange={(e) => updateCommissionMutation.mutate({
                    streamerId: streamer.id,
                    baseCommission: parseFloat(e.target.value),
                    notes: `Ajuste manual - ${new Date().toLocaleDateString()}`
                  })}
                />
              </td>
              <td>{streamer.commission.loyaltyBonus}%</td>
              <td>R$ {streamer.commission.referralBonus}</td>
              <td className="font-bold">{streamer.commission.totalCommission}%</td>
              <td>
                <button onClick={() => openNegotiationModal(streamer)}>
                  Negociar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## Fluxo de Negociação

### Passo 1: Modelo Solicita Aumento

**Interface no Dashboard de Streamer:**

```typescript
// client/src/pages/StreamerDashboard.tsx

<div className="bg-blue-50 p-4 rounded">
  <h3>Sua Comissão Atual: 70%</h3>
  <p>Você fez 250 chamadas este mês!</p>
  <button className="bg-blue-500 text-white px-4 py-2 rounded">
    Solicitar Aumento de Comissão
  </button>
</div>
```

**Modal de Solicitação:**

```typescript
<Dialog>
  <DialogTitle>Solicitar Aumento de Comissão</DialogTitle>
  <DialogContent>
    <div className="space-y-4">
      <div>
        <label>Comissão Atual: 70%</label>
      </div>
      <div>
        <label>Comissão Desejada:</label>
        <input type="number" min="70" max="85" />
      </div>
      <div>
        <label>Justificativa:</label>
        <textarea 
          placeholder="Por que você merece um aumento?"
          defaultValue="Fiz 250 chamadas este mês, tenho 4.8 estrelas de avaliação..."
        />
      </div>
      <button onClick={submitRequest}>Enviar Solicitação</button>
    </div>
  </DialogContent>
</Dialog>
```

### Passo 2: Admin Recebe Notificação

**Painel Admin:**

```typescript
// client/src/pages/AdminDashboard.tsx

<Card className="bg-yellow-50 border-yellow-300">
  <CardTitle>Solicitações de Aumento Pendentes</CardTitle>
  <div className="space-y-3">
    {requests.map(req => (
      <div key={req.id} className="p-3 bg-white rounded border">
        <p><strong>{req.streamer.name}</strong> solicita aumento</p>
        <p>De: 70% → Para: 75%</p>
        <p>Justificativa: {req.justification}</p>
        <p>Performance: 250 chamadas/mês, 4.8 ⭐</p>
        <div className="flex gap-2 mt-2">
          <button 
            className="bg-green-500 text-white px-3 py-1 rounded"
            onClick={() => approveRequest(req.id)}
          >
            Aprovar
          </button>
          <button 
            className="bg-red-500 text-white px-3 py-1 rounded"
            onClick={() => rejectRequest(req.id)}
          >
            Rejeitar
          </button>
          <button 
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={() => openNegotiationChat(req.id)}
          >
            Negociar
          </button>
        </div>
      </div>
    ))}
  </div>
</Card>
```

### Passo 3: Negociação em Tempo Real

**Chat de Negociação:**

```typescript
// Implementar chat simples entre admin e streamer

Admin: "Oi! Vi sua solicitação. Você está indo bem!"
Admin: "Posso oferecer 73% em vez de 75%?"
Admin: "Mas se você trazer 5 amigas, você sobe para 76%"

Streamer: "Ok, 73% está bom!"
Streamer: "Já tenho 3 amigas interessadas"

Admin: "Perfeito! Já atualizei seu perfil para 73%"
Admin: "Quando suas amigas se cadastrarem, você sobe para 76%"
```

---

## Exemplo de Negociação Real

### Cenário 1: Modelo Iniciante

```
Modelo: "Oi, gostaria de aumentar minha comissão"
Você: "Claro! Você está fazendo ótimo trabalho. 
       Você fez 50 chamadas este mês.
       Posso oferecer 65% em vez de 60%."
Modelo: "Obrigada! Vou continuar trabalhando duro"
```

### Cenário 2: Modelo TOP

```
Modelo: "Recebi proposta de outra plataforma com 80%"
Você: "Entendo. Você é uma das nossas melhores modelos.
       Posso oferecer 82% + R$ 500/mês de bônus fixo
       + 2% de comissão vitalícia de cada modelo que você trazer"
Modelo: "Ótimo! Fico com vocês"
```

### Cenário 3: Modelo em Risco de Sair

```
Modelo: "Estou pensando em sair"
Você: "Que pena! O que falta? Posso melhorar algo?"
Modelo: "Saque é muito lento"
Você: "Vou colocar você em prioridade. 
       Seus saques saem em 24h a partir de hoje.
       E vou aumentar sua comissão para 75%"
Modelo: "Ótimo! Fico!"
```

---

## Métricas para Monitorar

### Churn de Modelos:

```
Modelos que saem por mês / Total de modelos = Taxa de Churn

Meta: < 10% ao mês
Ação: Se > 15%, aumentar comissão média
```

### Satisfação de Modelos:

```
Pesquisa mensal:
- Você está satisfeito com sua comissão? (1-5)
- Você recomendaria Flayve para outras modelos? (Sim/Não)
- O que podemos melhorar? (Texto livre)
```

### Receita por Modelo:

```
Receita Total / Número de Modelos = Receita Média por Modelo

Se cair, significa:
- Modelos menos ativas
- Comissões muito altas
- Falta de clientes
```

---

## Conclusão

Um bom sistema de negociação de taxa:

1. **Retém modelos TOP** - Evita perder seus melhores talentos
2. **Incentiva crescimento** - Modelos trabalham mais para ganhar mais
3. **É justo** - Baseado em performance, não em favoritismo
4. **É escalável** - Funciona com 10 ou 1.000 modelos
5. **Aumenta receita** - Mais modelos = mais clientes = mais receita

**Próximo Passo:** Implementar este sistema quando tiver 20-30 modelos.
