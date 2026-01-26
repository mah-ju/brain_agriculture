# ✅ Checklist Final - Deploy em Produção

## 🔧 CORREÇÕES FEITAS NO CÓDIGO

### 1. ✅ Dockerfile Corrigido
- **Antes:** `CMD ["npm", "run", "start:dev"]` (modo desenvolvimento)
- **Depois:** Usa script `start.sh` que roda migrações e inicia em modo produção

### 2. ✅ Migrações Automáticas
- Criado script `start.sh` que roda `prisma migrate deploy` antes de iniciar
- Migrações rodam automaticamente a cada deploy

### 3. ✅ CORS Melhorado
- Removidos valores hardcoded
- Usa apenas variáveis de ambiente
- Mais flexível e seguro

---

## 📋 CONFIGURAÇÕES NECESSÁRIAS NO RAILWAY

### Backend Service - Variáveis de Ambiente:

#### ✅ OBRIGATÓRIAS:
```
DATABASE_URL
Valor: postgresql://postgres:YjOrLNDqcrMEXKoxnVltyJQKYKODVnDB@yamabiko.proxy.rlwy.net:40121/railway
(Use a DATABASE_PUBLIC_URL do serviço PostgreSQL)

JWT_SECRET
Valor: qualquer string longa e segura
Exemplo: minha-chave-secreta-super-segura-123456789-abcdef

FRONTEND_PROD_URL
Valor: URL exata do seu app no Vercel
Exemplo: https://brain-agriculture-gilt.vercel.app
⚠️ IMPORTANTE: Sem barra no final!
```

#### ⚙️ OPCIONAIS (com defaults):
```
PORT
Railway fornece automaticamente, não precisa configurar

FRONTEND_DEV_URL
Valor: http://localhost:3000 (opcional, para desenvolvimento local)

JWT_EXPIRES_IN
Valor: 1h (opcional, padrão é 1h)
```

---

## 📋 CONFIGURAÇÕES NECESSÁRIAS NO VERCEL

### Frontend - Variáveis de Ambiente:

#### ✅ OBRIGATÓRIA:
```
NEXT_PUBLIC_API_URL
Valor: URL do backend no Railway
Exemplo: https://brainagriculture-production-af57.up.railway.app
⚠️ NÃO pode ser localhost!
```

---

## 🚀 PASSOS PARA DEPLOY

### 1. Railway - Backend

#### Passo 1: Configurar Variáveis de Ambiente
1. Acesse Railway Dashboard
2. Clique no serviço do **backend**
3. Vá em **"Variables"**
4. Adicione as variáveis obrigatórias:
   - `DATABASE_URL` (copie do PostgreSQL)
   - `JWT_SECRET` (gere uma chave secreta)
   - `FRONTEND_PROD_URL` (URL do Vercel)

#### Passo 2: Fazer Deploy
1. Railway detecta automaticamente o Dockerfile
2. O build vai:
   - Instalar dependências
   - Gerar Prisma Client
   - Buildar o projeto
   - Copiar script de startup
3. No startup, o script vai:
   - Rodar migrações automaticamente
   - Iniciar o servidor em modo produção

#### Passo 3: Verificar Logs
1. Vá em **"Deployments"** > **"Logs"**
2. Procure por:
   - ✅ "Rodando migrações do Prisma..."
   - ✅ "Migrações concluídas. Iniciando servidor..."
   - ✅ "Nest application successfully started"

### 2. Vercel - Frontend

#### Passo 1: Configurar Variável de Ambiente
1. Acesse Vercel Dashboard
2. Clique no projeto
3. Vá em **"Settings"** > **"Environment Variables"**
4. Adicione:
   - `NEXT_PUBLIC_API_URL` = URL do backend no Railway

#### Passo 2: Fazer Deploy
1. Vercel detecta Next.js automaticamente
2. Build vai compilar o projeto
3. Deploy automático

