import { useState, useEffect, useCallback } from 'react';
import { setCookie, getCookie, deleteCookie } from '@/lib/cookies';
import api from '@/lib/api';

interface Assinatura {
  possui: boolean;
  plano: string;
  status: string;
  vence_em: string;
  pagamentos_pendentes: unknown[];
}

interface User {
  id: number;
  name: string;
  email: string;
  cpf: string;
  data_nascimento: string;
  telefone: string;
  endereco: string;
  roles: string[];
  permissions: string[];
  assinatura: Assinatura;
  // Campos opcionais para compatibilidade
  plan?: string;
  luckyNumber?: string;
  subscriptionMonths?: number;
  totalMonths?: number;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Limpar cookie
    deleteCookie('token');
    
    setUser(null);
    window.location.href = '/login';
  }, []);

  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem('token') || getCookie('token');
    if (!token) return null;

    try {
      setIsRefreshing(true);
      const response = await api.get('/me');
      
      if (response.data.error === false && response.data.results?.user) {
        const userData = response.data.results.user;
        
        // Atualizar localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Atualizar estado
        setUser(userData);
        
        return userData;
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      // Se der erro 401, fazer logout
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          logout();
        }
      }
    } finally {
      setIsRefreshing(false);
    }
    
    return null;
  }, [logout]);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token') || getCookie('token');
      const userData = localStorage.getItem('user');

      if (token) {
        // Sincronizar cookie se não existir
        if (!getCookie('token')) {
          setCookie('token', token);
        }

        // Se tem dados no localStorage, usar temporariamente
        if (userData && userData !== 'undefined') {
          try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
          } catch (error) {
            console.error('Erro ao parsear dados do usuário:', error);
            localStorage.removeItem('user');
          }
        }

        // Buscar dados atualizados da API
        await fetchUserData();
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, [fetchUserData]);

  const login = (userData: User, token: string) => {
    // Salvar no localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Salvar no cookie para o middleware
    setCookie('token', token);
    
    setUser(userData);
  };

  const isAuthenticated = !!user;

  return {
    user,
    isLoading,
    isRefreshing,
    isAuthenticated,
    login,
    logout,
    fetchUserData,
  };
}