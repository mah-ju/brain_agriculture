# 🔍 Diagnóstico Detalhado - Cadastro Não Funciona

## 📋 INFORMAÇÕES NECESSÁRIAS

Preciso que você me envie estas informações:

### 1. Erro no Console do Navegador

1. Abra o app no Vercel
2. Abra DevTools (F12) > Console
3. Tente fazer um cadastro
4. **Copie e cole TODOS os erros** que aparecerem

### 2. Network Tab - Requisição

1. DevTools > Aba **"Network"**
2. Tente fazer cadastro
3. Procure pela requisição para `/producer`
4. Clique nela
5. Me diga:
   - **Status Code:** (200, 400, 500, etc)
   - **Request URL:** (URL completa)
   - **Response:** (o que aparece na resposta)

### 3. Verificar API_URL

No console do navegador, execute:
```javascript
console.log('API_URL:', process.env.NEXT_PUBLIC_API_URL)
```

**O que aparece?** Deve ser a URL do Railway, não `undefined`.

### 4. Testar Backend Diretamente

No console do navegador, execute:
```javascript
fetch('https://seu-backend.up.railway.app/producer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Teste',
    cpfOrCnpj: '12345678900',
    password: '123456'
  })
})
.then(r => {
  console.log('Status:', r.status);
  return r.text();
})
.then(text => {
  console.log('Response:', text);
})
.catch(err => console.error('Erro:', err));
```

**O que aparece?** Copie o resultado completo.

### 5. Logs do Railway

1. Railway Dashboard > Backend > Logs
2. Procure por erros recentes
3. **Copie os últimos erros** (especialmente em vermelho)

### 6. Verificar Variáveis

**No Vercel:**
- `NEXT_PUBLIC_API_URL` está configurada?
- Qual o valor? (pode mascarar a senha, mas me diga a URL)

**No Railway:**
- `FRONTEND_PROD_URL` está configurada?
- Qual o valor? (URL do Vercel)

---

## 🎯 TESTES RÁPIDOS

### Teste 1: Backend está acessível?

Abra no navegador:
```
https://seu-backend.up.railway.app
```

**O que acontece?**
- Se retornar algo (mesmo erro), está rodando ✅
- Se der timeout, não está rodando ❌

### Teste 2: CORS está configurado?

No console, execute o teste acima (item 4).

**Se der erro de CORS:**
- `FRONTEND_PROD_URL` no Railway está incorreta
- URL do Vercel não está no CORS

**Se não der erro de CORS:**
- CORS está OK, problema é outro

---

## 🐛 PROBLEMAS COMUNS

### Problema 1: API_URL ainda undefined

**Sintoma:**
```
POST https://vercel.app/undefined/producer
```

**Solução:**
- Verificar se `NEXT_PUBLIC_API_URL` foi adicionada no Vercel
- Verificar se foi feito redeploy após adicionar
- Verificar se o valor está correto

### Problema 2: CORS bloqueando

**Sintoma:**
```
Access to fetch at '...' has been blocked by CORS policy
```

**Solução:**
- Verificar `FRONTEND_PROD_URL` no Railway
- Garantir que é a URL EXATA do Vercel (sem barra no final)
- Fazer redeploy do backend

### Problema 3: Backend não responde

**Sintoma:**
```
Failed to fetch
NetworkError
```

**Solução:**
- Verificar se backend está rodando (logs do Railway)
- Verificar se a URL está correta
- Verificar se há erros nos logs

### Problema 4: Erro 500 no backend

**Sintoma:**
```
Status: 500
Internal server error
```

**Solução:**
- Verificar logs do Railway
- Verificar se `DATABASE_URL` está correta
- Verificar se `JWT_SECRET` está configurada

---

## 📝 CHECKLIST DE VERIFICAÇÃO

Marque o que você já verificou:

### Frontend (Vercel):
- [ ] `NEXT_PUBLIC_API_URL` está configurada?
- [ ] Valor é a URL do Railway (não localhost)?
- [ ] Redeploy foi feito após adicionar variável?
- [ ] `console.log(process.env.NEXT_PUBLIC_API_URL)` mostra a URL?

### Backend (Railway):
- [ ] Backend está rodando? (teste a URL no navegador)
- [ ] `DATABASE_URL` está configurada?
- [ ] `JWT_SECRET` está configurada?
- [ ] `FRONTEND_PROD_URL` está configurada com URL do Vercel?
- [ ] Logs mostram algum erro?

### Testes:
- [ ] Backend responde quando acessa a URL diretamente?
- [ ] Teste de fetch no console funciona?
- [ ] Qual o erro específico que aparece?

---

## 🚨 ENVIE ESTAS INFORMAÇÕES

Para eu te ajudar melhor, preciso:

1. **Erro completo do console** (copie e cole)
2. **Status da requisição** (Network tab)
3. **Resultado do `console.log(process.env.NEXT_PUBLIC_API_URL)`**
4. **Resultado do teste de fetch** (item 4 acima)
5. **Últimos erros dos logs do Railway**

Com essas informações, consigo identificar o problema exato! 🔍
