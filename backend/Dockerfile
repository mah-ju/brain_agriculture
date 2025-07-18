# Dockerfile.prod

FROM node:20 AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

# ----------

FROM node:20 AS runner
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app .


ENV NODE_ENV=production

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start:prod" ]
