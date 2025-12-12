# 🔐 Guia de Configuração de Variáveis de Ambiente

## O que são Variáveis de Ambiente?

São informações sensíveis (senhas, chaves de API) que seu site precisa para funcionar, mas você não quer deixar visível no código.

---

## Variáveis Necessárias

### **1. Banco de Dados (Obrigatório) - SUPABASE**

```
DATABASE_URL=postgresql://postgres:password@db.supabase.co:5432/postgres
```

**Como obter:**
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta (use GitHub)
3. Crie um projeto chamado `flayve`
4. Vá em "Settings" → "Database"
5. Copie a "Connection string" (URI)

> **Alternativa:** Se preferir Planetscale (pago), veja `MIGRATION_PLANETSCALE_TO_SUPABASE.md`

---

### **2. Segurança (Obrigatório)**

```
JWT_SECRET=seu_segredo_super_secreto_aqui_123456789
ENCRYPTION_KEY=sua_chave_de_criptografia_aqui
```

**Como gerar:**
```bash
# No terminal/prompt, execute:
openssl rand -base64 32
```

Copie o resultado para ambas as variáveis (pode ser o mesmo valor).

---

### **3. Mercado Pago - Pagamentos (Obrigatório) - NOVO!**

```
MERCADO_PAGO_ACCESS_TOKEN=APP_USR_seu_access_token_aqui
VITE_MERCADO_PAGO_PUBLIC_KEY=APP_USR_sua_chave_publica_aqui
```

**Como obter:**
1. Acesse [mercadopago.com.br](https://mercadopago.com.br)
2. Crie uma conta
3. Vá em "Configurações" → "Integrações" → "Credenciais"
4. Copie as chaves

> **Alternativa:** Se preferir Stripe (pago), veja `MIGRATION_STRIPE_TO_MERCADOPAGO.md### **4. Stripe - Pagamentos Alternativos (Opcional)**

```
STRIPE_SECRET_KEY=sk_test_seu_chave_secreta_aqui
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret_aqui
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave_publica_aqui
```

**Como obter:**
1. Acesse [dashboard.stripe.com](https://dashboard.stripe.com)
2. Crie uma conta
3. Vá em "Developers" → "API Keys"
4. Copie as chaves de teste

### **5. SendGrid - Emails (Obrigatório) - NOVO!**

```
SENDGRID_API_KEY=SG.seu_chave_api_aqui
```

**Como obter:**
1. Acesse [sendgrid.com](https://sendgrid.com)
2. Crie uma conta
3. Vá em "Settings" → "API Keys"
4. Clique em "Create API Key"
5. Copie a chave

---

### **6. Manus APIs (Fornecido automaticamente)**

```
VITE_APP_ID=seu_app_id_aqui
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_chave_api_aqui
VITE_FRONTEND_FORGE_API_KEY=sua_chave_frontend_aqui
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
```

**Como obter:**
- Manus fornece automaticamente quando você cria a aplicação

---

### **7. Informações do Proprietário (Obrigatório)**

```
OWNER_NAME=Seu Nome Completo
OWNER_OPEN_ID=seu_open_id_do_manus
```

**Como obter:**
- Use seu nome e open_id do Manus

---

### **8. Informações do App (Obrigatório)**

```
VITE_APP_TITLE=Flayve
VITE_APP_LOGO=/logo.png
NODE_ENV=production
```

---

### **9. Analytics (Opcional)**

```
VITE_ANALYTICS_ENDPOINT=https://analytics.seu-dominio.com
VITE_ANALYTICS_WEBSITE_ID=seu_website_id
```

---

## Onde Colocar as Variáveis?

### **Opção 1: Vercel**

1. Vá para seu projeto no Vercel
2. Clique em "Settings"
3. Vá em "Environment Variables"
4. Clique em "Add"
5. Preencha "Name" e "Value"
6. Clique em "Save"
7. Redeploy o projeto

### **Opção 2: Railway**

1. Vá para seu projeto no Railway
2. Clique em "Variables"
3. Clique em "New Variable"
4. Preencha "Name" e "Value"
5. Clique em "Add"
6. Railway redeploy automaticamente

### **Opção 3: DigitalOcean (VPS)**

Crie um arquivo `.env.production` na raiz do projeto:

```bash
nano .env.production
```

Cole todas as variáveis:

```
DATABASE_URL=...
JWT_SECRET=...
STRIPE_SECRET_KEY=...
# ... etc
```

Salve com `Ctrl+X`, depois `Y`, depois `Enter`.

---

## Checklist de Variáveis

- [ ] DATABASE_URL (Supabase)
- [ ] JWT_SECRET
- [ ] ENCRYPTION_KEY
- [ ] MERCADO_PAGO_ACCESS_TOKEN
- [ ] VITE_MERCADO_PAGO_PUBLIC_KEY
- [ ] SENDGRID_API_KEY
- [ ] VITE_APP_ID
- [ ] OWNER_NAME
- [ ] OWNER_OPEN_ID
- [ ] VITE_APP_TITLE
- [ ] NODE_ENV=production

---

## ⚠️ Segurança

**NUNCA:**
- ❌ Coloque variáveis no código
- ❌ Commite `.env.production` no Git
- ❌ Compartilhe suas chaves com ninguém
- ❌ Use chaves de teste em produção

**SEMPRE:**
- ✅ Use chaves diferentes para teste e produção
- ✅ Regenere chaves se achar que foram comprometidas
- ✅ Use variáveis de ambiente
- ✅ Rotacione chaves regularmente

---

## Teste de Configuração

Depois de configurar, teste com:

```bash
# Verificar se variáveis estão carregadas
node -e "console.log(process.env.DATABASE_URL ? '✅ OK' : '❌ Erro')"
```

Se aparecer `✅ OK`, está tudo certo!

---

## Troubleshooting

### Erro: "DATABASE_URL não definida"

**Solução:**
1. Verifique se você adicionou a variável corretamente
2. Redeploy o projeto
3. Aguarde 2-3 minutos
4. Teste novamente

### Erro: "Stripe key inválida"

**Solução:**
1. Verifique se está usando chave de TESTE (começa com `sk_test_`)
2. Copie novamente a chave do Stripe
3. Redeploy

### Erro: "Conexão com banco recusada"

**Solução:**
1. Verifique se DATABASE_URL está correta
2. Verifique se o IP do servidor está na whitelist do Planetscale
3. Teste a conexão diretamente no Planetscale

---

## Próximos Passos

Depois de configurar as variáveis:
1. Faça deploy
2. Teste o login
3. Teste um pagamento (use cartão de teste do Stripe)
4. Teste envio de email
5. Tudo funcionando? Parabéns! 🎉
