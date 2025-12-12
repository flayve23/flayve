# 📖 GUIA DE IMPLANTAÇÃO FLAYVE - Para Leigos

## O que é Flayve?

Flayve é uma plataforma de vídeo chamadas 1-para-1 onde:
- **Modelos (Streamers)** ganham dinheiro recebendo chamadas
- **Clientes (Viewers)** pagam para chamar as modelos
- **Você (Admin)** ganha uma comissão de cada chamada

---

## Pré-Requisitos (O que você precisa ter)

### 1. Domínio (Website)
Um endereço na internet, tipo: `www.suaplataforma.com.br`

**Como conseguir:**
- Ir em https://www.hostgator.com.br (ou similar)
- Procurar por "Registrar Domínio"
- Escolher um nome (ex: flayve.com.br)
- Pagar ~R$ 40/ano
- Pronto! Você tem um domínio

### 2. Servidor (Hospedagem)
Um computador na nuvem que roda sua plataforma 24/7

**Como conseguir:**
- Ir em https://www.manus.im (já está tudo pronto aqui!)
- Ou usar Vercel/Railway se preferir
- Custo: ~R$ 100-500/mês dependendo de uso

### 3. Banco de Dados
Onde guardar informações de usuários, chamadas, pagamentos

**Como conseguir:**
- Já vem incluído no Manus
- Ou usar Firebase/Supabase se preferir
- Custo: Grátis até certo limite

### 4. Gateway de Pagamento (Mercado Pago)
Sistema para receber dinheiro dos clientes

**Como conseguir:**
- Ir em https://www.mercadopago.com.br/developers
- Criar conta
- Fazer verificação de identidade (5 min)
- Gerar credenciais de API
- Custo: Grátis, você paga taxa por transação (0% PIX, 3% cartão)

### 5. Email Transacional (Sendgrid/Mailgun)
Para enviar emails de confirmação, recuperação de senha

**Como conseguir:**
- Ir em https://sendgrid.com ou https://mailgun.com
- Criar conta
- Configurar domínio
- Custo: Grátis até 100 emails/dia

---

## Passo 1: Preparar o Servidor (30 minutos)

### O que você vai fazer:
Colocar sua plataforma Flayve online para que qualquer pessoa possa acessar.

### Passo-a-Passo:

**1.1 - Acessar Manus**
- Ir em https://www.manus.im
- Fazer login com sua conta
- Ir em "Projetos"
- Clicar em "Flayve"

**1.2 - Publicar Projeto**
- Clicar em botão "Publish" (canto superior direito)
- Aguardar 2-3 minutos
- Copiar URL pública (exemplo: flayve-123abc.manus.space)

**1.3 - Conectar Domínio**
- Ir em "Settings" → "Domains"
- Clicar em "Adicionar Domínio Personalizado"
- Digitar seu domínio (flayve.com.br)
- Seguir instruções para configurar DNS
- Aguardar 24h para propagação

**Pronto!** Sua plataforma está online em flayve.com.br

---

## Passo 2: Configurar Mercado Pago (45 minutos)

### O que você vai fazer:
Conectar o sistema de pagamento para que clientes possam adicionar saldo.

### Passo-a-Passo:

**2.1 - Criar Conta Mercado Pago**
- Ir em https://www.mercadopago.com.br/developers
- Clicar em "Criar Conta"
- Preencher email e senha
- Confirmar email

**2.2 - Verificação de Identidade**
- Ir em "Configurações" → "Conta"
- Clicar em "Verificar Identidade"
- Enviar foto do RG/CNH
- Aguardar aprovação (geralmente 5 min)

**2.3 - Gerar Credenciais**
- Ir em "Credenciais"
- Copiar "Access Token" (chave secreta)
- Copiar "Public Key" (chave pública)
- Guardar em local seguro (não compartilhar!)

**2.4 - Configurar no Flayve**
- Ir em Manus → Flayve → Settings → Secrets
- Adicionar:
  - `MERCADO_PAGO_ACCESS_TOKEN` = [seu access token]
  - `MERCADO_PAGO_PUBLIC_KEY` = [sua public key]
