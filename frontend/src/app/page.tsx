"use client";
import { RegistrationForm } from "./components/RegistrationForm";
import { LoginForm } from "./components/LoginForm";
import { Header } from "./components/Header";
import { ChartColumnIncreasing, Leaf, MapPin, Users } from "lucide-react";
import { Card } from "./components/Card";
import { useState } from "react";

export default function Home() {
  const [activeForm, setActiveForm] = useState<"login" | "register" | null>(
    null
  );

  const openLogin = () => setActiveForm("login");

  const openRegister = () => setActiveForm("register");

  const closeForm = () => setActiveForm(null);

  return (
    <div className="h-screen">
      <Header onLogin={openLogin} onRegister={openRegister} />
      {activeForm === "login" && <LoginForm onClose={closeForm} />}
      {activeForm === "register" && <RegistrationForm onClose={closeForm} />}

      <div>
        <div className="flex flex-col items-center pt-40">
          <div className="bg-green-400/50 p-4 rounded-full">
            <Leaf size={90} />
          </div>

          <h1 className="text-5xl lg:text-6xl xl:w-[45%] text-center mt-5">
            Gerencie suas propriedades rurais com facilidade
          </h1>
        </div>

        <div className="text-xl flex justify-center items-center mt-26 gap-5 xl:gap-10">
          <button
            onClick={openRegister}
            className="bg-green-400 py-1.5 xl:py-2 text-white px-5 hover:opacity-80 rounded transition-opacity"
          >
            Começar agora
          </button>
          <button
            onClick={openLogin}
            className="bg-white py-1.5 xl:py-2 px-5 hover:bg-green-400/60 hover:opacity-80 rounded transition-opacity"
          >
            Já tenho conta
          </button>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 lg:gap-5 lg:mx-4 lg:flex-row lg:items-center  mt-40 pb-10 ">
          <Card
            icon={MapPin}
            title="Gestão de Propriedades"
            text="Cadastre e organize todas as suas fazendas com informações de localização e áreas"
          />
          <Card
            icon={ChartColumnIncreasing}
            title="Controle de Safras"
            text="Acompanhe suas safras por período e tenha controle sobre o que foi plantado em cada época"
          />
          <Card
            icon={Users}
            title="Interface Simples"
            text="Plataforma intuitiva e fácil de usar, desenvolvida especialmente para o produtor rural"
          />
        </div>
      </div>
    </div>
  );
}
