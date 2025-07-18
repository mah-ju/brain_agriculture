import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { cpf, cnpj } from "cpf-cnpj-validator";

type RegistrationProps = {
  onClose: () => void;
};

const registerSchema = yup.object({
  name: yup.string().required("Nome completo é obrigatório"),
  cpfOrCnpj: yup.string().required("CPF ou CNPJ é obrigatório"),
  password: yup
    .string()
    .required("Senha é obrigatória")
    .min(6, "Mínimo de 6 caracteres"),
  confirmPassword: yup
    .string()
    .required("Confirmação é obrigatória")
    .oneOf([yup.ref("password")], "As senhas não coincidem"),
});

type RegisterFormData = yup.InferType<typeof registerSchema>;


export const RegistrationForm = ({ onClose }: RegistrationProps) => {
  const router = useRouter();

const onSubmit = async (data: RegisterFormData) => {
 try {
  const response = await fetch(`https://brainagriculture-production-af57.up.railway.app/producer`, { 
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: data.name,
      cpfOrCnpj: data.cpfOrCnpj,
      password: data.password,
    }),
  });

 if (!response.ok) {
  const errorData = await response.json();

  console.error("Erro no registro:", errorData);

  const errorMessage =
    typeof errorData.message === "string"
      ? errorData.message
      : JSON.stringify(errorData.message || errorData);

  alert(errorMessage || "Erro ao registrar.");
  return;
}
 
  const loginResponse = await fetch( `https://brainagriculture-production-af57.up.railway.app/auth/login`, { 
    method:'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cpfOrCnpj: data.cpfOrCnpj,
      password: data.password,
    }),
  });

  if(!loginResponse.ok) {
    alert('Cadastro feito, mas houve erro ao fazer o login.');
    return;
  }

  const result = await loginResponse.json();
  localStorage.setItem('token', result.access_token);

  router.push('/minha-conta')
 } catch(error) {
  console.error('Erro ao registrar:', error);
  alert('Erro ao registrar. Tente Novamente')
 }
};
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const { onChange, ...rest} = register("cpfOrCnpj");

  const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const rawValue = e.target.value.replace(/\D/g, ""); 
  let formatted = rawValue;
  if (rawValue.length <= 11) {
    formatted = cpf.format(rawValue);
  } else {
    formatted = cnpj.format(rawValue);
  }

  setValue("cpfOrCnpj", formatted);
};
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black/95 fixed h-full w-full">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <button onClick={onClose} className="flex justify-self-end">
          <X />
        </button>

        <h1 className="text-2xl font-semibold text-center mb-4">Cadastre-se</h1>

        <p className="text-gray-500 text-center mb-6">
          Crie sua conta para gerenciar suas propriedades rurais
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome Completo
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="Digite seu nome completo"
              className="mt-1 w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              CPF ou CNPJ
            </label>
            <input
              type="text"
              value={watch("cpfOrCnpj") || ""}
              onChange={(e) => {
                handleCpfCnpjChange(e);
                onChange(e)
              }}
              placeholder="000.000.000-00 ou 00.000.000/0000-00"
              className="mt-1 w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              {...rest}
            />
            {errors.cpfOrCnpj && (
              <p className="text-sm text-red-500 mt-1">
                {errors.cpfOrCnpj.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              type="password"
              {...register("password")}
              placeholder="Digite sua senha"
              className="mt-1 w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirmar Senha
            </label>
            <input
              type="password"
              {...register("confirmPassword")}
              placeholder="Confirme sua senha"
              className="mt-1 w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button 
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl transition"
          >
            Criar Conta
          </button>
        </form>
      </div>
    </div>
  );
};
