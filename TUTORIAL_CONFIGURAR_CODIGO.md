# 💻 Tutorial Detalhado: Configurar Código no Seu PC (Para Leigos)

## O que você vai fazer?

1. Baixar o código do seu site
2. Configurar as chaves que você copiou
3. Preparar para fazer deploy

**Tempo total: ~20 minutos**

---

## 📥 PASSO 1: Baixar o Código

### Se você tem o arquivo ZIP:

1. Procure pelo arquivo `flayve-complete.zip` no seu PC
2. Clique com botão direito nele
3. Clique em **"Extrair tudo"** (Windows) ou **"Descompactar"** (Mac)
4. Escolha um local (ex: Desktop ou Documentos)
5. Aguarde terminar

**Pronto! Código baixado! ✅**

### Se você quer clonar do GitHub:

1. Abra o Prompt de Comando (Windows) ou Terminal (Mac/Linux)
2. Digite este comando e pressione **Enter**:
```bash
git clone https://github.com/SEU_USERNAME/flayve.git
```

Substitua `SEU_USERNAME` pelo seu username do GitHub.

3. Aguarde terminar

**Pronto! Código clonado! ✅**

---

## 📂 PASSO 2: Abrir a Pasta do Projeto

### Windows:

1. Abra o **Explorador de Arquivos** (ícone de pasta na taskbar)
2. Procure pela pasta `flayve`
3. Clique duas vezes para abrir
4. Você deve ver vários arquivos e pastas

**Pronto! Pasta aberta! ✅**

### Mac/Linux:

1. Abra o **Finder** (Mac) ou **Gerenciador de Arquivos** (Linux)
2. Procure pela pasta `flayve`
3. Clique duas vezes para abrir
4. Você deve ver vários arquivos e pastas

**Pronto! Pasta aberta! ✅**

---

## 🔐 PASSO 3: Criar Arquivo de Configuração

Agora você vai criar um arquivo com as chaves que copiou.

### Windows:

1. Clique com botão direito dentro da pasta `flayve`
2. Clique em **"Novo"** → **"Documento de Texto"**
3. Nomeie como `.env.production` (exatamente assim!)
4. Clique em **"Salvar"**
5. Clique duas vezes para abrir
6. Copie e cole o conteúdo abaixo (substitua os valores):

```
DATABASE_URL=postgresql://postgres:SENHA_DO_BANCO@db.supabase.co:5432/postgres
JWT_SECRET=sua_senha_aleatoria_aqui_123456789
ENCRYPTION_KEY=sua_outra_senha_aleatoria_aqui_987654321
MERCADO_PAGO_ACCESS_TOKEN=APP_USR_seu_access_token_aqui
VITE_MERCADO_PAGO_PUBLIC_KEY=APP_USR_sua_public_key_aqui
SENDGRID_API_KEY=SG.sua_chave_sendgrid_aqui
VITE_APP_TITLE=Flayve
NODE_ENV=production
```

7. **Substitua os valores:**
   - `SENHA_DO_BANCO` → Senha que você criou no Supabase
   - `sua_senha_aleatoria_aqui_123456789` → Qualquer senha forte
   - `sua_outra_senha_aleatoria_aqui_987654321` → Outra senha forte
   - `APP_USR_seu_access_token_aqui` → Access Token do Mercado Pago
   - `APP_USR_sua_public_key_aqui` → Public Key do Mercado Pago
   - `SG.sua_chave_sendgrid_aqui` → Chave SendGrid

8. Pressione **Ctrl+S** para salvar
9. Feche o arquivo

**Pronto! Arquivo criado! ✅**

### Mac/Linux:

1. Abra o Terminal
2. Navegue até a pasta:
```bash
cd ~/flayve
```

3. Crie o arquivo com este comando:
```bash
nano .env.production
```

4. Uma tela preta vai abrir
5. Copie e cole o conteúdo abaixo (substitua os valores):

```
DATABASE_URL=postgresql://postgres:SENHA_DO_BANCO@db.supabase.co:5432/postgres
JWT_SECRET=sua_senha_aleatoria_aqui_123456789
ENCRYPTION_KEY=sua_outra_senha_aleatoria_aqui_987654321
MERCADO_PAGO_ACCESS_TOKEN=APP_USR_seu_access_token_aqui
VITE_MERCADO_PAGO_PUBLIC_KEY=APP_USR_sua_public_key_aqui
SENDGRID_API_KEY=SG.sua_chave_sendgrid_aqui
VITE_APP_TITLE=Flayve
NODE_ENV=production
```

6. Pressione **Ctrl+X**
7. Pressione **Y** (para "Yes")
8. Pressione **Enter**

**Pronto! Arquivo criado! ✅**

---

## 🔑 PASSO 4: Entender as Chaves

### DATABASE_URL

Exemplo: `postgresql://postgres:senha123@db.supabase.co:5432/postgres`

- `postgres` = usuário do banco (padrão)
- `senha123` = senha que você criou no Supabase
- `db.supabase.co` = servidor do Supabase
- `5432` = porta (deixe assim)
- `postgres` = nome do banco (deixe assim)

### JWT_SECRET e ENCRYPTION_KEY

Senhas aleatórias para segurança. Você pode gerar assim:

**Windows (Prompt de Comando):**
```bash
openssl rand -base64 32
```

**Mac/Linux (Terminal):**
```bash
openssl rand -base64 32
```

Copie o resultado e cole no arquivo.

### MERCADO_PAGO_ACCESS_TOKEN e VITE_MERCADO_PAGO_PUBLIC_KEY

São as chaves que você copiou do Mercado Pago. Exemplo:
- `APP_USR_1234567890abcdef`

### SENDGRID_API_KEY

É a chave que você copiou do SendGrid. Exemplo:
- `SG.abcdef1234567890`

---

## ✅ Checklist de Configuração

- [ ] Arquivo `.env.production` criado
- [ ] DATABASE_URL preenchido corretamente
- [ ] JWT_SECRET preenchido
- [ ] ENCRYPTION_KEY preenchido
- [ ] MERCADO_PAGO_ACCESS_TOKEN preenchido
- [ ] VITE_MERCADO_PAGO_PUBLIC_KEY preenchido
- [ ] SENDGRID_API_KEY preenchido
- [ ] Arquivo salvo

---

## 🎯 Próximo Passo

Agora que você configurou o código, vá para:
**TUTORIAL_COMANDOS_TERMINAL.md**

Lá você vai aprender os comandos para preparar o deploy.

---

## 🆘 Problemas?

### "Arquivo não salva com nome .env.production"

**Solução Windows:**
1. Clique com botão direito no arquivo
2. Clique em **"Renomear"**
3. Delete o nome atual
4. Digite `.env.production`
5. Pressione **Enter**

### "Não consegui copiar a URL do Supabase"

**Solução:**
1. Faça login no Supabase novamente
2. Vá em Settings → Database
3. Procure por "Connection string"
4. Selecione "URI"
5. Clique no ícone de copiar

### "Não sei qual é a senha do banco"

**Solução:**
1. Vá no Supabase
2. Clique em Settings → Database
3. Procure por "Database Password"
4. Se não lembrar, clique em "Reset password"

---

**Parabéns! Seu código está configurado! 🎉**

Próximo: Vá para **TUTORIAL_COMANDOS_TERMINAL.md**
