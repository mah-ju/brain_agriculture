import { X } from "lucide-react"
export const RegistrationForm = () => {
    return(
      <div className="min-h-screen flex items-center justify-center px-4 bg-black/95 fixed h-full w-full">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
          <div className="flex justify-end cursor-pointer">
            <X />
          </div>
       
        <h1 className="text-2xl font-semibold text-center mb-4">Cadastre-se</h1>
       
        <p className="text-gray-500 text-center mb-6">
          Crie sua conta para gerenciar suas propriedades rurais
        </p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome Completo
            </label>
            <input
              type="text"
              placeholder="Digite seu nome completo"
              className="mt-1 w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              CPF ou CNPJ
            </label>
            <input
              type="text"
              placeholder="000.000.000-00 ou 00.000.000/0000-00"
              className="mt-1 w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              type="password"
              placeholder="Digite sua senha"
              className="mt-1 w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirmar Senha
            </label>
            <input
              type="password"
              placeholder="Confirme sua senha"
              className="mt-1 w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl transition"
          >
            Criar Conta
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Já tem uma conta?{' '}
          <a href="/login" className="text-green-600 hover:underline font-medium">
            Faça login
          </a>
        </p> 
      </div>
    </div>
    )
}