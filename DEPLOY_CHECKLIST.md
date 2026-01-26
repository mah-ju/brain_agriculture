# Checklist de Deploy - Brain Agriculture

## 🔴 PROBLEMAS CRÍTICOS IDENTIFICADOS

### 1. **Dockerfile do Backend (CRÍTICO)**
**Problema:** O Dockerfile está usando `start:dev` que é para desenvolvimento
- **Linha 10:** `CMD ["npm", "run", "start:dev"]`
- **Correção necessária:** Mudar para `start:prod` ou `node dist/main`

### 2. **Migrações do Prisma (CRÍTICO)**
**Problema:** O Dockerfile gera o Prisma Client mas NÃO roda as migrações
- **Linha 7:** `RUN npx prisma generate` ✅ (OK)
- **Falta:** `RUN npx prisma migrate deploy` ou comando similar
- **Correção necessária:** Adicionar comando para rodar migrações no build ou no startup

### 3. **Variáveis de Ambiente - Backend (Railway)**

#### Variáveis OBRIGATÓRIAS no Railway:
```
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=sua_chave_secreta_super_segura_aqui
PORT=3000 (ou a porta que o Railway fornecer)
FRONTEND_PROD_URL=https://seu-app.vercel.app (URL exata do Vercel)
FRONTEND_DEV_URL=http://localhost:3000 (opcional, para desenvolvimento)
JWT_EXPIRES_IN=1h (opcional, padrão é 1h)
```

#### Variáveis OPCIONAIS:
```
RAILWAY_URL=https://seu-backend.up.railway.app (se quiser incluir no CORS)
```

### 4. **Variáveis de Ambiente - Frontend (Vercel)**

#### Variável OBRIGATÓRIA no Vercel:
```
NEXT_PUBLIC_API_URL=https://seu-backend.up.railway.app
```

⚠️ **IMPORTANTE:** A URL deve ser a URL do seu backend no Railway (não localhost!)

### 5. **CORS no Backend**
**Status:** Parcialmente configurado, mas precisa verificar:
- ✅ CORS está habilitado
- ⚠️ URL do Vercel está hardcoded no código (linha 19 do main.ts)
- ⚠️ Precisa garantir que a URL exata do Vercel esteja na variável `FRONTEND_PROD_URL`

### 6. **Database no Railway**
**Necessário:**
- Criar um serviço PostgreSQL no Railway
- Copiar a `DATABASE_URL` que o Railway fornece
- Configurar essa URL nas variáveis de ambiente do backend

---

## 📋 CHECKLIST DE CONFIGURAÇÃO

### Backend (Railway)

#### 1. Database
- [ ] Criar serviço PostgreSQL no Railway
- [ ] Copiar a `DATABASE_URL` fornecida pelo Railway
- [ ] Anotar a URL (será usada nas variáveis de ambiente)

#### 2. Variáveis de Ambiente no Railway
- [ ] `DATABASE_URL` = URL do PostgreSQL do Railway
- [ ] `JWT_SECRET` = Gerar uma chave secreta forte (ex: usar `openssl rand -base64 32`)
- [ ] `PORT` = Deixar Railway gerenciar (ou usar `3000`)
- [ ] `FRONTEND_PROD_URL` = URL exata do seu app no Vercel (ex: `https://brain-agriculture-gilt.vercel.app`)
- [ ] `JWT_EXPIRES_IN` = `1h` (opcional)

#### 3. Dockerfile (precisa corrigir)
- [ ] Mudar `CMD ["npm", "run", "start:dev"]` para `CMD ["npm", "run", "start:prod"]`
- [ ] Adicionar comando para rodar migrações (ver opções abaixo)

#### 4. Deploy
- [ ] Conectar repositório GitHub ao Railway
- [ ] Configurar root directory como `backend/` (se necessário)
- [ ] Railway deve detectar o Dockerfile automaticamente
- [ ] Verificar logs após deploy

### Frontend (Vercel)

#### 1. Variáveis de Ambiente no Vercel
- [ ] `NEXT_PUBLIC_API_URL` = URL do backend no Railway (ex: `https://brainagriculture-production-af57.up.railway.app`)

#### 2. Deploy
- [ ] Conectar repositório GitHub ao Vercel
- [ ] Configurar root directory como `frontend/` (se necessário)
- [ ] Vercel deve detectar Next.js automaticamente
- [ ] Verificar build logs

---

