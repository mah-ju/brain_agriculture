# 🔍 Diagnóstico de Problemas no Deploy

## PASSO 1: Verificar Logs do Railway (Backend)

### Como verificar:
1. Acesse o Railway Dashboard
2. Clique no serviço do **backend**
3. Vá na aba **"Deployments"** ou **"Logs"**
4. Procure por erros em vermelho

### O que procurar:

#### ❌ Erro: "Cannot find module" ou "Prisma Client"
**Causa:** Prisma Client não foi gerado
**Solução:** Verificar se `npx prisma generate` está rodando no build

#### ❌ Erro: "Can't reach database server" ou "Connection refused"
**Causa:** `DATABASE_URL` incorreta ou banco não está acessível
**Solução:** Verificar variável `DATABASE_URL` no Railway

#### ❌ Erro: "JWT_SECRET is required"
**Causa:** Variável `JWT_SECRET` não configurada
**Solução:** Adicionar `JWT_SECRET` nas variáveis de ambiente

#### ❌ Erro: "EADDRINUSE" ou "Port already in use"
**Causa:** Porta conflitando
**Solução:** Usar variável `PORT` do Railway (eles fornecem automaticamente)

#### ❌ Erro: "Migration failed" ou "Table does not exist"
**Causa:** Migrações do Prisma não rodaram
**Solução:** Precisa rodar `npx prisma migrate deploy`

---

## PASSO 2: Verificar Variáveis de Ambiente no Railway

### Backend Service - Variáveis OBRIGATÓRIAS:

```
✅ DATABASE_URL
   Formato esperado: postgresql://user:password@host:port/database
   Exemplo Railway: postgresql://postgres:senha@containers-us-west-xxx.railway.app:5432/railway
   
✅ JWT_SECRET
   Pode ser qualquer string longa e aleatória
   Exemplo: minha-chave-secreta-super-segura-123456789
   
✅ PORT
   Railway fornece automaticamente via variável PORT
   Não precisa configurar manualmente, mas pode usar 3000 como fallback
   
✅ FRONTEND_PROD_URL
   URL EXATA do seu app no Vercel
   Exemplo: https://brain-agriculture-gilt.vercel.app
   ⚠️ IMPORTANTE: Deve ser a URL exata, sem barra no final
```

### Como verificar:
1. Railway Dashboard > Seu serviço backend
2. Aba **"Variables"**
3. Verificar se todas as variáveis acima estão configuradas

---

## PASSO 3: Verificar Conexão do Backend com o Banco

### Teste 1: Verificar se o backend está rodando
```bash
# No terminal, teste a URL do backend:
curl https://seu-backend.up.railway.app

# Ou acesse no navegador
```

**Esperado:**
- Se retornar algo (mesmo que erro 404), o backend está rodando ✅
- Se der "Connection refused" ou timeout, o backend não está rodando ❌

### Teste 2: Verificar se o banco está acessível
**No Railway:**
1. Clique no serviço **PostgreSQL**
2. Aba **"Connect"** ou **"Variables"**
3. Copie a `DATABASE_URL` completa
4. Verifique se está no formato correto

**Formato correto:**
```
postgresql://postgres:senha@containers-us-west-xxx.railway.app:5432/railway
```

---

## PASSO 4: Verificar Frontend (Vercel)

### Variável OBRIGATÓRIA no Vercel:

```
✅ NEXT_PUBLIC_API_URL
   Deve ser a URL do backend no Railway
   Exemplo: https://brainagriculture-production-af57.up.railway.app
   ⚠️ NÃO pode ser localhost!
```

### Como verificar:
1. Vercel Dashboard > Seu projeto
2. Settings > Environment Variables
3. Verificar se `NEXT_PUBLIC_API_URL` está configurada

### Teste no navegador:
1. Abra o DevTools (F12)
2. Console
3. Digite: `console.log(process.env.NEXT_PUBLIC_API_URL)`
4. Deve mostrar a URL do Railway (não undefined!)

---

## PASSO 5: Verificar CORS

### Erro comum no console do navegador:
```
Access to fetch at 'https://backend...' from origin 'https://vercel...' 
has been blocked by CORS policy
```

