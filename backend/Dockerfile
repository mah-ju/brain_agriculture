FROM node:20
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
RUN npm install -g @nestjs/cli
COPY . . 
RUN npx prisma generate 
RUN npm run build
EXPOSE 3000

# Copia e torna o script de startup executável
COPY start.sh ./
RUN chmod +x start.sh

# Usa o script de startup que roda migrações antes de iniciar
CMD ["./start.sh"]
