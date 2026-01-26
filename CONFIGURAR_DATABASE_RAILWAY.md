# 🗄️ Como Configurar Database no Railway

## PASSO 1: Configurar DATABASE_URL no Backend

### No Railway Dashboard:

1. **Acesse o serviço do BACKEND** (não o PostgreSQL)
2. Vá na aba **"Variables"** ou **"Environment Variables"**
3. Clique em **"New Variable"** ou **"Add Variable"**
4. Adicione:

   **Nome da variável:**
   ```
   DATABASE_URL
   ```

   **Valor:**
   ```
   postgresql://postgres:YjOrLNDqcrMEXKoxnVltyJQKYKODVnDB@yamabiko.proxy.rlwy.net:40121/railway
   ```
   *(Use a `DATABASE_PUBLIC_URL` que você copiou do serviço PostgreSQL)*

5. Salve

### ⚠️ IMPORTANTE:
- A variável deve ser `DATABASE_URL` (não `DATABASE_PUBLIC_URL`)
- O Prisma procura por `DATABASE_URL` especificamente
- Você pode copiar o valor de `DATABASE_PUBLIC_URL` do PostgreSQL e colar em `DATABASE_URL` do backend

---

## PASSO 2: Rodar Migrações no Railway

### Problema Atual:
O Dockerfile não roda as migrações automaticamente. Você precisa rodar manualmente na primeira vez.

### Opção A: Rodar via Railway CLI (Recomendado)

1. **Instale o Railway CLI:**
   ```bash
   npm i -g @railway/cli
   ```

2. **Faça login:**
   ```bash
   railway login
   ```

3. **Conecte ao projeto:**
   ```bash
   railway link
   ```

4. **Rode as migrações:**
   ```bash
   cd backend
   railway run npx prisma migrate deploy
   ```

### Opção B: Rodar via Railway Dashboard (Mais fácil)

1. No Railway Dashboard, vá no serviço do **backend**
2. Aba **"Deployments"**
3. Clique nos **3 pontinhos** do último deployment
4. Selecione **"Open in Shell"** ou **"Run Command"**
5. Execute:
   ```bash
   npx prisma migrate deploy
   ```

### Opção C: Adicionar no Dockerfile (Permanente)

Modificar o Dockerfile para rodar migrações automaticamente (vou fazer isso depois).

---

## PASSO 3: Verificar se Funcionou

### Teste 1: Verificar se as tabelas foram criadas

1. No Railway, vá no serviço **PostgreSQL**
2. Aba **"Connect"** ou **"Data"**
3. Tente acessar via interface ou use:
   ```bash
   railway connect postgres
   ```
4. Execute:
   ```sql
   \dt
   ```
5. Deve listar as tabelas: `Producer`, `Farm`, `CropSeason`, `PlantedCrop`

### Teste 2: Verificar logs do backend

1. Railway > Backend > Logs
2. Procure por erros relacionados a banco de dados
3. Se não houver erros de conexão, está funcionando ✅

---

## 🔄 OPÇÃO: Migrar Dados do Banco Local para Railway

Se você quer copiar os dados do seu banco local para o Railway:

### Passo 1: Fazer dump do banco local

```bash
# No terminal, dentro da pasta backend:
pg_dump -h localhost -p 5435 -U postgres_adm -d brain_agriculture > backup.sql
```

*(Ajuste a porta, usuário e nome do banco conforme seu docker-compose.yaml)*

### Passo 2: Restaurar no Railway

```bash
# Conecte ao Railway PostgreSQL:
railway connect postgres

# Ou use a DATABASE_PUBLIC_URL diretamente:
psql "postgresql://postgres:YjOrLNDqcrMEXKoxnVltyJQKYKODVnDB@yamabiko.proxy.rlwy.net:40121/railway" < backup.sql
```

### ⚠️ ATENÇÃO:
- Isso vai **substituir** todos os dados do Railway pelos do local
- Faça backup antes se tiver dados importantes no Railway
- As migrações precisam estar rodadas primeiro (tabelas criadas)

---

## 📋 CHECKLIST COMPLETO

### Railway - Backend Service:
- [ ] Variável `DATABASE_URL` configurada (com valor do `DATABASE_PUBLIC_URL`)
- [ ] Variável `JWT_SECRET` configurada
- [ ] Variável `FRONTEND_PROD_URL` configurada (URL do Vercel)
- [ ] Migrações rodadas (`npx prisma migrate deploy`)

### Railway - PostgreSQL Service:
- [ ] Serviço está rodando
- [ ] `DATABASE_PUBLIC_URL` está disponível

### Teste:
- [ ] Backend inicia sem erros (verificar logs)
- [ ] Tabelas foram criadas no banco
- [ ] Backend consegue conectar ao banco

---

## 🚨 PROBLEMAS COMUNS

### Erro: "Can't reach database server"
**Causa:** `DATABASE_URL` incorreta ou não configurada
**Solução:** Verificar se a variável está configurada no serviço do backend

### Erro: "relation 'Producer' does not exist"
**Causa:** Migrações não rodaram
**Solução:** Rodar `npx prisma migrate deploy`

### Erro: "Connection refused"
**Causa:** URL do banco incorreta ou banco não está acessível
**Solução:** Verificar se o PostgreSQL está rodando no Railway

---

## 🎯 RESUMO RÁPIDO

1. **Copie** a `DATABASE_PUBLIC_URL` do serviço PostgreSQL no Railway
2. **Cole** como `DATABASE_URL` no serviço do backend no Railway
3. **Rode** as migrações: `npx prisma migrate deploy` (via CLI ou Shell do Railway)
4. **Verifique** se funcionou (logs e tabelas)

Depois disso, o backend deve conseguir conectar ao banco! 🎉