#### Passo 3: Verificar
1. Acesse a URL do Vercel
2. Abra DevTools > Console
3. Verifique se não há erros de conexão

---

## 🧪 TESTES PÓS-DEPLOY

### Teste 1: Backend está rodando?
```bash
# Acesse a URL do backend no navegador:
https://seu-backend.up.railway.app

# Deve retornar algo (mesmo que erro 404)
# Se der timeout, o backend não está rodando
```

### Teste 2: Migrações rodaram?
1. Railway > Backend > Logs
2. Procure por: "Rodando migrações do Prisma..."
3. Se aparecer "Migrações concluídas", está OK ✅

### Teste 3: Frontend consegue conectar?
1. Abra o app no Vercel
2. DevTools > Console
3. Tente fazer login
4. Verifique se não há erros de CORS ou conexão

### Teste 4: Criar usuário e login
1. Criar um novo usuário
2. Fazer login
3. Verificar se o token é recebido
4. Testar criar uma fazenda

---

## 🐛 TROUBLESHOOTING

### Erro: "Cannot find module"
**Causa:** Build não completou
**Solução:** Verificar logs do Railway, garantir que o build passou

### Erro: "Can't reach database server"
**Causa:** `DATABASE_URL` incorreta ou não configurada
**Solução:** Verificar variável `DATABASE_URL` no Railway

### Erro: "JWT_SECRET is required"
**Causa:** Variável não configurada
**Solução:** Adicionar `JWT_SECRET` no Railway

### Erro: "CORS policy"
**Causa:** `FRONTEND_PROD_URL` incorreta ou não configurada
**Solução:** Verificar URL exata do Vercel na variável `FRONTEND_PROD_URL`

### Erro: "relation 'Producer' does not exist"
**Causa:** Migrações não rodaram
**Solução:** Verificar logs do startup, deve aparecer "Rodando migrações..."

### Erro: "Connection refused" no frontend
**Causa:** `NEXT_PUBLIC_API_URL` incorreta ou backend não está rodando
**Solução:** Verificar URL do backend no Vercel e se o backend está rodando

---

## 📝 RESUMO DO QUE FOI FEITO

### Arquivos Modificados:
1. ✅ `backend/Dockerfile` - Corrigido para produção
2. ✅ `backend/start.sh` - Script de startup com migrações
3. ✅ `backend/src/main.ts` - CORS melhorado

### Arquivos Criados:
1. ✅ `backend/start.sh` - Script de startup
2. ✅ `PRODUCAO_CHECKLIST_FINAL.md` - Este arquivo

---

## 🎯 PRÓXIMOS PASSOS

1. **Commit e push das alterações:**
   ```bash
   git add .
   git commit -m "fix: configuração para produção - Dockerfile e migrações"
   git push
   ```

2. **Configurar variáveis no Railway:**
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `FRONTEND_PROD_URL`

3. **Configurar variável no Vercel:**
   - `NEXT_PUBLIC_API_URL`

4. **Aguardar deploy automático** (ou fazer deploy manual)

5. **Testar:**
   - Verificar logs do Railway
   - Testar login no frontend
   - Criar uma fazenda

---

## ✅ CHECKLIST FINAL

### Railway - Backend:
- [ ] Variável `DATABASE_URL` configurada
- [ ] Variável `JWT_SECRET` configurada
- [ ] Variável `FRONTEND_PROD_URL` configurada
- [ ] Deploy feito
- [ ] Logs mostram migrações rodando
- [ ] Backend está respondendo

### Vercel - Frontend:
- [ ] Variável `NEXT_PUBLIC_API_URL` configurada
- [ ] Deploy feito
- [ ] App está acessível

### Testes:
- [ ] Backend responde
- [ ] Frontend consegue conectar
- [ ] Login funciona
- [ ] Criar fazenda funciona

---

🎉 **Pronto! Agora é só configurar as variáveis de ambiente e fazer deploy!**
