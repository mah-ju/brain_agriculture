# 🔧 Variáveis de Ambiente - Guia Final

## 📋 RAILWAY (Backend) - Variáveis Necessárias

### ✅ OBRIGATÓRIAS (Mantenha):
```
✅ DATABASE_URL
   - Usada pelo Prisma para conectar ao banco
   - Formato: postgresql://postgres:senha@host:port/database

✅ JWT_SECRET
   - Usada para assinar tokens JWT
   - Pode ser qualquer string longa e segura

✅ FRONTEND_PROD_URL
   - Usada para configurar CORS
   - Deve ser a URL EXATA do Vercel
   - Exemplo: https://brain-agriculture-gilt.vercel.app

✅ PORT
   - Porta onde o servidor vai rodar
   - Railway geralmente fornece automaticamente
   - Pode deixar ou usar 3000 como fallback
```

### ⚠️ OPCIONAIS (Podem ser removidas):
```
⚠️ FRONTEND_DEV_URL
   - Só para desenvolvimento local
   - Tem default: 'http://localhost:3000'
   - Pode remover se não usar desenvolvimento local

⚠️ JWT_EXPIRES_IN
   - Tempo de expiração do token JWT
   - Tem default: '1h'
   - Pode remover se quiser usar o default

❌ RAILWAY_URL
   - NÃO É USADA NO CÓDIGO
   - Pode ser REMOVIDA com segurança
```

---

## 📋 VERCEL (Frontend) - Variáveis Necessárias

### ✅ OBRIGATÓRIA (Só precisa de uma):
```
✅ NEXT_PUBLIC_API_URL
   - URL do backend no Railway
   - Exemplo: https://brainagriculture-production-af57.up.railway.app
```

### ❌ NÃO PRECISA (Podem ser removidas):
```
❌ JWT_EXPIRES_IN
❌ RAILWAY_URL
❌ PORT
❌ POSTGRES_*
❌ PGPASSWORD
❌ PGDATABASE
❌ RAILWAY_DEPLOYMENT_DRAINING_SECONDS
❌ SSL_CERT_DAYS
```

**Todas essas são do backend/banco e não são usadas pelo frontend!**

---

## 🧹 LIMPEZA RECOMENDADA

### No Railway (Backend):
**Pode remover:**
- ❌ `RAILWAY_URL` (não é usada)

**Pode manter ou remover (opcionais):**
- ⚠️ `FRONTEND_DEV_URL` (tem default)
- ⚠️ `JWT_EXPIRES_IN` (tem default)

**Mantenha:**
- ✅ `DATABASE_URL`
- ✅ `JWT_SECRET`
- ✅ `FRONTEND_PROD_URL`
- ✅ `PORT` (ou deixe Railway gerenciar)

### No Vercel (Frontend):
**Pode remover TODAS as variáveis do Railway:**
- ❌ Todas as que têm logo do Railway
- ❌ Todas relacionadas a PostgreSQL
- ❌ Todas relacionadas a JWT (exceto se tiver alguma específica do frontend, mas não tem)

**Mantenha/Adicione:**
- ✅ `NEXT_PUBLIC_API_URL` (URL do backend no Railway)

---

## 🎯 RESUMO

### Railway (Backend) - Mínimo necessário:
```
DATABASE_URL          ✅ Obrigatória
JWT_SECRET            ✅ Obrigatória
FRONTEND_PROD_URL     ✅ Obrigatória
PORT                  ✅ Obrigatória (ou automático)
```

### Vercel (Frontend) - Mínimo necessário:
```
NEXT_PUBLIC_API_URL   ✅ Obrigatória (ADICIONAR ESTA!)
```

---

## ✅ AÇÃO RECOMENDADA

### 1. Railway - Remover:
- `RAILWAY_URL` (não é usada)

### 2. Vercel - Remover:
- Todas as variáveis do Railway/PostgreSQL (não são usadas pelo frontend)

### 3. Vercel - Adicionar:
- `NEXT_PUBLIC_API_URL` = URL do backend no Railway

### 4. Fazer redeploy:
- Railway: não precisa (só se remover variáveis)
- Vercel: SIM, precisa redeploy após adicionar `NEXT_PUBLIC_API_URL`

---

## 🔍 POR QUE LIMPAR?

1. **Menos confusão:** Variáveis que não são usadas podem confundir
2. **Mais seguro:** Menos variáveis = menos superfície de ataque
3. **Mais claro:** Fica óbvio quais variáveis são realmente necessárias
4. **Melhor performance:** (marginal, mas ajuda)

---

## 📝 CHECKLIST FINAL

### Railway (Backend):
- [ ] `DATABASE_URL` configurada ✅
- [ ] `JWT_SECRET` configurada ✅
- [ ] `FRONTEND_PROD_URL` configurada ✅
- [ ] `PORT` configurada (ou automático) ✅
- [ ] `RAILWAY_URL` removida (opcional) ❌

### Vercel (Frontend):
- [ ] `NEXT_PUBLIC_API_URL` adicionada ✅
- [ ] Variáveis do Railway removidas (opcional) ❌
- [ ] Redeploy feito ✅

---

🎉 **Depois disso, tudo deve funcionar!**
