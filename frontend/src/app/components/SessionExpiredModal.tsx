"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export const SessionExpiredModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleSessionExpired = () => {
      setIsOpen(true);
    };

    window.addEventListener("session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("session-expired", handleSessionExpired);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    router.push("/");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Sessão Expirada
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">
          Sua sessão expirou por inatividade. Por favor, faça login novamente
          para continuar usando o sistema.
        </p>

        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-xl transition-colors"
          >
            Fazer Login
          </button>
        </div>
      </div>
    </div>
  );
};
