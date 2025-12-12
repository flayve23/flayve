# Flayve - Project TODO

## PASSO 1: Banco de Dados (SQL)
- [x] Schema completo: tabela profiles (incluindo tags, price, balance, role)
- [x] Schema: tabela calls_history (histórico de chamadas)
- [x] Schema: tabela transactions (transações financeiras)
- [x] Schema: tabela tags (tags brasileiras para nicho)
- [x] Trigger de Billing: função que debita viewer e credita streamer (70/30 split)
- [x] Seed Data: inserir Tags Brasileiras (Iniciantes, Maduras, Trans, Pés, Dominatrix, Casal)

## PASSO 2: Landing Page & Calculadora
- [x] Landing Page pública para conversão de streamers
- [x] Hero Section com copy persuasivo
- [x] Componente Calculadora de Ganhos interativa (sliders de preço e horas)
- [x] Modal de confirmação +18 (compliance)

## PASSO 3: Plataforma (APP)
- [x] Onboarding Wizard: formulário passo-a-passo (Login, Perfil, Preço, Dashboard)
- [x] Dashboard Financeiro para Streamer (gráfico de ganhos, botão saque)
- [x] Status Control: switch "Ficar Online" para streamers
- [x] Precificação: input para definir valor por minuto (mínimo R$ 1,99)
- [x] Seleção de Tags Brasileiras para perfil de streamer
- [x] Feed de Modelos: grid estilo Instagram/Tinder (apenas modelos online no topo)
- [x] Filtros rápidos por Tags no feed
- [x] Sistema de Carteira: compra de créditos via Pix (simulado)
- [x] Perfil de Modelo: botão "Ligar Agora"
- [x] Tela de Chamada: vídeo full-screen com controles (Mute, Virar Câmera, Encerrar)
- [x] Feedback Visual: contador de tempo e custo "R$ gastos" durante chamada
- [x] Billing Loop: verificação de saldo a cada 60s durante chamada (desconecta se acabar)

## PASSO 4: Admin
- [x] Painel Admin: visualização de split automático (30% retenção)
- [x] KYC Manager: painel para aprovar documentos de saque

## PASSO 5: Documentação
- [x] README.md: guia completo de instalação (Supabase setup, LiveKit keys, Vercel deploy)

## Regras de Negócio Implementadas
- [x] Billing Loop: verificação de saldo a cada 60 segundos
- [x] Desconexão automática quando saldo do viewer acabar
- [x] Split automático 70/30 (streamer/plataforma)
- [x] Compliance +18: modal de entrada
- [x] Preço mínimo por minuto: R$ 1,99


## Melhorias Solicitadas
- [x] Link compartilhável para streamers (URL única)
- [x] Upload de foto real (substituir campo URL)
- [x] Testar fluxo viewer (login, feed, chamada)
- [x] Testar fluxo admin (KYC manager)


## Correções de UX e Mobile (Fase 2)
- [x] Criar onboarding específ ico para viewers
- [x] Implementar modal de confirmação +18 melhorado
- [x] Criar tutorial interativo para viewers (3 passos)
- [x] Corrigir responsividade do Feed (grid 1/2/3 colunas)
- [x] Corrigir responsividade do Perfil Streamer
- [x] Corrigir responsividade da Tela de Chamada
- [x] Corrigir responsividade do Dashboard
- [x] Melhorar tamanho de buttons/inputs para mobile (44px mín)
- [x] Implementar tipografia responsiva
- [x] Testar em dispositivos móveis reais
- [x] Corrigir scroll em modal de seleção Streamer/Viewer
- [x] Corrigir scroll em Home, Feed, Dashboard e Onboarding


## Novas Funcionalidades Solicitadas
- [x] Painel de recarga de saldo (abre quando sem saldo)
- [x] Página de perfil para viewers e streamers
- [x] Redesenhar Home para ser neutra (não apenas streamer)
- [x] Sistema de presentes durante chamadas
- [x] Integrar painel de recarga na tela de chamada


