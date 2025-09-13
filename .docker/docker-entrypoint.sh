#!/bin/sh

# Script de entrada do container
# Executa migrações e seeds antes de iniciar a aplicação

echo "🚀 Iniciando aplicação Console.News..."

# Aguardar o banco estar disponível
echo "⏳ Aguardando banco de dados..."
until nc -z $DB_HOST $DB_PORT; do
  echo "Banco ainda não disponível, aguardando..."
  sleep 2
done

echo "✅ Banco de dados disponível!"

# Gerar migrações (necessário pois não são versionadas)
echo "📋 Gerando migrações do banco..."
npm run db:generate

# Executar migrações
echo "🔄 Executando migrações do banco..."
npm run db:migrate

# Verificar se deve executar seeds (opcional via variável de ambiente)
if [ "$RUN_SEEDS" = "true" ]; then
  echo "🌱 Executando seeds do banco..."
  npm run db:seed
fi

echo "🎯 Iniciando servidor..."

# Iniciar aplicação
exec "$@"
