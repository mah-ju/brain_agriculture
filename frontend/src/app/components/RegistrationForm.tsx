import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

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

const onSubmit = (data: RegisterFormData) => {
  console.log("Registration Data:", data);
  // Aqui você chama sua função de integração com backend
};
export const RegistrationForm = ({ onClose }: RegistrationProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

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
              {...register("cpfOrCnpj")}
              placeholder="000.000.000-00 ou 00.000.000/0000-00"
              className="mt-1 w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring focus:border-blue-300"
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

        <p className="text-sm text-center text-gray-600 mt-4">
          Já tem uma conta?{" "}
          <a
            href="/login"
            className="text-green-600 hover:underline font-medium"
          >
            Faça login
          </a>
        </p>
      </div>
    </div>
  );
};
