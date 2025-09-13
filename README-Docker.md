# 🐳 Docker Setup - Console.News

Este guia explica como executar a aplicação Console.News usando Docker e Docker Compose.

## 📋 Pré-requisitos

- Docker
- Docker Compose

## 🚀 Como usar

### 1. Configurar variáveis de ambiente

Copie o arquivo de exemplo e configure suas variáveis:

```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações específicas.

### 2. Executar a aplicação

Para iniciar todos os serviços (aplicação + PostgreSQL):

```bash
docker compose up -d
```

### 3. Migrações automáticas

As migrações do banco são executadas **automaticamente** quando o container da aplicação é iniciado! 

🎉 **Não precisa fazer nada manual** - o sistema:
- Aguarda o banco estar disponível
- Gera as migrações automaticamente (`db:generate`)
- Executa as migrações automaticamente (`db:migrate`)
- Opcionalmente executa seeds (se `RUN_SEEDS=true` no .env)
- Inicia a aplicação

Se quiser executar seeds automaticamente, configure no `.env`:
```env
RUN_SEEDS=true
```

### 4. Comandos manuais (opcionais)

Se precisar executar migrações ou seeds manualmente:

```bash
# Gerar migrações manualmente (necessário pois não são versionadas)
docker compose exec app npm run db:generate

# Executar migrações manualmente
docker compose exec app npm run db:migrate

# Executar seeds manualmente
docker compose exec app npm run db:seed
```

### 5. Acessar a aplicação

- **API**: http://localhost:3000
- **Documentação**: http://localhost:3000/docs
- **PostgreSQL**: localhost:5432

## 🛠️ Comandos úteis

### Ver logs
```bash
# Logs da aplicação
docker compose logs app

# Logs do banco
docker compose logs db

# Logs de todos os serviços
docker compose logs
```

### Parar serviços
```bash
docker compose down
```

### Rebuildar imagem da aplicação
```bash
docker compose build app
docker compose up -d
```

### Acessar container da aplicação
```bash
docker compose exec app sh
```

### Acessar PostgreSQL
```bash
docker compose exec db psql -U postgres -d console_news
```

## 📁 Estrutura dos containers

- **app**: Aplicação Node.js rodando na porta 3000
- **db**: PostgreSQL 15 rodando na porta 5432
- **Volume**: `postgres_data` para persistir dados do banco

## 📂 Estrutura dos arquivos Docker

```
.docker/
├── Dockerfile              # Container da aplicação Node.js
└── docker-entrypoint.sh   # Script de entrada automático
docker-compose.yml         # Orquestração dos serviços
.dockerignore              # Arquivos ignorados no build
env.example                # Template de variáveis de ambiente
```

## 🔧 Configurações importantes

- O banco aguarda estar saudável antes da aplicação iniciar
- Logs da aplicação são persistidos no volume `./logs`
- Dados do PostgreSQL são persistidos no volume `postgres_data`
- A aplicação se conecta ao banco usando o hostname `db`

## 🐛 Troubleshooting

Se encontrar problemas:

1. Verifique se as portas 3000 e 5432 estão livres
2. Confirme que o arquivo `.env` está configurado corretamente
3. Verifique os logs com `docker compose logs`
4. Para reset completo: `docker compose down -v && docker compose up -d`
