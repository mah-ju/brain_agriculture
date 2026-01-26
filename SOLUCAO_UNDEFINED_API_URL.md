# 🔧 Solução: API_URL está undefined

## ❌ PROBLEMA IDENTIFICADO

O erro mostra:
```
POST https://brain-agriculture-gilt.vercel.app/undefined/producer
```

Isso significa que `NEXT_PUBLIC_API_URL` está `undefined` no Vercel!

---

## ✅ SOLUÇÃO

### Passo 1: Configurar Variável no Vercel

1. **Acesse o Vercel Dashboard**
2. Clique no seu projeto
3. Vá em **"Settings"** > **"Environment Variables"**
4. Clique em **"Add New"**
5. Configure:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** URL do seu backend no Railway
     ```
     https://brainagriculture-production-af57.up.railway.app
     ```
     *(Use a URL EXATA do seu backend no Railway)*
   - **Environment:** Selecione **"Production"** (e "Preview" se quiser)
6. Clique em **"Save"**

### Passo 2: Fazer Redeploy

⚠️ **IMPORTANTE:** Após adicionar a variável, você PRECISA fazer redeploy!

**Opção A - Redeploy Automático:**
1. Faça um commit qualquer (pode ser só um espaço em branco)
2. Push para o repositório
3. Vercel vai fazer deploy automaticamente

**Opção B - Redeploy Manual:**
1. Vercel Dashboard > Projeto
2. Aba **"Deployments"**
3. Clique nos **3 pontinhos** do último deployment
4. Selecione **"Redeploy"**

### Passo 3: Verificar

Após o redeploy:

1. Acesse o app no Vercel
2. Abra DevTools > Console
3. Execute:
   ```javascript
   console.log(process.env.NEXT_PUBLIC_API_URL)
   ```
4. Deve mostrar a URL do Railway (não `undefined`)

---

## 🔍 POR QUE ISSO ACONTECEU?

### Variáveis `NEXT_PUBLIC_*` no Next.js:

- São **embutidas no código** durante o build
- Se você adicionar a variável DEPOIS do build, ela não estará disponível
- Por isso precisa fazer **redeploy** após adicionar

### Como funciona:

1. **Build time:** Next.js pega `NEXT_PUBLIC_API_URL` e coloca no código
2. **Runtime:** O código já tem o valor embutido
3. Se a variável não existir no build, fica `undefined` para sempre

---

## ✅ CORREÇÃO NO CÓDIGO

Já corrigi o código para:
- ✅ Ter fallback para desenvolvimento local
- ✅ Mostrar aviso no console se a variável não estiver configurada
- ✅ Funcionar mesmo se a variável estiver undefined (com fallback)

Mas **ainda precisa configurar no Vercel e fazer redeploy!**

---

## 📋 CHECKLIST

- [ ] Variável `NEXT_PUBLIC_API_URL` adicionada no Vercel
- [ ] Valor é a URL do backend no Railway (não localhost!)
- [ ] Redeploy feito (automático ou manual)
- [ ] Verificado no console que não está mais `undefined`
- [ ] Testado fazer cadastro novamente

---

## 🎯 RESUMO RÁPIDO

1. **Vercel** > Settings > Environment Variables
2. Adicionar: `NEXT_PUBLIC_API_URL` = URL do Railway
3. **Redeploy** (commit + push ou redeploy manual)
4. **Testar** novamente

Depois disso, deve funcionar! 🎉
