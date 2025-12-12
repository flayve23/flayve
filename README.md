# Flayve - Plataforma de Vídeo Chamadas 1-para-1

**Flayve** é uma plataforma Web Mobile-First de vídeo chamadas privadas pay-per-minute para o mercado adulto brasileiro. A plataforma conecta modelos (streamers) e usuários (viewers) para chamadas privadas imediatas, com sistema de billing automático e split de pagamentos.

---

## 🎯 Visão Geral

O Flayve permite que modelos monetizem seu tempo através de chamadas de vídeo privadas, definindo seus próprios preços e horários de disponibilidade. Os usuários podem navegar por modelos online, filtrar por categorias e iniciar chamadas instantâneas.

### Principais Características

**Para Streamers:**
- Onboarding simplificado em 4 passos
- Definição de preço por minuto (mínimo R$ 1,99)
- Dashboard financeiro com visualização de ganhos em tempo real
- Controle de status online/offline
- Sistema de tags para categorização de perfil
- Split automático de 70% dos ganhos
- Sistema de saque com verificação KYC

**Para Viewers:**
- Feed de modelos online estilo Instagram/Tinder
- Filtros rápidos por tags brasileiras
- Sistema de carteira com recarga via Pix (simulado)
- Chamadas de vídeo privadas 1-para-1
- Billing automático por minuto
- Feedback visual de tempo e custo durante chamadas

**Para Administradores:**
- Painel de gestão de KYC
- Visualização de métricas da plataforma
- Controle de split de pagamentos (30% plataforma / 70% streamer)

---

## 🛠️ Stack Tecnológica

### Frontend
- **React 19** com TypeScript
- **Tailwind CSS 4** para estilização
- **Shadcn/UI** para componentes
- **Wouter** para roteamento
- **tRPC** para comunicação type-safe com backend

### Backend
- **Express 4** como servidor HTTP
- **tRPC 11** para APIs type-safe
- **MySQL/TiDB** como banco de dados
- **Drizzle ORM** para queries
- **Manus Auth** para autenticação OAuth

### Integrações Futuras
- **LiveKit** para chamadas de vídeo WebRTC (atualmente simulado)
- **Gateway de Pagamento** para Pix real (atualmente simulado)

---

## 📊 Arquitetura do Banco de Dados

### Tabelas Principais

#### `users`
Tabela de usuários com autenticação OAuth.
- `id`: ID único do usuário
- `openId`: Identificador OAuth da Manus
- `name`, `email`, `loginMethod`: Dados do usuário
- `role`: Papel do usuário (user, admin, streamer, viewer)

#### `profiles`
Perfis estendidos para streamers e viewers.
- `userId`: Referência ao usuário
- `userType`: Tipo de perfil (streamer ou viewer)
- `photoUrl`, `bio`: Dados de perfil do streamer
- `pricePerMinute`: Preço definido pelo streamer (em centavos)
- `isOnline`: Status de disponibilidade
- `balance`: Saldo disponível (em centavos)
- `totalEarnings`: Ganhos totais acumulados
- `kycStatus`: Status de verificação KYC (pending, approved, rejected)

#### `tags`
Tags brasileiras para categorização de streamers.
- Exemplos: Iniciantes, Maduras, Trans, Pés, Dominatrix, Casal, Loiras, Morenas, etc.

#### `profileTags`
Relacionamento many-to-many entre profiles e tags.

#### `callsHistory`
Histórico de chamadas realizadas.
- `roomId`: Identificador único da sala
- `viewerId`, `streamerId`: Participantes da chamada
- `startedAt`, `endedAt`: Timestamps da chamada
- `durationMinutes`: Duração total
- `totalCost`: Custo total cobrado (em centavos)
- `status`: Status da chamada (active, completed, cancelled)

#### `transactions`
Registro de todas as transações financeiras.
- `userId`: Usuário relacionado
- `type`: Tipo de transação (credit, debit, withdrawal, call_charge, call_earning)
- `amount`: Valor em centavos
- `callId`: Referência à chamada (se aplicável)
- `status`: Status da transação (pending, completed, failed)

