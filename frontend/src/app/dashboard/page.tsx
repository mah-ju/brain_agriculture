"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Leaf } from "lucide-react";

type DashboardData = {
  totalFarms: number;
  totalArea: number;
  byState: { state: string; count: number }[];
  byCrop: { name: string; count: number }[];
  bySoilUse?: { arableArea: number; vegetationArea: number };
};

const COLORS = ["#4CAF50", "#2196F3", "#FF9800", "#9C27B0", "#F44336"];

export default function AdminDashboard() {
  console.log("Renderizando AdminDashboard");
  const [data, setData] = useState<DashboardData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/");
      return
    }
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3003/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            alert("Acesso não autorizado. Faça login como admin.");
            router.push("/");
          } else {
            const errorText = await res.text();
            console.error("Erro no dashboard:", errorText);
            alert("Erro ao carregar dados do dashboard.");
          }
          return;
        }

        const result = await res.json();

        if (
          result.totalFarms === undefined ||
          result.totalArea === undefined ||
          !Array.isArray(result.byState) ||
          !Array.isArray(result.byCrop) ||
          !result.bySoilUse
        ) {
          throw new Error("Dados inesperados do servidor.");
        }

        setData(result);
      } catch (err) {
        console.error("Erro ao buscar dashboard:", err);
      }
    };

    fetchData();
  }, [router]);

  if (!data) return <p className="text-center mt-10">Carregando...</p>;

  const soilUseData = data.bySoilUse
    ? [
        { name: "Área agricultável", value: data.bySoilUse.arableArea },
        { name: "Vegetação", value: data.bySoilUse.vegetationArea },
      ]
    : [];

  const stateData =
    data.byState?.map((s) => ({ name: s.state, value: s.count })) ?? [];
  const cropData =
    data.byCrop?.map((c) => ({ name: c.name, value: c.count })) ?? [];

    const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"
  };
  return (
    <div className="">
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
              <h1 className="px-10 text-xs md:text-lg">
                Dashboard do Administrador
              </h1>
              <button  onClick={handleLogout} className="bg-green-400 py-1.5 px-6 hover:opacity-80 rounded transition-opacity">
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="mx-4 grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold text-gray-600">
            Total de Fazendas
          </h2>
          <p className="text-3xl font-bold text-green-600">{data.totalFarms}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold text-gray-600">
            Total de Hectares
          </h2>
          <p className="text-3xl font-bold text-green-700">
            {(data.totalArea ?? 0).toLocaleString("pt-BR")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 place-items-center md:grid-cols-3 gap-8 md:gap-0">
        <div className="bg-white w-lg rounded-2xl p-6">
          <h3 className="text-center text-lg font-semibold mb-2">Por Estado</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stateData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {stateData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white w-lg rounded-2xl p-6">
          <h3 className="text-center text-lg font-semibold mb-2">
            Por Cultura Plantada
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={cropData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                fill="#82ca9d"
                label
              >
                {cropData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white w-lg rounded-2xl p-6">
          <h3 className="text-center text-lg font-semibold mb-2">
            Uso do Solo
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={soilUseData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                fill="#ffc658"
                label
              >
                {soilUseData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
