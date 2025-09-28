"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  Archive,
  MessageCircle,
  Users,
  Gift,
  Plus,
  MoreVertical,
  User,
  LogOut,
  UserPlus,
} from "lucide-react";
import LuckyNumberModal from "@/components/LuckyNumberModal";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast, ToastContainer } from "@/components/Toast";

// Dados mockados
const mockData = {
  user: {
    name: "João Silva",
    plan: "Premium",
    luckyNumber: "#7842",
    subscriptionMonths: 4,
    totalMonths: 12,
  },
  stats: {
    totalVaults: 3,
    totalMessages: 12,
    totalRecipients: 5,
  },
  recentActivity: [
    {
      id: 1,
      type: "vault_created",
      message: "Cofre criado para Maria Silva",
      time: "Há 2 dias",
      icon: Plus,
      color: "blue",
    },
    {
      id: 2,
      type: "message_added",
      message: "Mensagem adicionada ao cofre de João",
      time: "Há 5 dias",
      icon: MessageCircle,
      color: "green",
    },
    {
      id: 3,
      type: "recipient_added",
      message: "Novo destinatário cadastrado: Ana Santos",
      time: "Há 1 semana",
      icon: UserPlus,
      color: "purple",
    },
  ],
};

export default function Dashboard() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const { addToast, toasts } = useToast();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLuckyModal, setShowLuckyModal] = useState(false);


  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLuckyModalToggle = () => {
    setShowLuckyModal(!showLuckyModal);
  };


  const handleAction = (action: string) => {
    if (action === "dev") {
      addToast({
        type: 'info',
        title: 'Funcionalidade em desenvolvimento',
        message: 'Esta funcionalidade estará disponível em breve!'
      });
      return;
    }
    return router.push(action);
  };

  const handleLogout = () => {
    logout();
  };

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  // Mostrar loading enquanto carrega dados do usuário
  if (isLoading) {
  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, mostrar loading (redirecionamento em andamento)
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Incomplete Data Warning */}
      {/* {showIncompleteWarning && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 animate-slide-down">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Info className="w-5 h-5 text-amber-600" />
              <div>
                <p className="text-amber-800 font-medium">
                  Complete seus dados pessoais
                </p>
                <p className="text-amber-700 text-sm">
                  Alguns dados da sua conta estão incompletos. Complete para uma
                  melhor experiência.
          </p>
        </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleAction("complete-data")}
                className="text-amber-600 hover:text-amber-800 font-medium text-sm"
              >
                Completar agora
              </button>
              <button
                onClick={handleCloseWarning}
                className="text-amber-400 hover:text-amber-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
                    </div>
                  )} */}

      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Heart className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">LegadoBox</h1>
                <p className="text-white/80">
                  Olá, {user?.name || 'Usuário'}! Bem-vindo de volta
                </p>
                  </div>
        </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={handleUserMenuToggle}
                className="flex items-center space-x-3 text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="text-right">
                  <p className="font-medium">{user?.name || 'Usuário'}</p>
                  <p className="text-sm text-white/60">
                    Plano {user?.assinatura?.plano || user?.plan || 'Premium'}
                  </p>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MoreVertical className="w-5 h-5" />
                </div>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <button
                    onClick={() => handleAction("/perfil")}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                  >
                    <User className="w-4 h-4" />
                    <span>Meu Perfil</span>
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center space-x-3"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </button>
                </div>
              )}
            </div>
          </div>
              </div>
      </header>

      {/* Main Content */}
      <main className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Subscription Status Card */}
          {user?.assinatura && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-8 border border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Assinatura {user.assinatura.status === 'ativa' ? 'Ativa' : 'Inativa'}
                    </h3>
                    <p className="text-gray-600">
                      Plano {user.assinatura.plano} • Vence em {new Date(user.assinatura.vence_em).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.assinatura.status === 'ativa' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.assinatura.status === 'ativa' ? 'Ativa' : 'Inativa'}
                  </div>
                </div>
              </div>
                    </div>
                  )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Cofres */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Archive className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  {mockData.stats.totalVaults}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Total de Cofres Digitais
              </h3>
              <p className="text-gray-500 text-sm">Cofres criados e ativos</p>
              </div>
              
            {/* Total Mensagens */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  {mockData.stats.totalMessages}
                </span>
                  </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Total de Mensagens
              </h3>
              <p className="text-gray-500 text-sm">Mensagens criadas</p>
              </div>

            {/* Total Destinatários */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  {mockData.stats.totalRecipients}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Total de Destinatários
              </h3>
              <p className="text-gray-500 text-sm">Pessoas cadastradas</p>
              </div>

            {/* Número da Sorte */}
            <div
              onClick={handleLuckyModalToggle}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Gift className="w-6 h-6 text-amber-600" />
                </div>
                <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold text-xl px-3 py-1 rounded-lg animate-pulse">
                  {user?.luckyNumber || `#${user?.id?.toString().padStart(4, '0') || '0000'}`}
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Seu Número da Sorte
              </h3>
              <p className="text-gray-500 text-sm">Clique para ver as regras</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Criar Cofre */}
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Criar Novo Cofre
              </h3>
              <p className="text-gray-600 mb-4">
                Crie um cofre digital especial para alguém que você ama
              </p>
              <button
                onClick={() => handleAction("/criar-cofre")}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                Começar Agora
              </button>
            </div>

            {/* Gerenciar Destinatários */}
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-white" />
                </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Gerenciar Destinatários
              </h3>
              <p className="text-gray-600 mb-4">
                Adicione ou edite as pessoas que receberão seus legados
              </p>
              <button
                onClick={() => handleAction("/destinatarios")}
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                Gerenciar
              </button>
        </div>

            {/* Meus Cofres */}
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-4">
                <Archive className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Meus Cofres
              </h3>
              <p className="text-gray-600 mb-4">
                Visualize e edite todos os seus cofres digitais criados
              </p>
              <button
                onClick={() => handleAction("/cofres")}
                className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition-colors font-medium"
              >
                Ver Cofres
              </button>
              </div>
              </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">
                Atividade Recente
              </h3>
              </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockData.recentActivity.map((activity) => {
                  const IconComponent = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div
                        className={`w-10 h-10 bg-${activity.color}-100 rounded-full flex items-center justify-center`}
                      >
                        <IconComponent
                          className={`w-5 h-5 text-${activity.color}-600`}
                        />
              </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {activity.message}
                        </p>
                        <p className="text-gray-500 text-sm">{activity.time}</p>
              </div>
              </div>
                  );
                })}
              </div>
            </div>
      </div>
      </div>
      </main>

      {/* Lucky Number Modal */}
      <LuckyNumberModal
        isOpen={showLuckyModal}
        onClose={handleLuckyModalToggle}
        luckyNumber={parseInt((user?.luckyNumber || `#${user?.id?.toString().padStart(4, '0') || '0000'}`).replace("#", ""))}
        subscriptionStatus={
          user?.assinatura?.status === 'ativa' ? "active" : "inactive"
        }
        nextDrawDate="4 de janeiro de 2025"
      />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}
