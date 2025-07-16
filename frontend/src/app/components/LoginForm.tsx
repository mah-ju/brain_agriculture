import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { login } from "../services/authService";
import { useRouter } from "next/navigation";
import { MaskedInput } from "react-hook-mask";

type LoginProps = {
  onClose: () => void;
};

const loginSchema = yup.object({
  cpfOrCnpj: yup.string().required("CPF ou CNPJ é obrigatório"),
  password: yup.string().required("Senha é obrigatória"),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

export const LoginForm = ({ onClose }: LoginProps) => {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
   try{


    const response = await fetch('http://localhost:3003/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if(!response.ok){
      const errorData = await response.json();
      alert(errorData.message || 'Erro no login');
      return;
    }
    const result = await login(data.cpfOrCnpj, data.password);
    localStorage.setItem("token", result.access_token);
    router.push('/minha-conta')
   } catch(error) {
    console.error('Erro ao fazer login: ', error)
    alert('Erro ao fazer login. Tente novamente.')
   }
  };
  return (
    <div className="w-full h-full flex items-center justify-center px-4 bg-black/95 fixed mb-7">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <button onClick={onClose} className="flex justify-self-end">
          <X />
        </button>
        <h1 className="text-2xl font-semibold text-center mb-4">Login</h1>
        <p className="text-gray-500 text-center mb-6">
          Acesse sua conta para gerenciar suas propriedades
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl transition"
          >
            Entrar
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Não tem uma conta?{" "}
          <button className="text-green-600 hover:underline font-medium">
            Cadastre-se
          </button>
        </p>
      </div>
    </div>
  );
};
