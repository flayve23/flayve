# ⚡ Quick Start - Flayve em 30 Minutos

## 🎯 Objetivo

Colocar seu site no ar em 30 minutos com custo mínimo.

---

## ✅ Pré-requisitos (5 min)

- [ ] Conta GitHub (grátis em [github.com](https://github.com))
- [ ] Conta Vercel (grátis em [vercel.com](https://vercel.com))
- [ ] Conta Supabase (grátis em [supabase.com](https://supabase.com)) **← Novo!**
- [ ] Conta Mercado Pago (grátis em [mercadopago.com.br](https://mercadopago.com.br)) **← Novo!**

---

## 🚀 Passo 1: Preparar Banco de Dados (5 min)

### 1. Criar banco no Supabase (NOVO - Grátis!)

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Use GitHub para login
4. Clique em "New project"
5. Preencha:
   - **Project name:** `flayve`
   - **Database password:** (gere uma senha forte)
   - **Region:** `South America (São Paulo)`
6. Clique em "Create new project"

**Aguarde 2-3 minutos...**

### 2. Obter URL de Conexão

1. Vá em "Settings" → "Database"
2. Em "Connection string", selecione "URI"
3. Copie a string (exemplo: `postgresql://postgres:password@db.supabase.co:5432/postgres`)

**Guarde essa URL! 🔐**

> **Nota:** Se preferir usar Planetscale (pago), veja `MIGRATION_PLANETSCALE_TO_SUPABASE.md`

---

## 🔐 Passo 2: Gerar Chaves de Segurança (2 min)

No terminal/prompt do seu PC:

```bash
# Gerar JWT_SECRET
openssl rand -base64 32
# Copie o resultado

# Gerar ENCRYPTION_KEY (pode ser o mesmo)
openssl rand -base64 32
# Copie o resultado
```

---

## 💳 Passo 3: Configurar Mercado Pago (5 min) - NOVO!

1. Acesse [mercadopago.com.br](https://mercadopago.com.br)
2. Clique em "Criar conta"
3. Escolha "Sou vendedor"
4. Preencha seus dados
5. Verifique seu email
6. Configure dados bancários
7. Vá em "Configurações" → "Integrações" → "Credenciais"
8. Copie:
   - **Access Token:** `APP_USR_...`
   - **Public Key:** `APP_USR_...`

**Guarde essas chaves! 🔐**

> **Nota:** Se preferir usar Stripe (pago), veja `MIGRATION_STRIPE_TO_MERCADOPAGO.md`

---

## 📧 Passo 4: Configurar SendGrid (3 min)

1. Acesse [sendgrid.com](https://sendgrid.com)
2. Clique em "Sign Up"
3. Complete o cadastro
4. Vá em "Settings" → "API Keys"
5. Clique em "Create API Key"
6. Copie a chave

**Guarde essa chave! 🔐**

---

## 📧 Passo 4: Configurar SendGrid (3 min)

1. Acesse [sendgrid.com](https://sendgrid.com)
2. Clique em "Sign Up"
3. Complete o cadastro
4. Vá em "Settings" → "API Keys"
5. Clique em "Create API Key"
6. Copie a chave

**Guarde essa chave! 🔐**

## 📤 Passo 5: Upload para GitHub (5 min)

### Opção A: Usar Git (Recomendado)

```bash
# 1. Clonar repositório
git clone https://github.com/seu-usuario/flayve.git
cd flayve

# 2. Fazer alterações (já estão prontas!)

# 3. Fazer commit
git add .
git commit -m "Deploy inicial"

# 4. Fazer push
git push origin main
```

### Opção B: Upload Manual

1. Acesse [github.com](https://github.com)
2. Clique em "New" → "New repository"
3. Nomeie como `flayve`
4. Clique em "Create repository"
5. Arraste os arquivos para o GitHub

---

## 🌐 Passo 6: Deploy no Vercel (5 min)

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Clique em "Import Git Repository"
4. Selecione seu repositório `flayve`
5. Clique em "Import"

### Adicionar Variáveis de Ambiente

1. Vá em "Environment Variables"
2. Clique em "Add"
3. Preencha as variáveis:

```
DATABASE_URL = postgresql://postgres:password@db.supabase.co:5432/postgres
JWT_SECRET = (seu valor gerado)
ENCRYPTION_KEY = (seu valor gerado)
MERCADO_PAGO_ACCESS_TOKEN = APP_USR_...
VITE_MERCADO_PAGO_PUBLIC_KEY = APP_USR_...
SENDGRID_API_KEY = SG....
VITE_APP_TITLE = Flayve
NODE_ENV = production
```

4. Clique em "Deploy"

**Aguarde 5-10 minutos...**

---

## ✅ Verificar se Funcionou

1. Acesse o link que Vercel forneceu (exemplo: `flayve.vercel.app`)
2. Você deve ver a página inicial do Flayve
3. Teste o login
4. Teste um pagamento (use cartão `4242 4242 4242 4242`)

---

## 🎉 Parabéns!

Seu site está no ar! 🚀

---

## 📚 Próximos Passos

### Hoje:
- [ ] Testar login
- [ ] Testar pagamento
- [ ] Testar envio de email

### Esta Semana:
- [ ] Comprar domínio (namecheap.com)
- [ ] Apontar domínio para Vercel
- [ ] Ativar HTTPS (automático)

### Este Mês:
- [ ] Convidar primeiros usuários
- [ ] Coletar feedback
- [ ] Fazer melhorias

---

## 🆘 Problemas Comuns

### "Erro de conexão com banco"

**Solução:**
1. Verifique se DATABASE_URL está correto
2. Verifique se copiou a URL completa
3. Redeploy no Vercel

### "Erro de Stripe"

**Solução:**
1. Verifique se está usando chave de TESTE (`sk_test_`)
2. Copie a chave novamente
3. Redeploy

### "Site não carrega"

**Solução:**
1. Aguarde 10 minutos (Vercel está compilando)
2. Limpe cache do navegador (Ctrl+Shift+Del)
3. Verifique os logs no Vercel

---

## 📞 Suporte Rápido

| Problema | Solução |
|----------|---------|
| Vercel | [vercel.com/support](https://vercel.com/support) |
| Planetscale | [planetscale.com/docs](https://planetscale.com/docs) |
| Stripe | [stripe.com/docs](https://stripe.com/docs) |
| SendGrid | [sendgrid.com/docs](https://sendgrid.com/docs) |

---

## 📀 Custo Total

| Serviço | Custo |
|---------|-------|
| Vercel | R$ 0 (grátis) |
| Supabase | R$ 0 (grátis - 500MB) |
| Mercado Pago | R$ 0 (sem taxa mensal) |
| SendGrid | R$ 0 (100 emails/dia) |
| Domínio | R$ 40-50 |
| **TOTAL** | **~R$ 50/mês** |

**Economizou:** R$ 0! Tudo grátis! 🎉

---

## 🎯 Checklist Final

- [ ] Banco criado
- [ ] Chaves geradas
- [ ] GitHub configurado
- [ ] Vercel deployado
- [ ] Variáveis adicionadas
- [ ] Site funcionando
- [ ] Login testado
- [ ] Pagamento testado
- [ ] Email testado

---

**Você conseguiu! 🎉 Agora é hora de crescer!**

Para mais detalhes, leia:
- `DEPLOYMENT_GUIDE.md` - Guia completo
- `ENV_SETUP_GUIDE.md` - Variáveis de ambiente
- `SCALING_GUIDE.md` - Como crescer

**Boa sorte! 🚀**
