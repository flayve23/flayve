# 🚀 Guia Completo de Deployment - FLAYVE
## Para Leigos (Sem Jargão Técnico)

---

## 📋 ÍNDICE

1. [O que você vai precisar](#o-que-você-vai-precisar)
2. [Passo 1: Preparar o Servidor](#passo-1-preparar-o-servidor)
3. [Passo 2: Instalar Dependências](#passo-2-instalar-dependências)
4. [Passo 3: Configurar Banco de Dados](#passo-3-configurar-banco-de-dados)
5. [Passo 4: Configurar Variáveis de Ambiente](#passo-4-configurar-variáveis-de-ambiente)
6. [Passo 5: Fazer Deploy](#passo-5-fazer-deploy)
7. [Passo 6: Configurar Domínio](#passo-6-configurar-domínio)
8. [Passo 7: Ativar HTTPS](#passo-7-ativar-https)
9. [Troubleshooting](#troubleshooting)

---

## O que você vai precisar

### **Serviços (Gratuitos ou Baratos)**

| Serviço | Função | Custo Inicial | Recomendação |
|---------|--------|---------------|--------------|
| **Vercel** ou **Railway** | Hospedar seu site | Grátis até 100 usuários | ⭐ Recomendado |
| **Planetscale** | Banco de dados MySQL | Grátis até 10GB | ⭐ Recomendado |
| **Stripe** | Receber pagamentos | Sem taxa mensal | ⭐ Recomendado |
| **SendGrid** | Enviar emails | 100 emails/dia grátis | ⭐ Recomendado |
| **Cloudflare** | Domínio + segurança | Grátis | ⭐ Recomendado |

### **Ferramentas (Instalar no seu PC)**

- **Git** - Controle de versão (como um "histórico" do seu código)
- **Node.js** - Ambiente para rodar seu site
- **npm/pnpm** - Gerenciador de pacotes (instala bibliotecas)

---

## PASSO 1: Preparar o Servidor

### **Opção A: Vercel (Mais Fácil - Recomendado)**

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Sign Up" (Cadastrar)
3. Use sua conta GitHub (ou crie uma)
4. Autorize Vercel a acessar seus repositórios

**Pronto! Seu servidor está criado.**

### **Opção B: Railway (Alternativa)**

1. Acesse [railway.app](https://railway.app)
2. Clique em "Start Project"
3. Selecione "Deploy from GitHub"
4. Autorize Railway a acessar GitHub

**Pronto! Seu servidor está criado.**

### **Opção C: VPS Barato (Para Avançados)**

Se quiser controle total:
- **DigitalOcean** - $5/mês (Droplet básico)
- **Linode** - $5/mês
- **Vultr** - $2.50/mês

Neste caso, pule para a seção "Deployment Manual" abaixo.

---

## PASSO 2: Instalar Dependências

### **No seu PC (Windows/Mac/Linux):**

#### 1. Instalar Git
- Windows: [git-scm.com](https://git-scm.com/download/win)
- Mac: `brew install git`
- Linux: `sudo apt install git`

#### 2. Instalar Node.js
- Acesse [nodejs.org](https://nodejs.org)
- Baixe a versão "LTS" (mais estável)
- Execute o instalador

#### 3. Verificar Instalação
Abra o terminal/prompt e digite:
```bash
node --version
npm --version
```

Se aparecer um número de versão, está tudo certo!

---

## PASSO 3: Configurar Banco de Dados

### **Planetscale (Recomendado - Grátis)**

1. Acesse [planetscale.com](https://planetscale.com)
2. Clique em "Sign Up"
3. Crie uma conta (use GitHub para facilitar)
4. Clique em "Create a database"
5. Nomeie como `flayve`
6. Clique em "Create database"
7. Vá em "Passwords" e clique em "Create password"
8. Copie a string de conexão (URL do banco)

**Exemplo de URL:**
```
mysql://user:password@aws.connect.psdb.cloud/flayve?sslaccept=strict
```

**Guarde essa URL! Você vai precisar dela.**

---

## PASSO 4: Configurar Variáveis de Ambiente

### **O que são Variáveis de Ambiente?**

São informações sensíveis (senhas, chaves) que seu site precisa, mas você não quer colocar no código.

### **Criar arquivo `.env.production`**

Na pasta raiz do seu projeto, crie um arquivo chamado `.env.production` com:

```env
# Banco de Dados
DATABASE_URL=mysql://user:password@aws.connect.psdb.cloud/flayve?sslaccept=strict

# Segurança
JWT_SECRET=seu_segredo_super_secreto_aqui_123456789

# OAuth (Manus)
VITE_APP_ID=seu_app_id_aqui
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# Stripe (Pagamentos)
STRIPE_SECRET_KEY=sk_test_seu_chave_aqui
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_aqui
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_seu_chave_publica

# Mercado Pago
VITE_MERCADO_PAGO_PUBLIC_KEY=APP_USR_seu_chave_publica
MERCADO_PAGO_ACCESS_TOKEN=seu_access_token

# SendGrid (Emails)
SENDGRID_API_KEY=SG.seu_chave_aqui

# Manus Built-in APIs
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_chave_aqui
VITE_FRONTEND_FORGE_API_KEY=sua_chave_frontend
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im

# Owner Info
OWNER_NAME=Seu Nome
OWNER_OPEN_ID=seu_open_id

# Analytics
VITE_ANALYTICS_ENDPOINT=https://analytics.seu_dominio.com
VITE_ANALYTICS_WEBSITE_ID=seu_website_id

# App Info
VITE_APP_TITLE=Flayve
VITE_APP_LOGO=/logo.png

# Node Environment
NODE_ENV=production
```

### **Onde Obter Essas Chaves?**

| Variável | Onde Obter |
|----------|-----------|
| `DATABASE_URL` | Planetscale (passo anterior) |
| `JWT_SECRET` | Gere uma senha aleatória (ex: `openssl rand -base64 32`) |
| `STRIPE_*` | [dashboard.stripe.com](https://dashboard.stripe.com) → API Keys |
| `SENDGRID_API_KEY` | [sendgrid.com](https://sendgrid.com) → Settings → API Keys |
| Outras | Manus fornece automaticamente |

---

## PASSO 5: Fazer Deploy

### **Opção A: Vercel (Automático)**

1. Faça push do seu código para GitHub:
```bash
git add .
git commit -m "Deploy inicial"
git push origin main
```

2. No Vercel, clique em "New Project"
3. Selecione seu repositório `flayve`
4. Clique em "Import"
5. Em "Environment Variables", adicione todas as variáveis do `.env.production`
6. Clique em "Deploy"

**Pronto! Seu site está no ar em alguns minutos!**

### **Opção B: Railway (Automático)**

1. Faça push do seu código para GitHub (mesmo que acima)
2. No Railway, clique em "New Project"
3. Selecione "Deploy from GitHub repo"
4. Escolha seu repositório
5. Clique em "Deploy"
6. Em "Variables", adicione todas as variáveis do `.env.production`
7. Railway faz deploy automático!

**Pronto! Seu site está no ar!**

### **Opção C: DigitalOcean (Manual - Para Avançados)**

```bash
# 1. SSH no seu servidor
ssh root@seu_ip_do_servidor

# 2. Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Instalar PM2 (gerenciador de processo)
sudo npm install -g pm2

# 4. Clonar seu repositório
git clone https://github.com/seu_usuario/flayve.git
cd flayve

# 5. Instalar dependências
npm install

# 6. Criar arquivo .env.production (copie as variáveis acima)
nano .env.production

# 7. Compilar para produção
npm run build

# 8. Iniciar com PM2
pm2 start "npm start" --name flayve
pm2 save
pm2 startup

# 9. Configurar Nginx como proxy reverso
sudo apt install nginx
# (Veja seção de Nginx abaixo)
```

---

## PASSO 6: Configurar Domínio

### **Comprar Domínio**

1. Acesse [namecheap.com](https://namecheap.com) ou [godaddy.com](https://godaddy.com)
2. Procure por `seu-dominio.com.br`
3. Clique em "Add to Cart"
4. Complete o pagamento (R$ 30-50/ano)

### **Apontar Domínio para Vercel/Railway**

#### **Se estiver usando Vercel:**
1. No Vercel, vá em "Settings" → "Domains"
2. Clique em "Add"
3. Digite seu domínio
4. Vercel mostra os registros DNS
5. Na sua registradora (Namecheap/GoDaddy), adicione esses registros
6. Aguarde 24h para propagar

#### **Se estiver usando Railway:**
1. No Railway, vá em "Settings" → "Domains"
2. Clique em "Add Domain"
3. Digite seu domínio
4. Railway mostra os registros DNS
5. Na sua registradora, adicione esses registros
6. Aguarde 24h para propagar

---

## PASSO 7: Ativar HTTPS

### **Vercel/Railway (Automático)**

✅ **Já vem com HTTPS grátis!** Vercel e Railway usam Let's Encrypt automaticamente.

### **DigitalOcean (Manual)**

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Gerar certificado
sudo certbot certonly --nginx -d seu-dominio.com.br

# Renovação automática
sudo systemctl enable certbot.timer
```

---

## Troubleshooting

### **Problema: "Erro de conexão com banco de dados"**

**Solução:**
1. Verifique se `DATABASE_URL` está correto
2. Teste a conexão no Planetscale
3. Verifique se o IP do servidor está na whitelist

### **Problema: "Erro 502 Bad Gateway"**

**Solução:**
1. Verifique os logs: `pm2 logs flayve`
2. Reinicie: `pm2 restart flayve`
3. Verifique se todas as variáveis de ambiente estão definidas

### **Problema: "Domínio não funciona"**

**Solução:**
1. Aguarde 24-48h para propagação DNS
2. Verifique os registros DNS com `nslookup seu-dominio.com.br`
3. Verifique se os registros estão corretos no painel da registradora

### **Problema: "HTTPS não funciona"**

**Solução:**
1. Se Vercel/Railway: aguarde 10 minutos
2. Se DigitalOcean: verifique certificado com `sudo certbot certificates`
3. Limpe cache do navegador (Ctrl+Shift+Del)

---

## 📊 Checklist Final

- [ ] Banco de dados criado (Planetscale)
- [ ] Arquivo `.env.production` preenchido
- [ ] Código enviado para GitHub
- [ ] Deploy feito (Vercel/Railway/DigitalOcean)
- [ ] Domínio comprado
- [ ] Domínio apontado para servidor
- [ ] HTTPS funcionando
- [ ] Variáveis de ambiente configuradas
- [ ] Primeiro teste de acesso funciona
- [ ] Emails de teste enviados
- [ ] Pagamento de teste processado

---

## 🎯 Próximos Passos

1. **Monitoramento** - Configure alertas para erros
2. **Backups** - Configure backups automáticos do banco
3. **Escalabilidade** - Quando chegar a 100 usuários, implemente Redis
4. **CDN** - Quando tráfego crescer, use Cloudflare

---

## 📞 Suporte

Se tiver dúvidas:
- Vercel: [vercel.com/support](https://vercel.com/support)
- Railway: [railway.app/support](https://railway.app/support)
- Planetscale: [planetscale.com/docs](https://planetscale.com/docs)

**Boa sorte! 🚀**
