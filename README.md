# 📰 Console.News API

Uma API completa para gerenciamento de newsletter e sistema de notícias, desenvolvida com Node.js e TypeScript. Oferece funcionalidades de autenticação, gerenciamento de usuários, categorias, templates, newsletters e sistema de envio de emails.

---

## 📚 Tecnologias Incluídas

### 🔧 Core
- **Express 5.1.0**: Framework web rápido e minimalista para Node.js
- **TypeScript 5.8.3**: Superset tipado de JavaScript
- **Zod 3.24.3**: Validação de schemas com inferência de tipos
- **Zod-OpenAPI 4.2.4**: Integração de Zod com OpenAPI para documentação automática

### 💾 Banco de Dados
- **Drizzle ORM 0.42.0**: ORM TypeScript-first com excelente experiência de desenvolvimento
- **PostgreSQL**: Banco de dados relacional (via pg 8.15.6)
- **Drizzle Kit**: Ferramentas CLI para migrações e gerenciamento de esquema

### 📧 Sistema de Email
- **Nodemailer 7.0.6**: Cliente SMTP para envio de emails
- **Resend 6.0.3**: Serviço de email moderno como alternativa ao SMTP
- **Sistema de Templates**: Templates personalizáveis para emails

### 🔒 Segurança
- **Bcrypt 5.1.1**: Hashing de senhas
- **Helmet 8.1.0**: Segurança para aplicações Express
- **Express Rate Limit 7.5.0**: Limitação de requisições
- **CORS**: Configuração de Cross-Origin Resource Sharing
- **JsonWebToken 9.0.2**: Implementação de JWT para autenticação

### 🛠️ Utilidades
- **Dotenv 16.5.0**: Gerenciamento de variáveis de ambiente
- **Winston 3.17.0**: Logger para Node.js

### 👨‍💻 Desenvolvimento
- **ESLint 9.25.0**: Linting de código
- **Prettier 3.5.3**: Formatação de código
- **Vitest 3.1.1**: Framework de testes rápido
- **ts-node-dev**: Reinicialização automática durante desenvolvimento

---

## 📂 Estrutura do Projeto

```
src/
├── 📁 configs/          # Configurações da aplicação (CORS, Helmet, Email, etc.)
├── 📁 constants/        # Constantes do sistema (status codes, permissões)
├── 📁 controllers/      # Controladores que processam as requisições
│   └── 📁 v1/
│       ├── 📁 analytics/    # Dashboard e health checks
│       └── 📁 modules/      # Módulos de negócio
│           ├── 📁 auth/         # Autenticação e autorização
│           ├── 📁 category/     # Gerenciamento de categorias
│           ├── 📁 newsletter/   # Criação e envio de newsletters
│           ├── 📁 subscription/ # Inscrições de usuários
│           ├── 📁 template/     # Templates de email
│           └── 📁 role/         # Sistema de permissões
├── 📁 db/               # Definições de schema e migrações do Drizzle
│   ├── 📁 schema/v1/    # Schemas do banco de dados
│   └── 📁 seeds/        # Dados iniciais para o banco
├── 📁 enums/            # Enumerações do sistema
├── 📁 middlewares/      # Middlewares do Express (auth, validation, etc.)
├── 📁 providers/        # Provedores de serviços (email, etc.)
├── 📁 repositories/     # Camada de acesso a dados
├── 📁 resources/        # Transformadores de dados para API
├── 📁 routes/           # Definições de rotas da API
├── 📁 services/         # Lógica de negócios
├── 📁 types/            # Definições de tipos e interfaces
├── 📁 utils/            # Funções utilitárias
├── 📁 validations/      # Schemas Zod para validação
└── 📄 server.ts         # Ponto de entrada da aplicação
```

---

## ⚙️ Instalação

```bash
# Clone o repositório
git clone https://github.com/WasDavidOliveira/console.news
cd console.news

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Execute as migrações do banco
npm run db:migrate

# Execute os seeds (opcional)
npm run db:seed

# Inicie o servidor de desenvolvimento
npm run dev
```

### 🐳 Usando Docker

