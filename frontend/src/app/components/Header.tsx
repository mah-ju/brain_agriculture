import { Leaf } from "lucide-react";
type Props = {
  onLogin: () => void;
  onRegister: () => void;

};

export const Header = ({ onLogin, onRegister }: Props) => {
  return (
    <header className="w-full bg-white py-2 px-1.5 fixed">
      <div className=" lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-400 rounded-lg">
              <Leaf className="h-5 w-5 " />
            </div>
            <h1 className="text-xl font-bold">AgroManager</h1>
          </div>

          <div className="flex items-center gap-4 font-medium">
            <button
              onClick={onLogin}
              className="py-1.5 px-6 rounded hover:bg-green-400/60 hover:opacity-80 transition-opacity"
            >
              Entrar
            </button>
            <button
              onClick={onRegister}
              className="bg-green-400 py-1.5 px-4 hover:opacity-80 rounded transition-opacity"
            >
              Cadastrar
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
