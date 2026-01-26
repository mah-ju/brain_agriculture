#!/bin/sh
set -e

echo "🚀 Iniciando aplicação..."

# Roda migrações do Prisma
echo "📦 Rodando migrações do Prisma..."
npx prisma migrate deploy

# Inicia o servidor
echo "✅ Migrações concluídas. Iniciando servidor..."
exec npm run start:prod
