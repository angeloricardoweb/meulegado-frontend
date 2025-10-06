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
    const vaultToken = localStorage.getItem("admin_token");

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
    if (error.response?.status === 403) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_data");
      localStorage.removeItem("admin_expires_at");

      if (typeof window !== "undefined") {
        window.location.href = `/login`;
      }
    }

    return Promise.reject(error);
  }
);

export default vaultApi;