```bash
# Clone o repositório
git clone https://github.com/WasDavidOliveira/console.news
cd console.news

# Configure as variáveis de ambiente
cp .env.example .env

# Execute com Docker Compose
docker compose up -d
```

---

## 📋 Scripts Disponíveis

### 🚀 Desenvolvimento
- `npm run dev` - ▶️ Inicia o servidor em modo de desenvolvimento com hot-reload
- `npm run build` - 🏗️ Compila o código TypeScript para JavaScript
- `npm run start` - 🚀 Inicia o servidor em modo de produção (após o build)

### 🔧 Qualidade de Código
- `npm run lint` - 🔍 Executa a verificação de linting com ESLint
- `npm run lint:fix` - 🔧 Corrige automaticamente problemas de linting
- `npm run format` - ✨ Formata o código com Prettier
- `npm run code:check` - ✅ Verifica linting e formatação
- `npm run code:fix` - 🔧 Corrige linting e formatação

### 🗃️ Banco de Dados
- `npm run db:generate` - 📝 Gera migrações com base nas alterações do schema
- `npm run db:migrate` - 📊 Executa as migrações pendentes
- `npm run db:studio` - 🔬 Inicia o Drizzle Studio para visualização e edição do banco
- `npm run db:push` - 📤 Sincroniza o banco de dados com o schema atual
- `npm run db:seed` - 🌱 Executa os seeds para popular o banco com dados iniciais

### 🧪 Testes
- `npm run test` - 🧪 Executa todos os testes
- `npm run test:watch` - 👀 Executa testes em modo watch
- `npm run test:coverage` - 📊 Executa testes com relatório de cobertura
- `npm run test:view` - 🖥️ Abre interface visual dos testes

---

## 📖 Documentação da API

A documentação da API é gerada automaticamente usando Zod-OpenAPI e pode ser acessada em:

```
http://localhost:3000/docs
```

## 🔐 Autenticação

O sistema possui autenticação JWT completa com os seguintes endpoints:

- `POST /api/v1/auth/register` - 📝 Registrar um novo usuário
- `POST /api/v1/auth/login` - 🔑 Login para obter token JWT
- `GET /api/v1/auth/me` - 👤 Obter dados do usuário logado
- `POST /api/v1/auth/forgot-password` - 🔒 Solicitar redefinição de senha
- `POST /api/v1/auth/reset-password` - 🔑 Redefinir senha

## 📰 Funcionalidades Principais

### 👥 Gerenciamento de Usuários
- Sistema completo de usuários com roles e permissões
- Autenticação JWT com refresh tokens
- Controle de acesso baseado em roles

### 📧 Sistema de Newsletter
- Criação e gerenciamento de newsletters
- Templates personalizáveis para emails
- Sistema de categorias para organização
- Envio de emails via SMTP ou Resend

### 📊 Inscrições
- Sistema de inscrições para newsletters
- Controle de status das inscrições
- Busca por email e filtros avançados

### 🎨 Templates
- Criação de templates de email personalizados
- Sistema de variáveis dinâmicas
- Preview dos templates

### 📈 Analytics
- Dashboard com métricas do sistema
- Health checks para monitoramento
- Logs estruturados com Winston

---

## 🗃️ Uso do Banco de Dados

O projeto utiliza Drizzle ORM para interações com o banco de dados PostgreSQL. Para definir novos modelos:

1. ✏️ Crie ou modifique os schemas em `src/db/schema/v1`
2. 🔄 Gere migrações com `npm run db:generate`
3. ⬆️ Aplique migrações com `npm run db:migrate`
4. 🌱 Execute seeds com `npm run db:seed`

---

## 🔌 Adicionando Novos Endpoints

1. 📝 Crie um schema de validação em `src/validations/v1/modules`
2. 🎮 Crie um controlador em `src/controllers/v1/modules`
3. 🛣️ Defina as rotas em `src/routes/v1/modules`
4. 🔗 Registre as rotas no arquivo principal de rotas
5. 🏗️ Implemente a lógica de negócio em `src/services/v1/modules`

---

## 👥 Contribuição

Contribuições são bem-vindas! Por favor, abra um issue ou envie um pull request.

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT.
