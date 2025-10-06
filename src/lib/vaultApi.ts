import axios from "axios";

// Configuração base da API para destinatários
const vaultApi = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://meulegado.ilvinipitter.com.br/api",
  timeout: 30000,
});

// Interceptor para adicionar o vault_token nas requisições
vaultApi.interceptors.request.use(
  (config) => {
    // Buscar o vault_token do localStorage
    const vaultToken = localStorage.getItem("vault_token");

    if (vaultToken) {
      // Adicionar o token no header Authorization
      config.headers.Authorization = `Bearer ${vaultToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas
vaultApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Se o token expirou ou é inválido, limpar o localStorage
    if (error.response?.status === 401) {
      localStorage.removeItem("vault_token");
      localStorage.removeItem("vault_data");
      localStorage.removeItem("vault_expires_at");

      // Redirecionar para a página de login do destinatário
      if (typeof window !== "undefined") {
        const currentVaultId = new URLSearchParams(window.location.search).get(
          "vaultId"
        );
        window.location.href = `/login-destinatario?vaultId=${
          currentVaultId || ""
        }`;
      }
    }

    return Promise.reject(error);
  }
);

export default vaultApi;