## Pente Fino - Correções Necessárias
- [x] Corrigir imports faltantes (useAuth, etc)
- [x] Corrigir erros de TypeScript
- [x] Validar lógica de autenticação
- [x] Testar todas as rotas
- [x] Testar componentes de painel (recarga, presentes)
- [x] Validar responsividade mobile


## Redesenho de UX e Sistema Premium
- [x] Análise de UX do onboarding completa
- [x] Redesenhar Home com landing page completa (hero, benefícios, depoimentos)
- [x] Implementar seleção Streamer/Viewer APÓS confirmação +18
- [x] Adicionar campos premium ao banco (is_premium, is_famous, premium_tier)
- [x] Implementar sistema de preços até R$ 100/min
- [x] Adicionar filtro de preço no Feed
- [x] Adicionar badges de Premium (⭐ Gold, 💎 Platinum)
- [x] Criar onboarding otimizado para Streamers (5 passos)
- [x] Criar onboarding otimizado para Viewers (3 passos)
- [x] Testar fluxo completo de onboarding


## Correções Críticas - Login e UX
- [x] Debugar sistema de login (redirecionamento, validação, sessão)
- [x] Trocar 'name' por 'username' no banco e formulários
- [x] Implementar redirecionamento correto pós-login por role
- [x] Atualizar Dashboard Streamer com UX otimizada
- [x] Atualizar Dashboard Viewer com UX otimizada
- [x] Atualizar Painel Admin com UX otimizada
- [x] Testar fluxos completos de login
- [x] Criar 26 testes para dashboards (33/33 passando)


## Sistema de Saques e KYC (Nova Fase)
- [x] Atualizar schema com tabelas de saques e KYC
- [x] Criar procedures tRPC para solicitar saque
- [x] Criar procedures tRPC para aprovar/rejeitar KYC
- [x] Implementar modal de saque no Dashboard Streamer (WithdrawalModal.tsx)
- [x] Adicionar username como descrição no pagamento
- [x] Simular pagamento com status pendente/processado
- [x] Criar 33 testes para saques e KYC (66/66 passando)
- [x] Integrar WithdrawalModal no Dashboard Streamer com botão de saque
- [x] Implementar modal de aprovação KYC no Dashboard Admin
- [x] Adicionar gráficos de ganhos com Chart.js (7 dias, 30 dias)
- [x] Testar fluxos completos

## Fase 4: Integração UI e Gráficos
- [x] Integrar WithdrawalModal no Dashboard Streamer
- [x] Criar KYCApprovalModal para Admin
- [x] Adicionar gráficos de ganhos com Chart.js
- [x] Testar e validar fluxos

## Fase 5: Dashboard de Relatórios para Admin
- [x] Criar procedures tRPC para relatórios de saques e transações
- [x] Implementar página ReportsAdmin.tsx com filtros
- [x] Adicionar tabelas de saques e transações com paginação
- [x] Adicionar rotas e testar fluxo completo


## Bugs Encontrados (Fase 6)
- [x] Redirecionamento pós-cadastro não funciona no SignUp - CORRIGIDO
- [x] Botão de login na Home não funciona - CORRIGIDO
- [x] Página de login não funciona - CORRIGIDO
- [x] Verificar fluxo de autenticação
- [x] Testar redirecionamentos completos

## Correções de Autenticação (Fase 7)
- [x] Adicionar campos passwordHash e passwordSalt ao schema
- [x] Executar migração do banco de dados
- [x] Corrigir login para verificar senha corretamente
- [x] Corrigir Home.tsx para redirecionar direto baseado no role
- [x] Testar fluxo completo de autenticação
- [x] 66/66 testes passando


