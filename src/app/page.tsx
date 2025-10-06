"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  X,
  Check,
  Star,
  Crown,
} from "lucide-react";
import LuckyNumberModal from "@/components/LuckyNumberModal";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast, ToastContainer } from "@/components/Toast";
import api from "@/lib/api";

// Interfaces para dados da API
interface DashboardUser {
  id: number;
  name: string;
  email: string;
  current_plan: string;
  profile_complete: boolean;
}

interface DashboardStatistics {
  total_vaults: number;
  total_messages: number;
  total_recipients: number;
}

interface RecentActivity {
  type: string;
  description: string;
  date: string;
  date_formatted: string;
  icon: string;
  color: string;
}

interface LuckyNumber {
  number: string;
  subscription_months: number;
  months_remaining: number;
  progress_percentage: number;
  is_eligible: boolean;
  next_draw_date: string;
}

interface DashboardData {
  user: DashboardUser;
  statistics: DashboardStatistics;
  recent_activities: RecentActivity[];
  lucky_number: LuckyNumber;
}

// Dados mockados removidos - agora usando dados da API

export default function Dashboard() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const { addToast, toasts } = useToast();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLuckyModal, setShowLuckyModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [planos, setPlanos] = useState<any[]>([]);
  const [loadingPlanos, setLoadingPlanos] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const hasFetchedDashboard = useRef(false);

  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLuckyModalToggle = () => {
    setShowLuckyModal(!showLuckyModal);
  };

  const fetchDashboardData = useCallback(async () => {
    if (hasFetchedDashboard.current) return;

    try {
      hasFetchedDashboard.current = true;
      setLoadingDashboard(true);
      setDashboardError(null);
      const response = await api.get("/dashboard");

      if (response.data.error === false && response.data.results) {
        setDashboardData(response.data.results);
      } else {
        setDashboardError("Erro ao carregar dados do dashboard");
      }
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
      setDashboardError("Erro ao carregar dados do dashboard");
      addToast({
        type: "error",
        title: "Erro ao carregar dashboard",
        message: "Não foi possível carregar os dados do dashboard.",
      });
    } finally {
      setLoadingDashboard(false);
    }
  }, [addToast]);

  const fetchPlanos = async () => {
    try {
      setLoadingPlanos(true);
      const response = await api.get("/planos");

      if (response.data.error === false && response.data.results) {
        setPlanos(response.data.results);
      }
    } catch (error) {
      console.error("Erro ao buscar planos:", error);
      addToast({
        type: "error",
        title: "Erro ao carregar planos",
        message: "Não foi possível carregar os planos disponíveis.",
      });
    } finally {
      setLoadingPlanos(false);
    }
  };

  const handleUpgradePlan = (plano: any) => {
    window.open(plano.url_assinatura, "_blank");
    setShowUpgradeModal(false);
  };

  const handleOpenUpgradeModal = () => {
    if (planos.length === 0) {
      fetchPlanos();
    }
    setShowUpgradeModal(true);
  };

  const handleAction = (action: string) => {
    if (action === "dev") {
      addToast({
        type: "info",
        title: "Funcionalidade em desenvolvimento",
        message: "Esta funcionalidade estará disponível em breve!",
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
      router.push("/login");
    }
  }, [isLoading, user, router]);

  // Buscar dados do dashboard quando o usuário estiver autenticado
  useEffect(() => {
    if (user && !isLoading) {
      fetchDashboardData();
    }
  }, [user, isLoading, fetchDashboardData]);

  // Mostrar loading enquanto carrega dados do usuário e dashboard
  if (isLoading || loadingDashboard) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isLoading ? "Carregando..." : "Carregando dashboard..."}
          </p>
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

  // Se houver erro ao carregar dashboard, mostrar erro
  if (dashboardError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Erro ao carregar dashboard
          </h2>
          <p className="text-gray-600 mb-6">{dashboardError}</p>
          <button
            onClick={() => {
              hasFetchedDashboard.current = false;
              fetchDashboardData();
            }}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Tentar Novamente
          </button>
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
                  Olá, {dashboardData?.user.name || user?.name || "Usuário"}!
                  Bem-vindo de volta
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
                  <p className="font-medium">
                    {dashboardData?.user.name || user?.name || "Usuário"}
                  </p>
                  <p className="text-sm text-white/60">
                    Plano{" "}
                    {dashboardData?.user.current_plan ||
                      user?.assinatura?.plano ||
                      user?.plan ||
                      "Premium"}
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
            <div
              className={`rounded-2xl p-6 mb-8 border ${
                user.assinatura.possui && user.assinatura.status === "ativa"
                  ? "bg-gradient-to-r from-green-50 to-blue-50 border-green-200"
                  : "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      user.assinatura.possui &&
                      user.assinatura.status === "ativa"
                        ? "bg-green-100"
                        : "bg-amber-100"
                    }`}
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        user.assinatura.possui &&
                        user.assinatura.status === "ativa"
                          ? "text-green-600"
                          : "text-amber-600"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {user.assinatura.possui &&
                      user.assinatura.status === "ativa"
                        ? "Assinatura Ativa"
                        : "Sem Assinatura Ativa"}
                    </h3>
                    <p className="text-gray-600">
                      {user.assinatura.possui &&
                      user.assinatura.status === "ativa" ? (
                        <>
                          Plano {user.assinatura.plano} • Vence em{" "}
                          {new Date(
                            user.assinatura.vence_em
                          ).toLocaleDateString("pt-BR")}
                        </>
                      ) : (
                        "Escolha um plano para desbloquear todos os recursos"
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {user.assinatura.possui &&
                  user.assinatura.status === "ativa" ? (
                    <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Ativa
                    </div>
                  ) : (
                    <button
                      onClick={handleOpenUpgradeModal}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                    >
                      Ver Planos
                    </button>
                  )}
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
                  {dashboardData?.statistics.total_vaults || 0}
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
                  {dashboardData?.statistics.total_messages || 0}
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
                  {dashboardData?.statistics.total_recipients || 0}
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
                  #
                  {dashboardData?.lucky_number.number ||
                    user?.id?.toString().padStart(4, "0") ||
                    "0000"}
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
                {dashboardData?.recent_activities.map((activity, index) => {
                  // Mapear ícones da API para componentes
                  const getIconComponent = (iconName: string) => {
                    switch (iconName) {
                      case "message-circle":
                        return MessageCircle;
                      case "plus":
                        return Plus;
                      case "user-plus":
                        return UserPlus;
                      default:
                        return MessageCircle;
                    }
                  };

                  const IconComponent = getIconComponent(activity.icon);

                  return (
                    <div
                      key={index}
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
                          {activity.description}
                        </p>
                        <p className="text-gray-500 text-sm">{activity.date}</p>
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
        luckyNumber={parseInt(
          dashboardData?.lucky_number.number ||
            user?.id?.toString().padStart(4, "0") ||
            "0000"
        )}
        subscriptionStatus={
          user?.assinatura?.status === "ativa" ? "active" : "inactive"
        }
        nextDrawDate={
          dashboardData?.lucky_number.next_draw_date
            ? new Date(
                dashboardData.lucky_number.next_draw_date
              ).toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "4 de janeiro de 2025"
        }
      />

      {/* Upgrade Plans Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">
                  🚀 Escolha seu Plano
                </h3>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {loadingPlanos ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Carregando planos...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {planos.map((plano) => (
                    <div
                      key={plano.id}
                      onClick={() => handleUpgradePlan(plano)}
                      className={`border-2 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 ${
                        plano.mais_popular
                          ? "border-green-400 bg-gradient-to-r from-green-50 to-emerald-50 ring-2 ring-green-200"
                          : "border-gray-300 bg-white hover:border-indigo-400"
                      }`}
                      style={{
                        borderColor: plano.mais_popular ? undefined : plano.cor,
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${plano.cor}20` }}
                          >
                            {plano.mais_popular ? (
                              <Star
                                className="w-5 h-5"
                                style={{ color: plano.cor }}
                              />
                            ) : (
                              <Crown
                                className="w-5 h-5"
                                style={{ color: plano.cor }}
                              />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="text-xl font-bold text-gray-900">
                                {plano.titulo}
                              </h4>
                              {plano.mais_popular && (
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                                  Mais Popular
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600">
                              {plano.destinatarios === 999
                                ? "Destinatários ilimitados"
                                : `Até ${plano.destinatarios} destinatários`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            R$ {plano.preco.toFixed(2).replace(".", ",")}
                          </p>
                          <p className="text-sm text-gray-500">/mês</p>
                        </div>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-center space-x-2">
                          <Check
                            className="w-4 h-4"
                            style={{ color: plano.cor }}
                          />
                          <span>
                            {plano.destinatarios === 999
                              ? "Destinatários ilimitados"
                              : `Até ${plano.destinatarios} destinatários`}
                          </span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check
                            className="w-4 h-4"
                            style={{ color: plano.cor }}
                          />
                          <span>Cofres ilimitados</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check
                            className="w-4 h-4"
                            style={{ color: plano.cor }}
                          />
                          <span>Suporte prioritário</span>
                        </li>
                        {plano.id === 3 && (
                          <li className="flex items-center space-x-2">
                            <Check
                              className="w-4 h-4"
                              style={{ color: plano.cor }}
                            />
                            <span>Recursos exclusivos</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}
