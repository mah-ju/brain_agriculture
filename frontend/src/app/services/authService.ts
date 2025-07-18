export const login = async (cpfOrCnpj: string, password: string) => {


  const response = await fetch(`https://brainagriculture-production-af57.up.railway.app/auth/login`,{ 
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cpfOrCnpj, password }),
  });

  if (!response.ok) {
     const rawText = await response.text();
  console.error("Resposta bruta da API:", rawText);
   
    try {
      const errorData = JSON.parse(rawText);
     const message = 
      typeof errorData === "string"
      ? errorData
      : errorData.message || "Erro desconhecido no login"
      throw new Error(message)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch(error) {
   throw new Error("Erro ao fazer login");
    }
  }
 const data = await response.json();
  return data;
};
