# 🔍 Como Verificar se API_URL Está Configurada

## ❌ Por que `process.env` não funciona no console?

`process.env` não está disponível no console do navegador porque:
- Variáveis `NEXT_PUBLIC_*` são **embutidas no código** durante o build
- Elas não ficam disponíveis no runtime do navegador
- Isso é normal e esperado

---

## ✅ FORMAS CORRETAS DE VERIFICAR

### Método 1: Verificar no Código (Melhor)

Adicionei um log automático no código. Agora:

1. **Abra o app no Vercel**
2. **Abra DevTools > Console**
3. **Tente fazer um cadastro**
4. **Procure por:**
   - `⚠️ NEXT_PUBLIC_API_URL não está configurada!` (se não estiver)
   - `⚠️ API_URL atual: [URL]` (mostra a URL atual)

### Método 2: Verificar na Requisição (Network Tab)

1. **DevTools > Network**
2. **Tente fazer cadastro**
3. **Clique na requisição para `/producer`**
4. **Veja a URL completa:**
   - Se aparecer `/undefined/producer` → variável não está configurada ❌
   - Se aparecer URL do Railway → variável está OK ✅

### Método 3: Verificar no Código Fonte

1. **DevTools > Sources** (ou Network)
2. **Procure por arquivos `.js`**
3. **Procure por `apiConfig` ou `API_URL`**
4. **Veja o valor embutido no código**

### Método 4: Teste Direto

No console, execute:
```javascript
// Isso vai mostrar a URL que está sendo usada
fetch('/api/test').catch(() => {
  console.log('Testando...');
});

// Ou melhor, veja a requisição real:
// Abra Network tab e veja a URL da requisição para /producer
```

---

## 🎯 DIAGNÓSTICO RÁPIDO

### Se a URL estiver como `/undefined/producer`:

**Problema:** `NEXT_PUBLIC_API_URL` não está configurada ou não foi feito redeploy

**Solução:**
1. Vercel > Settings > Environment Variables
2. Adicionar `NEXT_PUBLIC_API_URL` = URL do Railway
3. **Fazer redeploy** (commit + push ou redeploy manual)

### Se a URL estiver correta mas ainda der erro:

**Problema:** Outro (CORS, backend offline, etc)

**Próximos passos:**
- Verificar logs do Railway
- Verificar erro específico no console
- Testar backend diretamente

---

## 📋 CHECKLIST

- [ ] Verificar erro no console (deve mostrar aviso se API_URL estiver undefined)
- [ ] Verificar Network tab (URL da requisição)
- [ ] Se URL estiver `/undefined/producer` → adicionar variável no Vercel
- [ ] Fazer redeploy após adicionar variável
- [ ] Testar novamente

---

## 🚨 O QUE FAZER AGORA

1. **Abra o app no Vercel**
2. **DevTools > Console**
3. **Tente fazer cadastro**
4. **Me diga:**
   - O que aparece no console? (erros ou avisos)
   - Na Network tab, qual a URL da requisição? (é `/undefined/producer` ou tem a URL do Railway?)

Com essas informações, consigo identificar o problema exato! 🔍