---

## 🔐 Regras de Negócio

### Sistema de Billing

**Split de Pagamentos:**
- Streamer recebe **70%** do valor cobrado por minuto
- Plataforma retém **30%** automaticamente
- Exemplo: Chamada de R$ 5,00/min → Streamer recebe R$ 3,50, Plataforma R$ 1,50

**Billing Loop:**
- Verificação de saldo do viewer a cada **60 segundos** durante a chamada
- Se o saldo for insuficiente, a chamada é **automaticamente encerrada**
- Cobrança é processada a cada minuto completo

**Preços:**
- Preço mínimo por minuto: **R$ 1,99**
- Streamers podem definir valores maiores livremente

### Compliance e Segurança

**Verificação de Idade:**
- Modal obrigatório de confirmação +18 na primeira visita
- Armazenamento local da confirmação

**KYC (Know Your Customer):**
- Verificação obrigatória para solicitar saques
- Aprovação manual pelo administrador
- Status: pending, approved, rejected

**Privacidade:**
- Chamadas privadas 1-para-1
- Sem gravação ou compartilhamento

---

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js 22+
- pnpm 10+
- Banco de dados MySQL/TiDB

### Passo 1: Clonar e Instalar Dependências

```bash
# Clonar o repositório
git clone <repository-url>
cd flayve

# Instalar dependências
pnpm install
```

### Passo 2: Configurar Variáveis de Ambiente

As variáveis de ambiente são gerenciadas automaticamente pela plataforma Manus. As seguintes variáveis já estão pré-configuradas:

- `DATABASE_URL`: String de conexão MySQL/TiDB
- `JWT_SECRET`: Secret para assinatura de cookies de sessão
- `VITE_APP_ID`: ID da aplicação OAuth Manus
- `OAUTH_SERVER_URL`: URL do servidor OAuth
- `VITE_OAUTH_PORTAL_URL`: URL do portal de login
- `OWNER_OPEN_ID`, `OWNER_NAME`: Informações do proprietário

### Passo 3: Configurar Banco de Dados

```bash
# Aplicar migrations e criar tabelas
pnpm db:push

# Seed de tags brasileiras
pnpm tsx scripts/seed-tags.ts
```

### Passo 4: Iniciar Servidor de Desenvolvimento

```bash
# Iniciar servidor em modo desenvolvimento
pnpm dev
```

O servidor estará disponível em `http://localhost:3000`.

### Passo 5: Build para Produção

```bash
# Build do frontend e backend
pnpm build

# Iniciar em produção
pnpm start
```

---

## 🎨 Estrutura do Projeto

```
flayve/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   │   ├── ui/       # Componentes Shadcn/UI
│   │   │   ├── EarningsCalculator.tsx
│   │   │   └── OnboardingWizard.tsx
│   │   ├── pages/        # Páginas da aplicação
│   │   │   ├── Home.tsx           # Landing page
│   │   │   ├── Onboarding.tsx     # Wizard de cadastro
│   │   │   ├── Dashboard.tsx      # Dashboard do streamer
│   │   │   ├── Feed.tsx           # Feed de modelos
│   │   │   ├── StreamerProfile.tsx # Perfil do streamer
│   │   │   ├── Call.tsx           # Tela de chamada
│   │   │   └── Admin.tsx          # Painel admin
│   │   ├── lib/
│   │   │   └── trpc.ts   # Cliente tRPC
│   │   └── App.tsx       # Rotas principais
│   └── public/           # Assets estáticos
├── server/               # Backend Express + tRPC
│   ├── routers.ts        # Definição de routers tRPC
│   ├── db.ts             # Helpers de banco de dados
│   └── _core/            # Infraestrutura (auth, context, etc)
├── drizzle/              # Schema e migrations
│   └── schema.ts         # Definição de tabelas
├── scripts/              # Scripts utilitários
│   └── seed-tags.ts      # Seed de tags brasileiras
└── shared/               # Código compartilhado
```

