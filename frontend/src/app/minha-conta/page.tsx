"use client";
import { FarmForm } from "../components/FarmForm";
import { Leaf } from "lucide-react";
import { FarmCard } from "../components/FarmCard";
import { useEffect, useState } from "react";
import { getMe } from "../services/producerService";
import { Farm } from "../components/FarmCard";
import { useRouter } from "next/navigation";


function decodeToken(token: string): { sub: number } | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
  }
  return null;
}


export default function ProfileProducer() {
  const [producerName, setProducerName] = useState("");
  const [farms, setFarms] = useState<Farm[]>([]);
  const router = useRouter();
  useEffect(() => {
    const fetchProducer = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = decodeToken(token);
        if (!decoded) return;
        const { sub } = decoded;
        const data = await getMe(sub);
        setProducerName(data.name);
      } catch (err) {
        console.error("Erro ao buscar produtor", err);
      }
    };

    fetchProducer();
  }, []);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/farm`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setFarms(data);
      } catch (error) {
        console.error("Erro ao buscar fazendas", error);
      }
    };
    fetchFarms();
  }, []);

  const handleAddFarm = (newFarm: Farm) => {
    setFarms((prev) => [...prev, newFarm]);
  };


 const handleUpdateCardFarm = (updatedFarm: Farm) => {
     console.log("atualizando a farm no pai:", updatedFarm)
    setFarms((prev) =>
      prev.map((f) => (f.id === updatedFarm.id ? updatedFarm : f))
    );
  }; 
 
  const handleDeleteFarm = (id: number) => {
    setFarms((prev) => prev.filter((f) => f.id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };
  
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
              <h1 className="px-10 text-xs md:text-lg">{producerName}</h1>
              <button
                onClick={handleLogout}
                className="bg-green-400 py-1.5 px-4 hover:opacity-80 rounded transition-opacity"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>
      <FarmForm onSuccess={handleAddFarm} />
      {farms.map((farm) => (
        <FarmCard
          key={farm.id}
          farm={farm}
          onUpdate={handleUpdateCardFarm}
          onDelete={handleDeleteFarm}
        />
      ))}
    </div>
  );
}
