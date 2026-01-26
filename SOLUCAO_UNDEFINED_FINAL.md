# ✅ Solução Final - API_URL está undefined

## 🔴 PROBLEMA CONFIRMADO

A URL está como:
```
https://brain-agriculture-gilt.vercel.app/undefined/producer
```

Isso significa que `NEXT_PUBLIC_API_URL` está `undefined` no build do Vercel.

---

## ✅ SOLUÇÃO PASSO A PASSO

### Passo 1: Adicionar Variável no Vercel

1. **Acesse:** https://vercel.com/dashboard
2. **Clique no seu projeto:** `brain-agriculture-gilt`
3. **Vá em:** Settings > Environment Variables
4. **Clique em:** "Add New"
5. **Configure:**
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** URL do seu backend no Railway
     ```
     https://brainagriculture-production-af57.up.railway.app
     ```
     *(Use a URL EXATA do seu backend no Railway - substitua pela sua URL real)*
   - **Environment:** 
     - ✅ Production
     - ✅ Preview (opcional, mas recomendado)
     - ❌ Development (não precisa, você usa localhost)
6. **Clique em:** "Save"

### Passo 2: Fazer Redeploy (OBRIGATÓRIO!)

⚠️ **IMPORTANTE:** Variáveis `NEXT_PUBLIC_*` são embutidas no código durante o build. Se você adicionar a variável DEPOIS do build, ela não estará disponível até fazer um novo build.

#### Opção A - Redeploy Automático (Recomendado):

```bash
# No terminal, na pasta do projeto:
git add .
git commit -m "trigger redeploy"
git push
```

O Vercel vai detectar o push e fazer deploy automaticamente.

#### Opção B - Redeploy Manual:

1. **Vercel Dashboard** > Projeto
2. Aba **"Deployments"**
3. Clique nos **3 pontinhos** (⋮) do último deployment
4. Selecione **"Redeploy"**
5. Aguarde o deploy terminar

### Passo 3: Verificar se Funcionou

Após o redeploy:

1. **Acesse o app no Vercel**
2. **Aguarde alguns segundos** (pode levar um pouco para propagar)
3. **Abra DevTools** (F12) > **Network**
4. **Tente fazer cadastro novamente**
5. **Veja a URL da requisição:**
   - ✅ Se aparecer a URL do Railway → Funcionou!
   - ❌ Se ainda aparecer `/undefined/producer` → Verificar se redeploy foi feito

---

## 🔍 VERIFICAÇÕES

### Verificar se Variável Está Configurada:

1. Vercel Dashboard > Projeto > Settings > Environment Variables
2. Procure por `NEXT_PUBLIC_API_URL`
3. Deve estar listada com o valor da URL do Railway

### Verificar se Redeploy Foi Feito:

1. Vercel Dashboard > Projeto > Deployments
2. O último deployment deve ser recente (após você adicionar a variável)
3. Se não for recente, fazer redeploy manual

### Verificar Valor da Variável:

1. Vercel Dashboard > Projeto > Settings > Environment Variables
2. Clique em `NEXT_PUBLIC_API_URL`
3. Verifique se o valor é a URL do Railway (não localhost!)

---

## 🐛 PROBLEMAS COMUNS

### Problema: "Adicionei mas ainda está undefined"

**Causa:** Redeploy não foi feito

**Solução:**
- Fazer redeploy manual ou commit + push
- Aguardar deploy terminar completamente
- Limpar cache do navegador (Ctrl+Shift+R)

### Problema: "Redeploy foi feito mas ainda não funciona"

**Causa:** Valor incorreto ou cache

**Solução:**
- Verificar se o valor da variável está correto (URL do Railway)
- Limpar cache do navegador
- Testar em aba anônima

### Problema: "Não sei qual é a URL do Railway"

**Solução:**
1. Railway Dashboard > Serviço Backend
2. Aba **"Settings"** ou **"Deployments"**
3. Procure por **"Public Domain"** ou **"URL"**
4. Copie a URL completa (ex: `https://brainagriculture-production-af57.up.railway.app`)

---

## 📋 CHECKLIST FINAL

- [ ] Variável `NEXT_PUBLIC_API_URL` adicionada no Vercel
- [ ] Valor é a URL do Railway (não localhost!)
- [ ] Environment selecionado: Production (e Preview)
- [ ] Redeploy feito (automático ou manual)
- [ ] Aguardado deploy terminar
- [ ] Testado novamente (Network tab mostra URL do Railway)

---

## 🎯 RESUMO RÁPIDO

1. **Vercel** > Settings > Environment Variables
2. **Adicionar:** `NEXT_PUBLIC_API_URL` = URL do Railway
3. **Redeploy** (commit + push OU redeploy manual)
4. **Aguardar** deploy terminar
5. **Testar** novamente

Depois disso, a URL deve aparecer correta na Network tab! 🎉

---

## ⚠️ LEMBRE-SE

- Variáveis `NEXT_PUBLIC_*` são **embutidas no build**
- Se adicionar depois do build, **precisa fazer redeploy**
- O valor deve ser a **URL do Railway**, não localhost
- Após redeploy, pode levar alguns segundos para propagar
