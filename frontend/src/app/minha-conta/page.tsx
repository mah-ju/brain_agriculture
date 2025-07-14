import { FarmForm } from "../components/FarmForm";
import { Leaf } from "lucide-react";

export default function ProfileProducer() {
  return (
    <div>
      <header className="w-full bg-white py-2 px-1.5 mb-10">
        <div className="lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-400 rounded-lg">
                <Leaf className="h-5 w-5 " />
              </div>
              <h1 className="text-xl font-bold">AgroManager</h1>
            </div>

            <div className="flex items-center gap-4 font-medium">
              <h1 className="px-10 text-lg">
                Francisco das Chagas Medeiros
              </h1>
              <button className="bg-green-400 py-1.5 px-4 hover:opacity-80 rounded transition-opacity">
               Sair
              </button>
            </div>
          </div>
        </div>
      </header>
      <FarmForm />
    </div>
  );
}
