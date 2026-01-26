/**
 * Helper para detectar e tratar erros de autenticação (401)
 * Retorna true se a sessão expirou e o usuário foi redirecionado
 */
export const handleAuthError = (response: Response): boolean => {
  if (response.status === 401) {
    // Token expirado ou inválido
    localStorage.removeItem("token");
    
    // Dispara evento customizado para mostrar modal de sessão expirada
    window.dispatchEvent(new CustomEvent("session-expired"));
    
    return true;
  }
  return false;
};

/**
 * Wrapper para fetch que trata automaticamente erros 401
 */
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = localStorage.getItem("token");
  
  const headers = {
    ...options.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Se for 401, já trata e retorna a response para o código decidir o que fazer
  handleAuthError(response);

  return response;
};