---

## 📱 Fluxo de Usuário

### Para Streamers

1. **Landing Page:** Visualizar calculadora de ganhos e benefícios
2. **Cadastro:** Fazer login via OAuth (Google/Email)
3. **Onboarding:** Completar wizard de 4 passos
   - Foto de perfil
   - Bio
   - Definir preço por minuto
   - Selecionar tags
4. **Dashboard:** Gerenciar status online, visualizar ganhos, atualizar preço
5. **Receber Chamadas:** Quando online, receber chamadas de viewers
6. **Solicitar Saque:** Enviar documentos KYC e solicitar transferência

### Para Viewers

1. **Landing Page:** Confirmar idade (+18)
2. **Login:** Fazer login via OAuth
3. **Feed:** Navegar por modelos online, filtrar por tags
4. **Adicionar Créditos:** Recarregar carteira via Pix (simulado)
5. **Visualizar Perfil:** Ver detalhes da modelo
6. **Iniciar Chamada:** Clicar em "Ligar Agora"
7. **Chamada de Vídeo:** Interagir com controles (mute, câmera, encerrar)
8. **Billing Automático:** Ser cobrado por minuto automaticamente

### Para Administradores

1. **Painel Admin:** Acessar via `/admin` (apenas role admin)
2. **Visualizar KYC Pendentes:** Ver lista de verificações aguardando aprovação
3. **Aprovar/Rejeitar:** Processar documentos KYC
4. **Monitorar Métricas:** Visualizar estatísticas da plataforma

---

## 🔌 Integrações Futuras

### LiveKit (WebRTC)

Atualmente, a tela de chamada está **simulada**. Para integrar o LiveKit real:

1. **Criar conta no LiveKit Cloud:** https://livekit.io/
2. **Obter credenciais:** API Key e API Secret
3. **Instalar SDK:**
   ```bash
   pnpm add livekit-client livekit-server-sdk
   ```
4. **Implementar geração de tokens no backend:**
   ```typescript
   import { AccessToken } from "livekit-server-sdk";
   
   const createRoomToken = (roomName: string, participantName: string) => {
     const token = new AccessToken(apiKey, apiSecret, {
       identity: participantName,
     });
     token.addGrant({ roomJoin: true, room: roomName });
     return token.toJwt();
   };
   ```
5. **Atualizar `Call.tsx`** para usar `livekit-client`:
   ```typescript
   import { Room, RoomEvent } from "livekit-client";
   
   const room = new Room();
   await room.connect(livekitUrl, token);
   ```

### Gateway de Pagamento (Pix)

Atualmente, a adição de créditos está **simulada**. Para integrar pagamento real:

1. **Escolher gateway:** Mercado Pago, PagSeguro, Stripe, etc.
2. **Obter credenciais de API**
3. **Implementar fluxo de pagamento:**
   - Gerar QR Code Pix
   - Webhook para confirmação de pagamento
   - Atualizar saldo do usuário automaticamente

---

## 🧪 Testes

O projeto utiliza **Vitest** para testes. Um exemplo de teste está em `server/auth.logout.test.ts`.

Para executar os testes:

```bash
pnpm test
```

Para adicionar novos testes, crie arquivos `*.test.ts` em `server/` seguindo o padrão do exemplo.

---

## 📝 API tRPC

### Routers Disponíveis

#### `auth`
- `auth.me`: Retorna usuário autenticado
- `auth.logout`: Faz logout e limpa cookie de sessão

#### `profile`
- `profile.getTags`: Lista todas as tags disponíveis
- `profile.getMyProfile`: Retorna perfil do usuário atual
- `profile.createStreamerProfile`: Cria perfil de streamer
- `profile.createViewerProfile`: Cria perfil de viewer
- `profile.updateOnlineStatus`: Atualiza status online/offline
- `profile.updatePrice`: Atualiza preço por minuto
- `profile.getOnlineStreamers`: Lista streamers online
- `profile.getStreamersByTag`: Filtra streamers por tag
- `profile.getProfileTags`: Retorna tags de um perfil

