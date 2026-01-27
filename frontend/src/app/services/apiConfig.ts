"use client";
// API_URL com fallback para desenvolvimento local
export const API_URL = 
  process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' ? 'http://localhost:3003' : '');

// Validação para produção (apenas no cliente)
if (typeof window !== 'undefined') {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (!process.env.NEXT_PUBLIC_API_URL && !isLocalhost) {
    console.error('⚠️ NEXT_PUBLIC_API_URL não está configurada! Configure no Vercel.');
    console.error('⚠️ API_URL atual:', API_URL || '(undefined)');
  }
}