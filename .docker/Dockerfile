# Usar imagem oficial do Node.js
FROM node:24-alpine

# Instalar netcat para verificar conectividade do banco
RUN apk add --no-cache netcat-openbsd

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./

# Copiar código fonte
COPY . .

# Instalar todas as dependências
RUN npm install

# Fazer build da aplicação
RUN npm run build

# Copiar script de entrada
COPY .docker/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expor porta da aplicação
EXPOSE 3000

# Definir script de entrada
ENTRYPOINT ["docker-entrypoint.sh"]

# Comando para iniciar aplicação
CMD ["npm", "start"]