## 🔧 CORREÇÕES NECESSÁRIAS NO CÓDIGO

### 1. Dockerfile do Backend
**Arquivo:** `backend/Dockerfile`

**Mudança necessária:**
```dockerfile
# ANTES (linha 10):
CMD ["npm", "run", "start:dev"]

# DEPOIS:
CMD ["npm", "run", "start:prod"]
```

### 2. Migrações do Prisma
**Opção A - Rodar migrações no build (recomendado):**
```dockerfile
# Adicionar após linha 7:
RUN npx prisma migrate deploy
```

**Opção B - Rodar migrações no startup:**
Criar um script `start.sh`:
```bash
#!/bin/sh
npx prisma migrate deploy
npm run start:prod
```

E mudar o CMD para:
```dockerfile
CMD ["sh", "start.sh"]
```

**Opção C - Usar Railway Deploy Script:**
No Railway, adicionar um "Deploy Script":
```bash
npx prisma migrate deploy && npm run start:prod
```

### 3. CORS - Remover URL hardcoded (opcional, mas recomendado)
**Arquivo:** `backend/src/main.ts`

A URL do Vercel está hardcoded. Idealmente, só usar variáveis de ambiente:
```typescript
origin: [
  configService.get('FRONTEND_DEV_URL', 'http://localhost:3000'),
  configService.get('FRONTEND_PROD_URL'), // Sem default, obrigatório em produção
].filter(Boolean), // Remove valores undefined
```

---

## 🧪 TESTES PÓS-DEPLOY

### Backend (Railway)
1. [ ] Acessar `https://seu-backend.up.railway.app` (deve retornar algo ou erro 404, não erro de conexão)
2. [ ] Testar endpoint de health (se existir) ou `/auth/login` (deve retornar erro de validação, não erro 500)
3. [ ] Verificar logs no Railway para erros

### Frontend (Vercel)
1. [ ] Acessar a URL do Vercel
2. [ ] Abrir DevTools > Console
3. [ ] Verificar se `NEXT_PUBLIC_API_URL` está definido
4. [ ] Tentar fazer login
5. [ ] Verificar se há erros de CORS no console

### Integração
1. [ ] Fazer login no frontend
2. [ ] Verificar se o token é recebido
3. [ ] Testar criar uma fazenda
4. [ ] Verificar se os dados são salvos no banco

---

## 🐛 PROBLEMAS COMUNS E SOLUÇÕES

### Erro: "Cannot connect to database"
- **Causa:** `DATABASE_URL` incorreta ou banco não criado
- **Solução:** Verificar `DATABASE_URL` no Railway, garantir que o PostgreSQL está rodando

### Erro: "CORS policy"
- **Causa:** URL do frontend não está no CORS do backend
- **Solução:** Verificar `FRONTEND_PROD_URL` no Railway, garantir que é a URL exata do Vercel

### Erro: "Prisma Client not generated"
- **Causa:** Migrações não rodaram ou Prisma Client não foi gerado
- **Solução:** Verificar se `prisma generate` e `prisma migrate deploy` rodaram

### Erro: "JWT_SECRET is required"
- **Causa:** Variável `JWT_SECRET` não configurada
- **Solução:** Adicionar `JWT_SECRET` nas variáveis de ambiente do Railway

### Frontend não consegue conectar ao backend
- **Causa:** `NEXT_PUBLIC_API_URL` incorreta ou backend não está rodando
- **Solução:** Verificar URL no Vercel, testar backend diretamente

---

## 📝 RESUMO RÁPIDO

### O que fazer AGORA (sem alterar código):

1. **Railway - Backend:**
   - Criar PostgreSQL
   - Adicionar variáveis de ambiente (DATABASE_URL, JWT_SECRET, FRONTEND_PROD_URL, PORT)
   - Fazer deploy (mesmo com Dockerfile errado, para testar)

2. **Vercel - Frontend:**
   - Adicionar variável `NEXT_PUBLIC_API_URL` com URL do Railway
   - Fazer deploy

3. **Testar:**
   - Verificar se backend responde
   - Verificar se frontend consegue conectar
   - Verificar logs de erro

### O que fazer DEPOIS (alterar código):

1. Corrigir Dockerfile (mudar `start:dev` para `start:prod`)
2. Adicionar comando de migrações do Prisma
3. (Opcional) Melhorar configuração de CORS

---

## 🔗 LINKS ÚTEIS

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Prisma Migrations: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-production
