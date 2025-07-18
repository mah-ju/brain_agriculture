export const login = async (cpfOrCnpj: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append("cpfOrCnpj", cpfOrCnpj);
  formData.append("password", password);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    }
  );

  if (!response.ok) {
    const rawText = await response.text();
    console.error("Resposta bruta da API:", rawText);

    try {
      const errorData = JSON.parse(rawText);
      const message =
        typeof errorData === "string"
          ? errorData
          : errorData.message || "Erro desconhecido no login";
      throw new Error(message);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error("Erro ao fazer login");
    }
  }
  const data = await response.json();
  return data;
};