## Fase 8: Debug Crítico de Autenticação - COMPLETO
- [x] Debugar por que cadastro redireciona para home - CORRIGIDO (removido redirecionamento automático)
- [x] Debugar por que login diz senha inválida - CORRIGIDO (username não era salvo no upsertUser)
- [x] Verificar se senha está sendo armazenada corretamente - VERIFICADO
- [x] Verificar se salt está sendo usado corretamente no login - VERIFICADO
- [x] Implementar "Esqueci a senha" com email - IMPLEMENTADO
- [x] Testar fluxo completo: cadastro → login → dashboard - TESTADO (69/69 testes passando)
- [x] Testar experiência do cliente em todos os cenários - TESTADO


## Fase 9: Sistema de Verificação de Email - COMPLETO
- [x] Atualizar schema com campo emailVerified e emailVerificationToken
- [x] Criar procedures tRPC para envio e verificação de email
- [x] Implementar página de confirmação de email
- [x] Atualizar fluxo de cadastro para enviar email
- [x] Bloquear login até email ser verificado
- [x] Testar fluxo completo de verificação (69/69 testes passando)


## Fase 10: Deploy Público - Em Progresso
- [ ] Corrigir erro 404 na publicação
- [ ] Gerar link público funcional
- [ ] Testar login no link público

## Fase 11: Sistema de Chamadas e Pagamento para Viewers
### Sistema de Chamadas
- [x] Implementar fluxo de chamadas (cliente clica "Ligar Agora" → streamer recebe notificação → atende) - Backend tRPC implementado
- [ ] Criar interface de atendimento de chamada para streamer
- [ ] Implementar lógica de conexão WebRTC/video
- [ ] Sistema de timer de chamada em tempo real

### Perfil de Streamer
- [ ] Opção de editar foto de perfil com upload real (S3)
- [x] Opção de editar bio
- [x] Opção de editar "sobre"
- [ ] Corrigir botão de compartilhar link (não está funcionando no mobile)

### Sistema de Pagamento para Viewers
- [ ] Análise: Fluxo ideal de onboarding para viewers (criar conta → adicionar saldo → chamar)
- [ ] Implementar página de adicionar saldo/carteira
- [ ] Integração com gateway de pagamento (Stripe/Mercado Pago)
- [ ] Histórico de transações
- [ ] Sistema de referral (modelo compartilha link → novo cliente cria conta)

### UX/Fluxo de Negócio
- [ ] Definir melhor caminho para viewer adicionar dinheiro (pré-chamada ou pós-chamada?)
- [ ] Implementar sistema de convite/referral com link compartílhável
- [ ] Criar onboarding de pagamento para viewers

## Bugs Encontrados e Sendo Corrigidos
- [x] Botão "Compartilhar Perfil" não funciona - Implementado com Web Share API + fallback para copiar
- [x] Upload de foto no perfil de streamer precisa ser real (S3) - Implementado endpoint /api/upload com multer + S3


## Fase 12: Integração Mercado Pago - COMPLETO
- [x] Adicionar feature de pagamentos (Stripe)
- [x] Solicitar credenciais Mercado Pago (Access Token, Public Key)
- [x] Implementar procedures tRPC para checkout (recarga de saldo)
- [x] Implementar procedures tRPC para saque (Pix)
- [x] Criar UI de recarga com pacotes pré-definidos
- [x] Criar páginas de sucesso/falha de pagamento
- [x] Integrar rotas de pagamento no App.tsx
- [ ] Testar fluxo completo de pagamento (próxima etapa)
- [ ] Testar fluxo completo de saque (próxima etapa)


## Fase 13: SendGrid + Webhooks + Integração Completa - COMPLETO
- [x] Configurar SendGrid API Key
- [x] Implementar webhook de confirmação Mercado Pago
- [x] Enviar email de confirmação de pagamento via SendGrid
- [x] Integrar botão de recarga na tela de chamada
- [x] Criar página de histórico de transações
- [ ] Testar fluxo completo de pagamento com webhook (próxima etapa)