#### `wallet`
- `wallet.getBalance`: Retorna saldo do usuário
- `wallet.addCredits`: Adiciona créditos à carteira
- `wallet.getTransactions`: Lista transações do usuário

#### `admin`
- `admin.getPendingKYC`: Lista KYCs pendentes (apenas admin)
- `admin.approveKYC`: Aprova KYC (apenas admin)
- `admin.rejectKYC`: Rejeita KYC (apenas admin)

---

## 🎨 Design System

### Cores Principais

- **Pink:** `#db2777` (pink-600) - Cor primária
- **Purple:** `#9333ea` (purple-600) - Cor secundária
- **Green:** `#16a34a` (green-600) - Status online, ganhos
- **Orange:** `#ea580c` (orange-600) - Pendências
- **Red:** `#dc2626` (red-600) - Ações destrutivas

### Componentes Shadcn/UI

O projeto utiliza componentes do Shadcn/UI para consistência visual:
- Button, Card, Input, Label, Textarea
- Dialog, Badge, Switch, Slider
- Table, Checkbox, Tooltip

### Responsividade

O design é **Mobile-First**, com breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

---

## 🔒 Segurança

### Autenticação
- OAuth via Manus Auth
- Cookies HTTP-only para sessões
- JWT para assinatura de tokens

### Autorização
- Procedures protegidas via `protectedProcedure`
- Verificação de role para rotas admin
- Validação de saldo antes de iniciar chamadas

### Dados Sensíveis
- Valores monetários armazenados em **centavos** (evita problemas de float)
- KYC obrigatório para saques
- Documentos KYC armazenados com URLs seguras

---

## 📈 Próximos Passos

### Curto Prazo
- [ ] Integrar LiveKit para chamadas reais
- [ ] Integrar gateway de pagamento Pix
- [ ] Implementar sistema de notificações em tempo real
- [ ] Adicionar chat de texto durante chamadas

### Médio Prazo
- [ ] Sistema de avaliações e reviews
- [ ] Histórico de chamadas para viewers
- [ ] Relatórios financeiros detalhados para streamers
- [ ] Sistema de favoritos

### Longo Prazo
- [ ] App mobile nativo (React Native)
- [ ] Sistema de assinaturas mensais
- [ ] Chamadas em grupo (1-para-muitos)
- [ ] Marketplace de conteúdo gravado

---

## 🤝 Contribuindo

Este é um projeto privado. Para contribuir:

1. Crie uma branch para sua feature: `git checkout -b feature/nova-feature`
2. Commit suas mudanças: `git commit -m 'Adiciona nova feature'`
3. Push para a branch: `git push origin feature/nova-feature`
4. Abra um Pull Request

---

## 📄 Licença

Este projeto é proprietário e confidencial. Todos os direitos reservados.

---

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através de:
- Email: suporte@flayve.com.br
- Documentação: https://docs.flayve.com.br

---

**Desenvolvido com ❤️ pela equipe Flayve**


---

## 📋 Análise de UX e Responsividade Mobile

Veja o arquivo `UX_ANALYSIS.md` para uma análise detalhada dos problemas identificados e soluções implementadas:

**Problemas Corrigidos:**
- ✅ Onboarding específico para viewers com tutorial interativo
- ✅ Modal de confirmação de idade melhorado
- ✅ Feed responsivo (1/2/3 colunas conforme tela)
- ✅ Componentes otimizados para toque (44px mínimo)
- ✅ Tipografia responsiva
- ✅ Spacing adaptativo para mobile

**Próximas Melhorias:**
- Responsividade do Perfil Streamer
- Responsividade da Tela de Chamada
- Responsividade do Dashboard
- Testes em dispositivos reais
"# flayve" 
