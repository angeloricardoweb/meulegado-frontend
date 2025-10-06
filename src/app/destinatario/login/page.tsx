"use client";

import { useState, Suspense } from "react";
import { Heart, Eye, EyeOff, Lock, ArrowRight } from "lucide-react";
import api from "@/lib/api";
import { useSearchParams } from "next/navigation";

function LoginDestinatarioPage() {
  const searchParams = useSearchParams();
  const vaultId = searchParams.get("vaultId") || "";
  const redirect = searchParams.get("redirect") || "";

  const [formData, setFormData] = useState({
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpar erro quando usuário começar a digitar
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post(
        `/vaults/${vaultId}/verify-password`,
        formData
      );

      console.log("Resposta da API:", response.data);

      // Acessar dados dentro de 'results'
      const results = response.data.results;

      // Verificar se a resposta tem os dados necessários
      if (!results || !results.access_token) {
        throw new Error("Token de acesso não encontrado na resposta");
      }

      // Salvar token e dados do cofre no localStorage
      localStorage.setItem("vault_token", results.access_token);
      localStorage.setItem(
        "vault_data",
        JSON.stringify(results.vault_basic_info)
      );
      localStorage.setItem("vault_expires_at", results.expires_at);

      console.log("Token do cofre salvo:", results.access_token);
      console.log("Dados do cofre salvos:", results.vault_basic_info);

      console.log("Token do cofre salvo:", results.access_token);
      console.log("Dados do cofre salvos:", results.vault_basic_info);

      // Redirecionar para a página do cofre destinatário
      window.location.href = redirect;
    } catch (error: any) {
      console.error("Erro no login do destinatário:", error);
      setError(
        error.response?.data?.messages?.[0] ||
          "Erro ao verificar senha. Verifique se a senha está correta."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo e Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LegadoBox</h1>
          <p className="text-gray-600">Acesso ao Cofre Digital</p>
          <p className="text-sm text-gray-500 mt-2">
            Digite a senha para acessar o cofre
          </p>
        </div>

        {/* Formulário de Login */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Senha */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Senha do Cofre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  placeholder="Digite a senha do cofre"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
                {process.env.NODE_ENV === "development" && (
                  <details className="mt-2">
                    <summary className="text-xs text-red-500 cursor-pointer">
                      Debug Info
                    </summary>
                    <pre className="text-xs text-gray-600 mt-1 overflow-auto">
                      {JSON.stringify({ formData, error, vaultId }, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Acessar Cofre</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Informações adicionais */}
          <div className="mt-6 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>ID do Cofre:</strong> {vaultId}
              </p>
              <p className="text-blue-600 text-xs mt-1">
                Este token expira em 30 minutos
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            © 2024 LegadoBox. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginDestinatarioPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      }
    >
      <LoginDestinatarioPage />
    </Suspense>
  );
}
