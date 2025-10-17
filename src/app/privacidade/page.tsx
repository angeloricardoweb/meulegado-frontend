"use client";

import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Privacidade() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar para o PDF
    window.location.href = "/docs/politica_de_privacidade_legadobox.pdf";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 mb-6">
          Carregando Política de Privacidade...
        </p>
        <button
          onClick={() => router.back()}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>
      </div>
    </div>
  );
}
