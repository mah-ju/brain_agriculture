import { API_URL } from "./apiConfig";
import { authenticatedFetch, handleAuthError } from "./authHelper";

export const getMe = async (id: number) => {
  const response = await authenticatedFetch(`${API_URL}/producer/${id}`);

  if (handleAuthError(response)) {
    throw new Error("Sessão expirada");
  }

  if (!response.ok) {
    throw new Error("Erro ao buscar dados do produtor");
  }

  return response.json();
};
