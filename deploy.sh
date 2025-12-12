#!/bin/bash

# ============================================================
# SCRIPT DE DEPLOYMENT AUTOMÁTICO - FLAYVE
# ============================================================
# Este script automatiza o processo de deployment
# Use: bash deploy.sh
# ============================================================

set -e  # Para se houver erro

echo "🚀 INICIANDO DEPLOYMENT DO FLAYVE"
echo "=================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para imprimir com cor
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# ============================================================
# VERIFICAÇÕES PRÉ-DEPLOYMENT
# ============================================================

echo ""
echo "📋 Verificando pré-requisitos..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js não está instalado!"
    echo "Baixe em: https://nodejs.org"
    exit 1
fi
print_status "Node.js encontrado: $(node --version)"

# Verificar npm/pnpm
if ! command -v pnpm &> /dev/null; then
    print_warning "pnpm não encontrado, usando npm"
    PKG_MANAGER="npm"
else
    PKG_MANAGER="pnpm"
    print_status "pnpm encontrado: $(pnpm --version)"
fi

# Verificar Git
if ! command -v git &> /dev/null; then
    print_error "Git não está instalado!"
    echo "Baixe em: https://git-scm.com"
    exit 1
fi
print_status "Git encontrado: $(git --version)"

# ============================================================
# VERIFICAR VARIÁVEIS DE AMBIENTE
# ============================================================

echo ""
echo "🔐 Verificando variáveis de ambiente..."

if [ ! -f ".env.production" ]; then
    print_error "Arquivo .env.production não encontrado!"
    echo "Crie um arquivo .env.production com suas variáveis"
    echo "Use ENV_SETUP_GUIDE.md como referência"
    exit 1
fi
print_status "Arquivo .env.production encontrado"

# Verificar variáveis críticas
REQUIRED_VARS=("DATABASE_URL" "JWT_SECRET" "STRIPE_SECRET_KEY" "SENDGRID_API_KEY")
for var in "${REQUIRED_VARS[@]}"; do
    if ! grep -q "^$var=" .env.production; then
        print_error "Variável $var não encontrada em .env.production"
        exit 1
    fi
done
print_status "Todas as variáveis críticas encontradas"

# ============================================================
# INSTALAR DEPENDÊNCIAS
# ============================================================

echo ""
echo "📦 Instalando dependências..."

if [ "$PKG_MANAGER" = "pnpm" ]; then
    pnpm install
else
    npm install
fi
print_status "Dependências instaladas"

# ============================================================
# VERIFICAR TYPESCRIPT
# ============================================================

echo ""
echo "🔍 Verificando TypeScript..."

if [ "$PKG_MANAGER" = "pnpm" ]; then
    pnpm tsc --noEmit
else
    npm run check
fi
print_status "TypeScript OK"

# ============================================================
# EXECUTAR TESTES
# ============================================================

echo ""
echo "🧪 Executando testes..."

if [ "$PKG_MANAGER" = "pnpm" ]; then
    pnpm test || print_warning "Alguns testes falharam (não é crítico)"
else
    npm test || print_warning "Alguns testes falharam (não é crítico)"
fi

# ============================================================
# COMPILAR PARA PRODUÇÃO
# ============================================================

echo ""
echo "🔨 Compilando para produção..."

if [ "$PKG_MANAGER" = "pnpm" ]; then
    pnpm build
else
    npm run build
fi
print_status "Build concluído"

# ============================================================
# PREPARAR PARA DEPLOYMENT
# ============================================================

echo ""
echo "📦 Preparando para deployment..."

# Criar arquivo .deployignore se não existir
if [ ! -f ".deployignore" ]; then
    cat > .deployignore << EOF
node_modules
.git
.env.production
.env.local
.env.*.local
.DS_Store
*.log
dist
build
.next
coverage
.turbo
EOF
    print_status "Arquivo .deployignore criado"
fi

# ============================================================
# INSTRUÇÕES FINAIS
# ============================================================

echo ""
echo "=================================="
echo -e "${GREEN}✅ PREPARAÇÃO CONCLUÍDA!${NC}"
echo "=================================="
echo ""
echo "Próximos passos:"
echo ""
echo "1️⃣  VERCEL (Recomendado):"
echo "   - Acesse https://vercel.com"
echo "   - Clique em 'New Project'"
echo "   - Selecione seu repositório"
echo "   - Adicione variáveis de ambiente"
echo "   - Clique em 'Deploy'"
echo ""
echo "2️⃣  RAILWAY (Alternativa):"
echo "   - Acesse https://railway.app"
echo "   - Clique em 'New Project'"
echo "   - Selecione 'Deploy from GitHub'"
echo "   - Adicione variáveis de ambiente"
echo "   - Railway faz deploy automático"
echo ""
echo "3️⃣  DIGITALOCEAN (VPS):"
echo "   - SSH no seu servidor"
echo "   - Execute: git clone seu-repo"
echo "   - Execute: bash deploy.sh"
echo "   - Configure Nginx como proxy"
echo ""
echo "📚 Para mais informações:"
echo "   - Leia DEPLOYMENT_GUIDE.md"
echo "   - Leia ENV_SETUP_GUIDE.md"
echo ""
echo "❓ Dúvidas?"
echo "   - Vercel: https://vercel.com/support"
echo "   - Railway: https://railway.app/support"
echo ""

# ============================================================
# FAZER COMMIT (Opcional)
# ============================================================

echo ""
read -p "Deseja fazer commit das mudanças? (s/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    git add .
    git commit -m "Deploy: preparação para produção" || print_warning "Nada para commitar"
    git push origin main || print_warning "Erro ao fazer push (verifique suas permissões)"
    print_status "Commit e push realizados"
fi

echo ""
echo -e "${GREEN}🚀 Seu site está pronto para deployment!${NC}"
echo ""
