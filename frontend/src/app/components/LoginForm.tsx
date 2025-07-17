import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { login } from "../services/authService";
import { useRouter } from "next/navigation";
import { cpf, cnpj } from "cpf-cnpj-validator";

cpf.format("12345678901");
cnpj.format("12345678000199");

type LoginProps = {
  onClose: () => void;
};

const loginSchema = yup.object({
  cpfOrCnpj: yup.string().required("CPF ou CNPJ é obrigatório"),
  password: yup.string().required("Senha é obrigatória"),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

export const LoginForm = ({ onClose }: LoginProps) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await login(data.cpfOrCnpj, data.password);
      localStorage.setItem("token", result.access_token);
    try {
      const payload = JSON.parse(atob(result.access_token.split(".")[1]));
      if (payload.role === "ADMIN") {
        router.push("/dashboard");
      } else {
        router.push("/minha-conta");
      }
    } catch (error) {
      console.error("Erro ao fazer login: ", error);
      alert(
        error instanceof Error
          ? error.message
          : "Erro ao fazer login. Tente novamente."
      );
    }
  };

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

  const { onChange, ...rest } = register("cpfOrCnpj");

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
              value={watch("cpfOrCnpj") || ""}
              onChange={(e) => {
                handleCpfCnpjChange(e);
                onChange(e);
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

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};
