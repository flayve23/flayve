# 🔄 Guia de Migração: Stripe → Mercado Pago

## Por que Mercado Pago?

| Aspecto | Stripe | Mercado Pago |
|--------|--------|--------------|
| Custo | 2.9% + R$ 0,30 | 2.49% + R$ 0,49 |
| Setup | Complexo | Simples |
| Suporte | Inglês | Português |
| Saque | 2 dias | 1 dia |
| Público | Global | Brasil/LATAM |
| Documentação | Excelente | Boa |

---

## ✅ Passo 1: Criar Conta Mercado Pago

1. Acesse [mercadopago.com.br](https://mercadopago.com.br)
2. Clique em "Criar conta"
3. Escolha "Sou vendedor"
4. Preencha seus dados
5. Verifique seu email
6. Configure dados bancários

**Leva 10-15 minutos**

---

## 🔐 Passo 2: Obter Credenciais

1. Vá em "Configurações" → "Integrações"
2. Clique em "Credenciais"
3. Copie:
   - **Access Token:** `APP_USR_...`
   - **Public Key:** `APP_USR_...`

**Guarde essas chaves! 🔐**

---

## 📦 Passo 3: Instalar SDK

```bash
pnpm add mercadopago
```

---

## 🔄 Passo 4: Atualizar Código

### 4.1 Criar Arquivo de Integração

Crie `server/mercadopago-integration.ts`:

```typescript
import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

/**
 * Criar preferência de pagamento (checkout)
 */
export async function createPaymentPreference(params: {
  userId: number;
  amount: number;
  description: string;
  email: string;
}) {
  const preference = new Preference(client);

  return await preference.create({
    body: {
      items: [
        {
          title: params.description,
          unit_price: params.amount,
          quantity: 1,
        },
      ],
      payer: {
        email: params.email,
      },
      back_urls: {
        success: `${process.env.FRONTEND_URL}/payment-success`,
        failure: `${process.env.FRONTEND_URL}/payment-failure`,
        pending: `${process.env.FRONTEND_URL}/payment-pending`,
      },
      external_reference: `user_${params.userId}`,
      notification_url: `${process.env.BACKEND_URL}/api/webhooks/mercadopago`,
    },
  });
}

/**
 * Processar webhook de pagamento
 */
export async function processPaymentWebhook(data: any) {
  const payment = new Payment(client);

  const paymentData = await payment.get({
    id: data.data.id,
  });

  return {
    id: paymentData.id,
    status: paymentData.status,
    amount: paymentData.transaction_amount,
    externalReference: paymentData.external_reference,
  };
}

/**
 * Reembolsar pagamento
 */
export async function refundPayment(paymentId: number, amount?: number) {
  const payment = new Payment(client);

  return await payment.refund({
    id: paymentId,
    amount,
  });
}
```

### 4.2 Atualizar Routers tRPC

No `server/routers.ts`, atualize o procedure de pagamento:

```typescript
import { createPaymentPreference } from "./mercadopago-integration";

export const appRouter = router({
  // ... outros routers

  payment: router({
    createCheckout: protectedProcedure
      .input(z.object({
        amount: z.number().positive(),
        description: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const preference = await createPaymentPreference({
          userId: ctx.user.id,
          amount: input.amount,
          description: input.description,
          email: ctx.user.email,
        });

        return {
          checkoutUrl: preference.init_point,
          preferenceId: preference.id,
        };
      }),
  }),
});
```

### 4.3 Atualizar Frontend

No `client/src/pages/Payment.tsx`:

```typescript
import { useEffect } from "react";

export default function PaymentPage() {
  const { data: checkoutUrl } = trpc.payment.createCheckout.useMutation();

  const handlePayment = async () => {
    const result = await checkoutUrl.mutateAsync({
      amount: 100,
      description: "Créditos na plataforma",
    });

    // Redirecionar para Mercado Pago
    window.location.href = result.checkoutUrl;
  };

  return (
    <button onClick={handlePayment}>
      Pagar com Mercado Pago
    </button>
  );
}
```

---

## 🪝 Passo 5: Configurar Webhook

1. Vá em "Configurações" → "Webhooks"
2. Clique em "Adicionar novo webhook"
3. Preencha:
   - **URL:** `https://seu-dominio.com/api/webhooks/mercadopago`
   - **Eventos:** Selecione `payment.created` e `payment.updated`
4. Clique em "Salvar"

---

## 🧪 Passo 6: Testar Pagamento

### Teste Local

```bash
# Instalar ngrok para expor localhost
npm install -g ngrok

# Expor porta 3000
ngrok http 3000

# Usar URL do ngrok no webhook
```

### Teste em Produção

1. Use cartão de teste do Mercado Pago:
   - **Número:** `4111 1111 1111 1111`
   - **Validade:** `11/25`
   - **CVV:** `123`

2. Faça um pagamento de teste
3. Verifique se o webhook foi recebido

---

## 📊 Comparação de Código

### Stripe (Antes)

```typescript
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  line_items: [{
    price_data: {
      currency: "brl",
      unit_amount: amount * 100,
      product_data: { name: description },
    },
    quantity: 1,
  }],
  mode: "payment",
  success_url: `${process.env.FRONTEND_URL}/success`,
  cancel_url: `${process.env.FRONTEND_URL}/cancel`,
});
```

### Mercado Pago (Depois)

```typescript
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

const preference = new Preference(client);
const result = await preference.create({
  body: {
    items: [{
      title: description,
      unit_price: amount,
      quantity: 1,
    }],
    // ...
  },
});
```

---

## 🔄 Passo 7: Migrar Dados Históricos

Se você tinha pagamentos no Stripe:

```typescript
// Script para migrar dados
import { db } from "./db";

async function migrateStripeToMercadoPago() {
  const stripeTransactions = await db.query(
    "SELECT * FROM transactions WHERE provider = 'stripe'"
  );

  for (const tx of stripeTransactions) {
    await db.query(
      "UPDATE transactions SET provider = 'mercadopago' WHERE id = ?",
      [tx.id]
    );
  }

  console.log(`✅ ${stripeTransactions.length} transações migradas`);
}
```

---

## ⚠️ Diferenças Importantes

| Aspecto | Stripe | Mercado Pago |
|--------|--------|------------|
| Webhook | Signature verification | Token verification |
| Status | `succeeded`, `failed` | `approved`, `rejected` |
| Moeda | Qualquer | BRL, USD, ARS |
| Reembolso | Até 365 dias | Até 90 dias |
| Documentação | Inglês | Português |

---

## 🆘 Troubleshooting

### Erro: "Invalid access token"

**Solução:**
1. Verifique se copiou a chave corretamente
2. Verifique se está usando `APP_USR_` (não `APP_USR_TEST_`)
3. Regenere a chave em Mercado Pago

### Erro: "Webhook não recebido"

**Solução:**
1. Verifique se URL está correta
2. Verifique se servidor está rodando
3. Teste com ngrok localmente
4. Verifique logs em Mercado Pago → Webhooks

### Erro: "Cartão recusado"

**Solução:**
1. Use cartão de teste: `4111 1111 1111 1111`
2. Verifique se está em modo teste
3. Verifique limite de crédito

---

## 📈 Vantagens do Mercado Pago

✅ **Mais barato** (2.49% vs 2.9%)
✅ **Saque mais rápido** (1 dia vs 2 dias)
✅ **Suporte em português**
✅ **Melhor para Brasil**
✅ **Integração simples**
✅ **Webhook confiável**

---

## 🎯 Próximos Passos

1. ✅ Criar conta Mercado Pago
2. ✅ Obter credenciais
3. ✅ Instalar SDK
4. ✅ Atualizar código
5. ✅ Configurar webhook
6. ✅ Testar pagamento
7. ✅ Deploy

---

## 📞 Suporte

- **Mercado Pago Docs:** [developers.mercadopago.com.br](https://developers.mercadopago.com.br)
- **SDK Node.js:** [github.com/mercadopago/sdk-nodejs](https://github.com/mercadopago/sdk-nodejs)
- **Suporte:** [support.mercadopago.com.br](https://support.mercadopago.com.br)

---

**Pronto! Seus pagamentos agora são mais baratos e rápidos! 💰**
