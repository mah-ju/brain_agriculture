export const getMe = async (id: number) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`https://brainagriculture-production-af57.up.railway.app/producer/${id}`, { 
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar dados do produtor");
  }

  return response.json();
};
