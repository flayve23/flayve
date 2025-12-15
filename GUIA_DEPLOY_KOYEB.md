# Guia de Deploy no Koyeb - Flayve

## 📋 Pré-requisitos

1. Conta no GitHub com o repositório `flayve23/flayve`
2. Conta no Koyeb (https://koyeb.com)
3. Database Supabase configurado
4. Variáveis de ambiente prontas

---

## 🚀 Passo-a-Passo de Deploy

### PASSO 1: Preparar o Repositório

```bash
cd C:\Users\Felipe\Desktop\flayve

# Limpar build anterior
rm -rf dist node_modules package-lock.json

# Instalar dependências
npm install --legacy-peer-deps

# Build
npm run build

# Fazer push
git add -A
git commit -m "Prepare for Koyeb deployment with Docker"
git push
```

### PASSO 2: Configurar Koyeb

1. Acesse https://koyeb.com
2. Clique em **Create Service**
3. Escolha **GitHub**
4. Selecione `flayve23/flayve`
5. Clique em **Next**

### PASSO 3: Configurar Build

1. **Builder**: Selecione **Docker**
2. **Dockerfile**: Deixe como `Dockerfile` (padrão)
3. Clique em **Next**

### PASSO 4: Configurar Variáveis de Ambiente

Adicione as seguintes variáveis:

```
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
JWT_SECRET=seu_jwt_secret_aqui
NODE_ENV=production
PORT=8000
OAUTH_SERVER_URL=https://api.manus.im
VITE_APP_ID=seu_app_id
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=seu_owner_id
OWNER_NAME=seu_nome
MERCADO_PAGO_ACCESS_TOKEN=seu_token_mercado_pago
SENDGRID_API_KEY=seu_sendgrid_key
STRIPE_SECRET_KEY=sua_stripe_key
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_forge_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=sua_frontend_forge_key
VITE_ANALYTICS_ENDPOINT=seu_analytics_endpoint
VITE_ANALYTICS_WEBSITE_ID=seu_website_id
VITE_API_URL=https://seu-app-koyeb.com
```

### PASSO 5: Configurar Vercel (Frontend)

1. Acesse https://vercel.com
2. Vá em **Settings** → **Environment Variables**
3. Adicione:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://seu-app-koyeb.com` (substitua pela URL do Koyeb)
4. Clique em **Save**
5. Clique em **Redeploy**

### PASSO 6: Deploy

1. No Koyeb, clique em **Deploy**
2. Aguarde o build completar (5-10 minutos)
3. Seu app estará em: `https://seu-app-koyeb.com`

---

## ✅ Verificar se Funciona

1. Acesse `https://seu-app-koyeb.com/health`
   - Deve retornar: `{"status":"OK","timestamp":"..."}`

2. Acesse `https://flayve-vercel-url.vercel.app`
   - Deve carregar a página de login

3. Tente fazer login
   - Deve funcionar sem erros

---

## 🔧 Troubleshooting

### Erro: "Build failed"
- Verifique se o `Dockerfile` existe
- Verifique se o `package.json` está correto
- Veja os logs no Koyeb

### Erro: "CORS error"
- Verifique se `VITE_API_URL` está configurado no Vercel
- Verifique se a URL do Koyeb está correta

### Erro: "Database connection failed"
- Verifique se `DATABASE_URL` está correto
- Teste a conexão localmente

---

## 📊 Arquivos Importantes

- `Dockerfile` - Configuração do Docker
- `.dockerignore` - Arquivos a ignorar no Docker
- `koyeb.yaml` - Configuração do Koyeb (opcional)
- `package.json` - Dependências (sem express-rate-limit)
- `server/_core/index.ts` - Servidor com CORS configurado
- `server/_core/security.ts` - Segurança simplificada

---

## 🎯 Próximos Passos

1. ✅ Deploy no Koyeb
2. ✅ Testar no Vercel
3. ✅ Validar com usuários
4. ✅ Escalar conforme necessário

