# 🔍 Diagnóstico - Erro no Cadastro em Produção

## ✅ O QUE ESTÁ FUNCIONANDO
- ✅ Tabelas foram criadas no banco (migrações rodaram)
- ✅ Backend provavelmente está rodando

## ❌ O QUE NÃO ESTÁ FUNCIONANDO
- ❌ Cadastro não funciona
- ❌ Aparece mensagem de erro

---

## 🔍 PASSO 1: Verificar Erro Específico

### No Navegador (Frontend):

1. **Abra o DevTools** (F12)
2. Vá na aba **"Console"**
3. Tente fazer um cadastro
4. **Copie TODOS os erros** que aparecerem

### O que procurar:

#### Erro de CORS:
```
Access to fetch at 'https://...' from origin 'https://...' 
has been blocked by CORS policy
```
**Causa:** URL do Vercel não está no CORS do backend

#### Erro de Conexão:
```
Failed to fetch
NetworkError when attempting to fetch resource
```
**Causa:** Backend não está acessível ou URL incorreta

#### Erro 400/422 (Bad Request):
```
statusCode: 400
message: "CPF ou CNPJ inválido"
```
**Causa:** Validação do backend falhando

#### Erro 500 (Internal Server Error):
```
statusCode: 500
message: "Internal server error"
```
**Causa:** Erro no backend (verificar logs)

---

## 🔍 PASSO 2: Verificar Network (Requisições)

1. **DevTools** > Aba **"Network"**
2. Tente fazer cadastro
3. Procure pela requisição para `/producer`
4. Clique nela e veja:
   - **Status:** Qual o código? (200, 400, 500, etc)
   - **Headers:** Veja a URL completa
   - **Response:** O que o backend retornou?

### O que verificar:

#### Status 200:
- Requisição foi bem-sucedida, mas pode ter erro na resposta

#### Status 400/422:
- Erro de validação (CPF/CNPJ inválido, campos faltando)

#### Status 500:
- Erro interno do servidor (verificar logs do Railway)

#### Status 0 ou Failed:
- Requisição nem foi enviada (CORS, URL incorreta, backend offline)

---

## 🔍 PASSO 3: Verificar Variáveis de Ambiente

### Frontend (Vercel):

1. Vercel Dashboard > Projeto > **Settings** > **Environment Variables**
2. Verifique:
   - ✅ `NEXT_PUBLIC_API_URL` está configurada?
   - ✅ URL está correta? (deve ser a URL do Railway, não localhost)
   - ✅ URL tem `https://` no início?

### Backend (Railway):

1. Railway Dashboard > Serviço Backend > **Variables**
2. Verifique:
   - ✅ `DATABASE_URL` está configurada?
   - ✅ `JWT_SECRET` está configurada?
   - ✅ `FRONTEND_PROD_URL` está configurada com URL EXATA do Vercel?

---

## 🔍 PASSO 4: Verificar Logs do Railway

1. Railway Dashboard > Serviço Backend
2. Aba **"Deployments"** ou **"Logs"**
3. Procure por erros recentes (em vermelho)

### O que procurar:

#### Erro de Conexão com Banco:
```
Can't reach database server
Connection refused
```
**Causa:** `DATABASE_URL` incorreta ou banco não acessível

#### Erro de Validação:
```
Validation failed
CPF ou CNPJ inválido
```
**Causa:** Dados enviados não passam na validação

#### Erro de Prisma:
```
PrismaClientKnownRequestError
relation does not exist
```
**Causa:** Tabelas não foram criadas (mas você disse que foram)

#### Erro de JWT:
```
JWT_SECRET is required
```
**Causa:** Variável `JWT_SECRET` não configurada

---

## 🎯 TESTES RÁPIDOS

### Teste 1: Backend está respondendo?

Abra no navegador:
```
https://seu-backend.up.railway.app
```

**Esperado:**
- Se retornar algo (mesmo erro 404), está rodando ✅
- Se der timeout, não está rodando ❌

### Teste 2: API está acessível?

Abra no navegador:
```
https://seu-backend.up.railway.app/producer
```

**Esperado:**
- Se retornar erro 405 (Method Not Allowed), a rota existe ✅
- Se retornar erro 404, rota não encontrada ❌
- Se der timeout, backend não está rodando ❌

### Teste 3: CORS está configurado?

No console do navegador, execute:
```javascript
fetch('https://seu-backend.up.railway.app/producer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Teste', cpfOrCnpj: '12345678900', password: '123456' })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

**Esperado:**
- Se retornar erro de validação (400), CORS está OK ✅
- Se der erro de CORS, problema de configuração ❌

---

## 🐛 PROBLEMAS MAIS COMUNS

### 1. Erro de CORS

**Sintoma:**
```
Access to fetch at '...' has been blocked by CORS policy
```

**Solução:**
1. Verificar `FRONTEND_PROD_URL` no Railway
2. Garantir que é a URL EXATA do Vercel (sem barra no final)
3. Fazer redeploy do backend

### 2. URL da API Incorreta

**Sintoma:**
```
Failed to fetch
NetworkError
```

**Solução:**
1. Verificar `NEXT_PUBLIC_API_URL` no Vercel
2. Garantir que aponta para o Railway (não localhost)
3. Verificar se a URL está correta

### 3. Erro de Validação (400)

**Sintoma:**
```
statusCode: 400
message: "CPF ou CNPJ inválido"
```

**Solução:**
- Verificar se o CPF/CNPJ está sendo enviado corretamente
- Verificar se o formato está correto (com ou sem formatação)

### 4. Erro 500 (Internal Server Error)

**Sintoma:**
```
statusCode: 500
message: "Internal server error"
```

**Solução:**
- Verificar logs do Railway
- Verificar se `DATABASE_URL` está correta
- Verificar se `JWT_SECRET` está configurada

---

## 📝 INFORMAÇÕES QUE PRECISO

Para te ajudar melhor, me envie:

1. **Erro exato do console do navegador:**
   - Copie e cole o erro completo

2. **Status da requisição (Network tab):**
   - Qual o código HTTP? (200, 400, 500, etc)
   - O que aparece na resposta?

3. **Logs do Railway:**
   - Há algum erro nos logs?
   - Copie os últimos erros

4. **Variáveis de ambiente:**
   - `NEXT_PUBLIC_API_URL` no Vercel está configurada?
   - `FRONTEND_PROD_URL` no Railway está configurada?

Com essas informações, consigo identificar o problema exato! 🔍
