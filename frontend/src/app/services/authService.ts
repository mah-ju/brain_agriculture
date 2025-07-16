export const login = async (cpfOrCnpj: string, password: string) => {
  const response = await fetch("http://localhost:3003/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cpfOrCnpj, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao fazer login");
  }

  const data = await response.json();
  return data; 
};