- Salvar

**2.5 - Testar Pagamento**
- Ir em seu site (flayve.com.br)
- Fazer login como cliente
- Clicar em "Adicionar Saldo"
- Tentar adicionar R$ 10 com cartão de teste
- Verificar se funcionou

**Pronto!** Pagamentos estão configurados

---

## Passo 3: Configurar Emails (20 minutos)

### O que você vai fazer:
Fazer com que o sistema envie emails automáticos (confirmação, recuperação de senha).

### Passo-a-Passo:

**3.1 - Criar Conta Sendgrid**
- Ir em https://sendgrid.com
- Clicar em "Sign Up"
- Preencher dados
- Confirmar email

**3.2 - Gerar API Key**
- Ir em "Settings" → "API Keys"
- Clicar em "Create API Key"
- Copiar chave
- Guardar em local seguro

**3.3 - Configurar Domínio**
- Ir em "Settings" → "Sender Authentication"
- Clicar em "Authenticate Your Domain"
- Seguir instruções para adicionar registros DNS
- Aguardar 24h

**3.4 - Adicionar ao Flayve**
- Ir em Manus → Flayve → Settings → Secrets
- Adicionar:
  - `SENDGRID_API_KEY` = [sua api key]
  - `SENDGRID_FROM_EMAIL` = noreply@seudominio.com.br
- Salvar

**Pronto!** Emails estão configurados

---

## Passo 4: Configurar Modelos (Streamers)

### O que você vai fazer:
Convidar as primeiras modelos para usar a plataforma.

### Passo-a-Passo:

**4.1 - Criar Conta de Teste**
- Ir em flayve.com.br
- Clicar em "Criar Conta"
- Selecionar "Sou Modelo"
- Preencher dados
- Confirmar email

**4.2 - Completar Perfil**
- Fazer login
- Ir em "Meu Perfil"
- Adicionar foto
- Escrever bio (descrição curta)
- Escrever sobre (descrição longa)
- Definir preço por minuto (R$ 1-10)
- Salvar

**4.3 - Gerar Link de Referral**
- Na página "Meu Perfil"
- Clicar em "Compartilhar Perfil"
- Copiar link
- Compartilhar no WhatsApp/Instagram

**4.4 - Ativar Status Online**
- Ir em Dashboard
- Clicar em toggle "Online"
- Agora ela aparece no feed de clientes

**Pronto!** Primeira modelo está online

---

## Passo 5: Configurar Clientes (Viewers)

### O que você vai fazer:
Fazer com que clientes possam se registrar e chamar modelos.

### Passo-a-Passo:

**5.1 - Criar Conta de Teste**
- Ir em flayve.com.br
- Clicar em "Criar Conta"
- Selecionar "Sou Cliente"
- Preencher dados
- Confirmar email

**5.2 - Adicionar Saldo**
- Fazer login
- Ir em "Feed"
- Clicar em "Adicionar Saldo"
- Escolher valor (R$ 10, 50, 100)
- Pagar com PIX ou cartão
- Saldo aparece na conta

**5.3 - Chamar Modelo**
- Ir em "Feed"
- Clicar em modelo desejada
- Clicar em "Ligar Agora"
- Sistema conecta com modelo
- Chamada começa

**Pronto!** Cliente consegue chamar

---

## Passo 6: Configurar Admin (Você)

### O que você vai fazer:
Acessar painel de administração para gerenciar plataforma.

### Passo-a-Passo:

**6.1 - Acessar Painel Admin**
- Ir em flayve.com.br/admin
- Fazer login com conta admin
- Ver estatísticas

**6.2 - Aprovar Modelos**
- Ir em "KYC Pendente"
- Ver modelos aguardando aprovação
- Clicar em "Aprovar" ou "Rejeitar"
- Modelo recebe email de confirmação

**6.3 - Ver Relatórios**
- Ir em "Dashboard"
- Ver:
  - Usuários ativos hoje
  - Receita do dia
  - Volume total
  - Últimas transações

