'use client';

import { useState } from 'react';
import { Heart, Mail, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import api from '@/lib/api';

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Limpar erro quando usuário começar a digitar
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/recuperar-senha', { email });
      
      console.log('Resposta da API de recuperação:', response.data);
      
      // Verificar se a resposta indica sucesso
      if (response.data.error === false || response.data.success) {
        setSuccess(true);
      } else {
        throw new Error('Erro ao enviar email de recuperação');
      }
    } catch (error: unknown) {
      console.error('Erro na recuperação de senha:', error);
      
      let errorMessage = 'Erro de conexão. Tente novamente.';
      
      // Verificar se é um erro de validação (não é um erro de axios)
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { 
          response?: { 
            data?: { 
              message?: string;
              error?: string;
              errors?: Record<string, string[]>;
            };
            status?: number;
          } 
        };
        
        // Verificar diferentes formatos de erro da API
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        } else if (axiosError.response?.data?.error) {
          errorMessage = axiosError.response.data.error;
        } else if (axiosError.response?.data?.errors) {
          // Tratar erros de validação
          const errors = axiosError.response.data.errors;
          const firstError = Object.values(errors)[0];
          errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
        }
        
        // Mensagens específicas por status
        if (axiosError.response?.status === 404) {
          errorMessage = 'Email não encontrado. Verifique o endereço.';
        } else if (axiosError.response?.status === 422) {
          errorMessage = 'Email inválido. Verifique o formato.';
        } else if (axiosError.response?.status === 429) {
          errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos.';
        } else if (axiosError.response?.status === 500) {
          errorMessage = 'Erro interno do servidor. Tente novamente.';
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    window.location.href = '/login';
  };

  const handleTryAgain = () => {
    setSuccess(false);
    setEmail('');
    setError('');
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Logo e Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">LegadoBox</h1>
            <p className="text-gray-600">Recuperação de Senha</p>
          </div>

          {/* Tela de Sucesso */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Enviado!</h2>
            
            <p className="text-gray-600 mb-6">
              Enviamos um link de recuperação para <strong>{email}</strong>. 
              Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={handleBackToLogin}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar ao Login</span>
              </button>
              
              <button
                onClick={handleTryAgain}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Tentar com outro email
              </button>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo e Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LegadoBox</h1>
          <p className="text-gray-600">Recuperar sua senha</p>
        </div>

        {/* Formulário de Recuperação */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Esqueceu sua senha?</h2>
            <p className="text-gray-600 text-sm">
              Digite seu email e enviaremos um link para redefinir sua senha.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleInputChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
                {process.env.NODE_ENV === 'development' && (
                  <details className="mt-2">
                    <summary className="text-xs text-red-500 cursor-pointer">Debug Info</summary>
                    <pre className="text-xs text-gray-600 mt-1 overflow-auto">
                      {JSON.stringify({ email, error }, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>
              
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Enviar Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Link para Login */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Lembrou da senha?{' '}
              <a
                href="/login"
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Faça login aqui
              </a>
            </p>
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