### Como verificar:
1. Abra o DevTools > Network
2. Tente fazer login
3. Veja a requisição que falhou
4. Se der erro CORS, o problema é:
   - `FRONTEND_PROD_URL` no Railway não está com a URL correta do Vercel
   - Ou a URL do Vercel mudou

### Solução:
1. Copie a URL EXATA do seu app no Vercel
2. Vá no Railway > Backend > Variables
3. Atualize `FRONTEND_PROD_URL` com a URL exata
4. Faça redeploy do backend

---

## PASSO 6: Verificar Dockerfile

### Problema atual no Dockerfile:
```dockerfile
# Linha 10 - ERRADO para produção:
CMD ["npm", "run", "start:dev"]
```

### O que isso causa:
- `start:dev` usa watch mode, que consome mais recursos
- Pode não funcionar corretamente em produção
- Pode causar problemas de memória

### Correção necessária:
```dockerfile
CMD ["npm", "run", "start:prod"]
```

---

## PASSO 7: Verificar Migrações do Prisma

### Problema:
O Dockerfile gera o Prisma Client mas NÃO roda as migrações.

### Como verificar se as migrações rodaram:
1. Railway > Backend > Logs
2. Procure por: "migrate" ou "Migration"
3. Se não aparecer nada sobre migrações, elas não rodaram ❌

### Sintomas:
- Backend inicia sem erro
- Mas ao tentar criar um usuário/fazenda, dá erro de tabela não encontrada
- Erro: "relation 'Producer' does not exist"

---

## 🎯 CHECKLIST RÁPIDO DE DIAGNÓSTICO

Marque o que você já verificou:

### Railway - Backend
- [ ] Backend está rodando? (teste a URL no navegador)
- [ ] Logs mostram algum erro em vermelho?
- [ ] Variável `DATABASE_URL` está configurada?
- [ ] Variável `JWT_SECRET` está configurada?
- [ ] Variável `FRONTEND_PROD_URL` está configurada com URL do Vercel?
- [ ] `PORT` está sendo usado corretamente?

### Railway - PostgreSQL
- [ ] Serviço PostgreSQL está rodando?
- [ ] `DATABASE_URL` está no formato correto?

### Vercel - Frontend
- [ ] `NEXT_PUBLIC_API_URL` está configurada?
- [ ] URL aponta para o backend no Railway (não localhost)?
- [ ] Build do Vercel está passando?

### Testes
- [ ] Backend responde quando acessa a URL diretamente?
- [ ] Frontend consegue fazer requisições? (verificar console do navegador)
- [ ] Há erros de CORS no console?

---

## 🚨 PROBLEMAS MAIS COMUNS

### 1. "Backend não responde"
**Possíveis causas:**
- Backend não está rodando (verificar logs)
- Porta errada
- Dockerfile usando `start:dev` que pode falhar

**Solução:**
- Verificar logs do Railway
- Corrigir Dockerfile para usar `start:prod`

### 2. "Erro de CORS"
**Causa:** URL do Vercel não está no CORS do backend

**Solução:**
- Verificar `FRONTEND_PROD_URL` no Railway
- Garantir que é a URL EXATA do Vercel (sem barra no final)
- Fazer redeploy do backend

### 3. "Cannot connect to database"
**Causa:** `DATABASE_URL` incorreta ou banco não acessível

**Solução:**
- Verificar `DATABASE_URL` no Railway
- Garantir que o PostgreSQL está rodando
- Verificar se a URL está no formato correto

### 4. "Tabelas não existem"
**Causa:** Migrações não rodaram

**Solução:**
- Adicionar comando para rodar migrações no Dockerfile ou no startup

---

## 📝 PRÓXIMOS PASSOS

Depois de verificar tudo acima, me diga:

1. **O que aparece nos logs do Railway?** (copie os erros)
2. **O backend responde quando você acessa a URL?**
3. **Quais variáveis de ambiente estão configuradas?**
4. **Há algum erro específico no console do navegador?**

Com essas informações, posso te ajudar a corrigir o problema específico!