**6.4 - Gerenciar Comissões**
- Ir em "Streamers"
- Ver tabela de modelos
- Clicar em modelo para editar comissão
- Definir taxa (ex: 70% para modelo, 30% para você)
- Salvar

**Pronto!** Você está no controle

---

## Passo 7: Primeiro Teste Completo (15 minutos)

### Simular uma chamada real:

**7.1 - Abrir 2 Navegadores**
- Navegador 1: Conta de Modelo
- Navegador 2: Conta de Cliente

**7.2 - Modelo Fica Online**
- Navegador 1: Dashboard → Toggle "Online"
- Modelo aparece no feed

**7.3 - Cliente Chama**
- Navegador 2: Feed → Clicar "Ligar Agora"
- Modal de chamada abre

**7.4 - Modelo Recebe Notificação**
- Navegador 1: Deve receber notificação
- Clicar em "Atender"
- Ambos entram em sala de vídeo

**7.5 - Verificar Pagamento**
- Após 1 minuto, verificar se saldo foi debitado
- Ir em "Histórico de Transações"
- Ver débito na conta do cliente
- Ver crédito na conta da modelo

**Pronto!** Sistema funcionando!

---

## Passo 8: Convidar Primeiras Modelos (Negociação)

### O que você vai fazer:
Recrutar modelos com público já estabelecido.

### Passo-a-Passo:

**8.1 - Pesquisar Modelos**
- Procurar em:
  - OnlyFans
  - Instagram
  - TikTok
  - Plataformas concorrentes
- Procurar por modelos com 5k+ seguidores

**8.2 - Enviar Proposta**
- Enviar DM no Instagram/WhatsApp
- Proposta:
  ```
  Oi [Nome]!
  
  Descobri seu trabalho e adorei! 
  Tenho uma plataforma de vídeo chamadas 1-para-1 
  onde você ganha R$ [X] por minuto.
  
  Você recebe 70% de cada chamada (negociável).
  Saque rápido em 1-2 dias.
  
  Quer conhecer? Posso enviar link de teste.
  ```

**8.3 - Negociar Comissão**
- Modelos com grande público: 75-80%
- Modelos iniciantes: 60-70%
- Você fica com 20-40%

**8.4 - Onboarding**
- Enviar link de cadastro
- Ajudar a completar perfil
- Fazer primeiro teste de chamada
- Tirar dúvidas

**Pronto!** Primeiras modelos recrutadas

---

## Checklist de Lançamento

Antes de colocar online para público:

- [ ] Domínio configurado e funcionando
- [ ] Mercado Pago testado com pagamento real
- [ ] Emails sendo enviados corretamente
- [ ] Pelo menos 5 modelos cadastradas
- [ ] Teste completo de chamada funcionando
- [ ] Admin consegue aprovar modelos
- [ ] Relatórios mostrando dados corretos
- [ ] SSL/HTTPS ativo (segurança)
- [ ] Termos de Serviço e Privacidade publicados
- [ ] Suporte por email configurado

---

## Troubleshooting (Soluções para Problemas)

### Problema: "Erro ao processar pagamento"
**Solução:** Verificar se Mercado Pago está configurado corretamente em Settings → Secrets

### Problema: "Modelo não recebe notificação de chamada"
**Solução:** Verificar se WebSocket está ativo (recarregar página)

### Problema: "Email não chega"
**Solução:** Verificar spam, confirmar Sendgrid está configurado

### Problema: "Modelo não aparece no feed"
**Solução:** Verificar se modelo clicou em "Ativar Online"

### Problema: "Saldo não foi debitado"
**Solução:** Verificar se chamada durou pelo menos 1 minuto

---

## Próximos Passos

1. **Semana 1:** Setup completo (Passo 1-3)
2. **Semana 2:** Recrutar 10 modelos (Passo 8)
3. **Semana 3:** Lançamento beta com 50 clientes
4. **Mês 2:** Marketing e crescimento
5. **Mês 3:** Otimizações baseadas em feedback

---

## Suporte

Se tiver dúvidas:
- Email: suporte@flayve.com.br
- WhatsApp: [seu número]
- Discord: [seu servidor]

**Boa sorte! 🚀**
