FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:20

WORKDIR /usr/src/app

COPY --from=builder /app ./

EXPOSE 3000
CMD ["npm", "run", "start"]