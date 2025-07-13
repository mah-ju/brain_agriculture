"use client";
import { RegistrationForm } from "./components/RegistrationForm";
import { LoginForm } from "./components/LoginForm";
import { Header } from "./components/Header";
import { ChartColumnIncreasing, Leaf, MapPin, Users } from "lucide-react";
import { Card } from "./components/Card";
import { useState } from "react";

export default function Home() {
  const [loginForm, setLoginForm] = useState(false);
  const [registerForm, setRegisterForm] = useState(false);

  const handleLoginForm = () => {
    setLoginForm(true);
  };

  const handleRegisterForm = () => {
    setRegisterForm(true);
  };

  return (
    <div className="h-screen">
      <Header onLogin={handleLoginForm} onRegister={handleRegisterForm} />
      {loginForm && <LoginForm />}
      {registerForm && <RegistrationForm />}

      <div>
        <div className="flex flex-col items-center pt-26">
          <div className="bg-green-400/50 p-4 rounded-full">
            <Leaf size={90} />
          </div>

          <h1 className="text-5xl lg:text-6xl xl:w-[45%] text-center ">
            Gerencie suas propriedades rurais com facilidade
          </h1>
        </div>

        <div className="text-xl flex justify-center items-center mt-20 gap-5 xl:gap-10">
          <button
            onClick={handleRegisterForm}
            className="bg-green-400 py-1.5 xl:py-2 text-white px-5 hover:opacity-80 rounded transition-opacity"
          >
            Começar agora
          </button>
          <button
            onClick={handleLoginForm}
            className="bg-white py-1.5 xl:py-2 px-5 hover:bg-green-400/60 hover:opacity-80 rounded transition-opacity"
          >
            Já tenho conta
          </button>
        </div>
        <div className=" grid grid-cols-1 md:grid-cols-3 md:mx-2.5 place-items-center gap-5 mt-50 pb-10 ">
          <Card
            icon={MapPin}
            title="Gestão de Propriedades"
            text="Cadastre e organize todas as suas fazendas com informações de localização e áreas"
          />
          <Card
            icon={ChartColumnIncreasing}
            title="Controle de Safras"
            text="Acompanhe suas safras por período e tenha controle total sobre o que foi plantado em cada época"
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
