import { API_URL } from "./apiConfig";
export const getMe = async (id: number) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/producer/${id}`, { 
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar dados do produtor");
  }

  return response.json();
};
