"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import {
  ShieldCheck,
  LogOut,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Heart,
  Package,
  CheckSquare,
  Search,
  RefreshCw,
  User,
  X,
} from "lucide-react";
import api from "@/lib/adminApi";
import { useToast, ToastContainer } from "@/components/Toast";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { useRouter, useSearchParams } from "next/navigation";

// Tipagens básicas da API de administração
interface AdminStatistics {
  total_users: number;
  active_users: number;
  overdue_users: number;
  cancelled_users: number;
  deceased_users: number;
  vaults_to_deliver: number;
  vaults_delivered: number;
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  birth_date: string;
  created_at: string;
  status: string; // 'active' | 'inactive' | etc
  status_label: string;
  plan: string; // ex: 'Sem plano', 'Memória'
  plan_expires_at: string | null;
  lucky_number: string | null;
  lottery_enabled: boolean;
  vaults_count: number;
  recipients_count: number;
  last_payment: string | null;
  pending_payments_count: number;
}

interface AdminUserDetailsResponse {
  user: {
    id: number;
    name: string;
    email: string;
    cpf: string;
    phone: string;
    birth_date: string;
    address?: string;
    created_at: string;
    status: string;
    status_label: string;
    plan: string;
    plan_price?: string;
    plan_expires_at?: string | null;
    last_payment?: string | null;
    next_billing_date?: string | null;
    lucky_number?: string | null;
    lucky_number_formatted?: string | null;
    lottery_enabled?: boolean;
    active_time?: string;
    recipients_count: number;
    vaults_count: number;
    pending_payments_count: number;
  };
  recipients: {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    relationship: string;
  }[];
  vaults: {
    id: number;
    title: string;
    description: string;
    recipient_name: string;
    recipient_relationship: string;
    created_at: string;
    is_active: boolean;
    status_label: string;
    delivery_status: string; // 'pending' | 'delivered'
    password_hint: string | null;
    contents_count: number;
    messages_count: number;
    photos_count: number;
    videos_count: number;
  }[];
}

function AdminDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast, toasts } = useToast();
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedDetails, setSelectedDetails] =
    useState<AdminUserDetailsResponse | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [specialFilter, setSpecialFilter] = useState("");

  const [statistics, setStatistics] = useState<AdminStatistics | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const hasFetched = useRef(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [fromUser, setFromUser] = useState(0);
  const [toUser, setToUser] = useState(0);

  const updatePageInUrl = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams?.toString() || "");
      params.set("page", String(page));
      const query = params.toString();
      router.replace(`?${query}`);
    },
    [router, searchParams]
  );

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "mark_deceased" | "deliver_vault" | null
  >(null);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: "bg-green-100", text: "text-green-800", label: "Ativo" },
      inactive: { bg: "bg-gray-100", text: "text-gray-800", label: "Inativo" },
      overdue: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Em atraso",
      },
      cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Cancelado" },
      deceased_pending: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Falecido - A entregar",
      },
      deceased_delivered: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Falecido - Entregue",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const getPlanBadge = (plan: string) => {
    const planConfig = {
      "Sem plano": { bg: "bg-yellow-100", text: "text-yellow-800" },
      Memória: { bg: "bg-purple-100", text: "text-purple-800" },
      Premium: { bg: "bg-purple-100", text: "text-purple-800" },
      VIP: { bg: "bg-blue-100", text: "text-blue-800" },
    };

    const config =
      planConfig[plan as keyof typeof planConfig] || planConfig["Sem plano"];
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {plan}
      </span>
    );
  };

  const getLuckyNumberBadge = (
    luckyNumber: string | null,
    enabled: boolean
  ) => {
    if (luckyNumber && enabled) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 animate-pulse">
          {luckyNumber} ✓
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        {luckyNumber || "—"}
      </span>
    );
  };

  const handleViewUser = async (user: AdminUser) => {
    setSelectedUserId(user.id);
    setShowUserModal(true);
    setLoadingDetails(true);
    try {
      const resp = await api.get(`/admin/users/${user.id}`);
      if (resp.data?.error === false && resp.data.results) {
        setSelectedDetails(resp.data.results as AdminUserDetailsResponse);
      } else {
        addToast({ type: "error", title: "Erro ao carregar usuário" });
      }
    } catch {
      addToast({ type: "error", title: "Erro ao carregar usuário" });
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCloseModal = () => {
    setShowUserModal(false);
    setSelectedUserId(null);
    setSelectedDetails(null);
  };

  const openConfirm = (action: "mark_deceased" | "deliver_vault") => {
    setConfirmAction(action);
    setConfirmOpen(true);
  };

  const executeConfirm = async () => {
    if (!selectedUserId || !confirmAction) return;
    setConfirmLoading(true);
    try {
      if (confirmAction === "mark_deceased") {
        const r = await api.post(
          `/admin/users/${selectedUserId}/mark-deceased`
        );
        if (r.data?.error === false) {
          addToast({ type: "success", title: "Cliente marcado como falecido" });
          // Recarregar lista
          await fetchUsers();
          // Atualizar detalhes se abertos
          if (showUserModal) {
            await handleViewUser({ id: selectedUserId } as AdminUser);
          }
        } else {
          addToast({ type: "error", title: "Não foi possível marcar" });
        }
      }
      if (confirmAction === "deliver_vault") {
        const r = await api.post(
          `/admin/users/${selectedUserId}/deliver-vault`
        );
        if (r.data?.error === false) {
          addToast({
            type: "success",
            title: "Entrega disparada aos destinatários",
          });
        } else {
          addToast({ type: "error", title: "Falha ao disparar entrega" });
        }
      }
    } catch {
      addToast({ type: "error", title: "Ocorreu um erro na operação" });
    } finally {
      setConfirmLoading(false);
      setConfirmOpen(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.cpf.includes(searchTerm) ||
      (user.lucky_number || "").includes(searchTerm);
    const matchesPlan = !planFilter || user.plan === planFilter;
    const matchesStatus = !statusFilter || user.status === statusFilter;
    const matchesSpecial =
      !specialFilter ||
      (specialFilter === "lottery_enabled" && user.lottery_enabled) ||
      (specialFilter === "pending_delivery" && false) ||
      (specialFilter === "deceased_pending" &&
        user.status === "deceased_pending") ||
      (specialFilter === "deceased_delivered" &&
        user.status === "deceased_delivered");

    return matchesSearch && matchesPlan && matchesStatus && matchesSpecial;
  });

  const fetchStatistics = useCallback(async () => {
    try {
      setLoadingStats(true);
      const resp = await api.get("/admin/statistics");
      if (resp.data?.error === false && resp.data.results?.statistics) {
        setStatistics(resp.data.results.statistics as AdminStatistics);
      }
    } catch {
      addToast({ type: "error", title: "Erro ao carregar estatísticas" });
    } finally {
      setLoadingStats(false);
    }
  }, [addToast]);

  const fetchUsers = useCallback(
    async (page: number = 1) => {
      try {
        setLoadingUsers(true);
        const resp = await api.get("/admin/users", { params: { page } });
        if (resp.data?.error === false && resp.data.results?.users) {
          setUsers(resp.data.results.users as AdminUser[]);
          const pg = resp.data.results.pagination;
          if (pg) {
            setCurrentPage(pg.current_page || 1);
            setLastPage(pg.last_page || 1);
            setTotalUsers(
              pg.total || (resp.data.results.users as AdminUser[]).length || 0
            );
            setFromUser(pg.from || 0);
            setToUser(
              pg.to || (resp.data.results.users as AdminUser[]).length || 0
            );
          } else {
            setCurrentPage(1);
            setLastPage(1);
            setTotalUsers((resp.data.results.users as AdminUser[]).length || 0);
            setFromUser(
              (resp.data.results.users as AdminUser[]).length ? 1 : 0
            );
            setToUser((resp.data.results.users as AdminUser[]).length || 0);
          }
        }
      } catch {
        addToast({ type: "error", title: "Erro ao carregar usuários" });
      } finally {
        setLoadingUsers(false);
      }
    },
    [addToast]
  );

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchStatistics();
    const pageFromUrl = parseInt(searchParams?.get("page") || "1", 10);
    const page = Number.isNaN(pageFromUrl) || pageFromUrl < 1 ? 1 : pageFromUrl;
    fetchUsers(page);
    if (page !== 1) updatePageInUrl(page); // normalizar URL caso inválida
  }, [fetchStatistics, fetchUsers, searchParams, updatePageInUrl]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Administração LegadoBox</h1>
                <p className="text-white/80 text-sm">
                  Painel de Controle Administrativo
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium">Admin</p>
                <p className="text-white/60 text-sm">Painel administrativo</p>
              </div>
              <button
                onClick={() => window.location.assign("/dashboard")}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-6 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            {/* Total Usuários */}
            <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {loadingStats
                    ? "—"
                    : statistics?.total_users?.toLocaleString?.() || 0}
                </span>
              </div>
              <h3 className="font-medium text-gray-900 text-sm">
                Total Usuários
              </h3>
            </div>

            {/* Ativos */}
            <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-xl font-bold text-green-600">
                  {loadingStats ? "—" : statistics?.active_users || 0}
                </span>
              </div>
              <h3 className="font-medium text-gray-900 text-sm">Ativos</h3>
            </div>

            {/* Em Atraso */}
            <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-yellow-600" />
                </div>
                <span className="text-xl font-bold text-yellow-600">
                  {loadingStats ? "—" : statistics?.overdue_users || 0}
                </span>
              </div>
              <h3 className="font-medium text-gray-900 text-sm">Em Atraso</h3>
            </div>

            {/* Cancelados */}
            <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-4 h-4 text-red-600" />
                </div>
                <span className="text-xl font-bold text-red-600">
                  {loadingStats ? "—" : statistics?.cancelled_users || 0}
                </span>
              </div>
              <h3 className="font-medium text-gray-900 text-sm">Cancelados</h3>
            </div>

            {/* Falecidos */}
            <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-xl font-bold text-purple-600">
                  {loadingStats ? "—" : statistics?.deceased_users || 0}
                </span>
              </div>
              <h3 className="font-medium text-gray-900 text-sm">Falecidos</h3>
            </div>

            {/* Cofres a Entregar */}
            <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-xl font-bold text-orange-600">
                  {loadingStats ? "—" : statistics?.vaults_to_deliver || 0}
                </span>
              </div>
              <h3 className="font-medium text-gray-900 text-sm">A Entregar</h3>
            </div>

            {/* Cofres Entregues */}
            <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-xl font-bold text-emerald-600">
                  {loadingStats ? "—" : statistics?.vaults_delivered || 0}
                </span>
              </div>
              <h3 className="font-medium text-gray-900 text-sm">Entregues</h3>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Filtros de Busca
            </h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Search Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar por:
                </label>
                <input
                  type="text"
                  placeholder="Nome, e-mail, CPF ou número da sorte"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Plan Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plano:
                </label>
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos os planos</option>
                  <option value="Sem plano">Sem plano</option>
                  <option value="Premium">Premium</option>
                  <option value="Memória">Memória</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status:
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos os status</option>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                  <option value="overdue">Em atraso</option>
                  <option value="cancelled">Cancelado</option>
                  <option value="deceased_pending">
                    Falecido - A entregar
                  </option>
                  <option value="deceased_delivered">
                    Falecido - Entregue
                  </option>
                </select>
              </div>

              {/* Special Filters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filtros Especiais:
                </label>
                <select
                  value={specialFilter}
                  onChange={(e) => setSpecialFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Nenhum filtro especial</option>
                  <option value="lottery_enabled">
                    Habilitados para sorteio
                  </option>
                  <option value="pending_delivery">Cofres a entregar</option>
                  <option value="deceased_pending">
                    Falecidos - Legado a entregar
                  </option>
                  <option value="deceased_delivered">
                    Falecidos - Legado entregue
                  </option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <span>Buscar</span>
              </button>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setPlanFilter("");
                  setStatusFilter("");
                  setSpecialFilter("");
                }}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Limpar</span>
              </button>
              {/* <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Exportar</span>
              </button> */}
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  Lista de Usuários
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>
                    {loadingUsers
                      ? "Carregando..."
                      : `Mostrando ${fromUser}-${toUser} de ${totalUsers} usuários`}
                  </span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plano
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Número Sorte
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cofres
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loadingUsers ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-6 text-center text-gray-500"
                      >
                        Carregando usuários...
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-medium text-sm">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                CPF: {user.cpf}
                              </div>
                              <div className="text-sm text-gray-500">
                                Cadastro: {user.created_at}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {user.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.phone}
                          </div>
                          <div className="text-sm text-gray-500">
                            Nasc: {user.birth_date}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getPlanBadge(user.plan)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getLuckyNumberBadge(
                            user.lucky_number,
                            user.lottery_enabled
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {user.vaults_count} cofres
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.recipients_count} destinatários
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Ver
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUserId(user.id);
                              openConfirm("mark_deceased");
                            }}
                            className="text-red-600 hover:text-red-900 mr-3"
                          >
                            Marcar falecido
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUserId(user.id);
                              openConfirm("deliver_vault");
                            }}
                            className="text-emerald-600 hover:text-emerald-900"
                          >
                            Entregar cofre
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-6 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      if (currentPage > 1) {
                        const p = currentPage - 1;
                        updatePageInUrl(p);
                        fetchUsers(p);
                      }
                    }}
                    disabled={currentPage <= 1 || loadingUsers}
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  {Array.from({ length: Math.min(lastPage, 7) }).map(
                    (_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => {
                            updatePageInUrl(pageNum);
                            fetchUsers(pageNum);
                          }}
                          className={`px-3 py-1 rounded text-sm ${
                            currentPage === pageNum
                              ? "bg-blue-500 text-white"
                              : "border border-gray-300 hover:bg-gray-50"
                          }`}
                          disabled={loadingUsers}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                  {lastPage > 7 && (
                    <>
                      <span className="px-2 text-gray-400">...</span>
                      <button
                        onClick={() => {
                          updatePageInUrl(lastPage);
                          fetchUsers(lastPage);
                        }}
                        className={`px-3 py-1 rounded text-sm ${
                          currentPage === lastPage
                            ? "bg-blue-500 text-white"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                        disabled={loadingUsers}
                      >
                        {lastPage}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      if (currentPage < lastPage) {
                        const p = currentPage + 1;
                        updatePageInUrl(p);
                        fetchUsers(p);
                      }
                    }}
                    disabled={currentPage >= lastPage || loadingUsers}
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50"
                  >
                    Próximo
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  Página {currentPage} de {lastPage}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* User Detail Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Detalhes do Usuário</h3>
                    <p className="text-white/90">
                      Informações completas e cofres
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* User Info */}
              {loadingDetails && (
                <div className="text-center py-8 text-gray-600">
                  Carregando detalhes...
                </div>
              )}
              {!loadingDetails && selectedDetails && (
                <>
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-4">
                        Dados Pessoais
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium">Nome:</span>{" "}
                          {selectedDetails.user.name}
                        </div>
                        <div>
                          <span className="font-medium">E-mail:</span>{" "}
                          {selectedDetails.user.email}
                        </div>
                        <div>
                          <span className="font-medium">Telefone:</span>{" "}
                          {selectedDetails.user.phone}
                        </div>
                        <div>
                          <span className="font-medium">CPF:</span>{" "}
                          {selectedDetails.user.cpf}
                        </div>
                        <div>
                          <span className="font-medium">Data Nascimento:</span>{" "}
                          {selectedDetails.user.birth_date}
                        </div>
                        <div>
                          <span className="font-medium">Endereço:</span>{" "}
                          {selectedDetails.user.address || "—"}
                        </div>
                        <div>
                          <span className="font-medium">Data Cadastro:</span>{" "}
                          {selectedDetails.user.created_at}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-4">
                        Status da Conta
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium">Plano:</span>{" "}
                          <span className="text-purple-600 font-bold">
                            {selectedDetails.user.plan}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Status:</span>{" "}
                          <span className="font-bold">
                            {selectedDetails.user.status_label}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Número da Sorte:</span>{" "}
                          <span className="text-yellow-600 font-bold">
                            {selectedDetails.user.lucky_number_formatted || "—"}
                          </span>
                        </div>
                        {selectedDetails.user.last_payment && (
                          <div>
                            <span className="font-medium">
                              Último Pagamento:
                            </span>{" "}
                            {selectedDetails.user.last_payment}
                          </div>
                        )}
                        {selectedDetails.user.next_billing_date && (
                          <div>
                            <span className="font-medium">
                              Próximo Vencimento:
                            </span>{" "}
                            {selectedDetails.user.next_billing_date}
                          </div>
                        )}
                        <div className="pt-2 flex items-center space-x-3">
                          <button
                            onClick={() => openConfirm("mark_deceased")}
                            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                          >
                            Marcar falecido
                          </button>
                          <button
                            onClick={() => openConfirm("deliver_vault")}
                            className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                          >
                            Disparar entrega
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Destinatários */}
                  <div className="mb-8">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">
                      Destinatários Cadastrados (
                      {selectedDetails.recipients.length})
                    </h4>
                    <div className="bg-gray-50 rounded-xl p-4">
                      {selectedDetails.recipients.length === 0 ? (
                        <div className="text-sm text-gray-600">
                          Nenhum destinatário cadastrado.
                        </div>
                      ) : (
                        <div className="grid md:grid-cols-2 gap-4">
                          {selectedDetails.recipients.map((r) => (
                            <div key={r.id} className="bg-white rounded-lg p-4">
                              <div className="font-medium text-gray-900">
                                {r.full_name} ({r.relationship})
                              </div>
                              <div className="text-sm text-gray-500">
                                {r.email}
                              </div>
                              <div className="text-sm text-gray-500">
                                {r.phone}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cofres */}
                  <div className="mb-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">
                      Cofres Digitais ({selectedDetails.vaults.length})
                    </h4>
                    <div className="space-y-4">
                      {selectedDetails.vaults.map((v) => (
                        <div
                          key={v.id}
                          className={`${
                            v.is_active
                              ? "bg-blue-50 border-blue-200"
                              : "bg-gray-50 border-gray-200"
                          } border rounded-xl p-4`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-bold text-gray-900">
                              {v.title}
                            </h5>
                            <span
                              className={`text-sm font-medium ${
                                v.is_active ? "text-blue-600" : "text-gray-600"
                              }`}
                            >
                              {v.status_label}
                            </span>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <div>
                                <span className="font-medium">
                                  Destinatário:
                                </span>{" "}
                                {v.recipient_name} ({v.recipient_relationship})
                              </div>
                              <div>
                                <span className="font-medium">Mensagens:</span>{" "}
                                {v.messages_count}
                              </div>
                              <div>
                                <span className="font-medium">Fotos:</span>{" "}
                                {v.photos_count}
                              </div>
                              <div>
                                <span className="font-medium">Vídeos:</span>{" "}
                                {v.videos_count}
                              </div>
                            </div>
                            <div>
                              <div>
                                <span className="font-medium">
                                  Dica da Senha:
                                </span>
                              </div>
                              <div className="bg-yellow-100 p-2 rounded mt-1 text-xs">
                                {v.password_hint || "—"}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Confirm Modal */}
      <ConfirmationModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={executeConfirm}
        title={
          confirmAction === "mark_deceased"
            ? "Confirmar falecimento"
            : "Confirmar entrega"
        }
        message={
          confirmAction === "mark_deceased"
            ? "Tem certeza que deseja marcar este cliente como falecido? Esta ação pode notificar os destinatários."
            : "Deseja disparar os e-mails de entrega para os destinatários deste cliente?"
        }
        confirmText={confirmAction === "mark_deceased" ? "Marcar" : "Disparar"}
        type={confirmAction === "mark_deceased" ? "danger" : "info"}
        isLoading={confirmLoading}
      />

      {/* Toasts */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}
