"use client";

import { useState } from "react";
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
  Download,
  User,
  X,
} from "lucide-react";

// Dados mockados para administração
const mockAdminData = {
  user: {
    name: "Admin",
    lastAccess: "Hoje, 14:30",
  },
  stats: {
    totalUsers: 1247,
    activeUsers: 892,
    overdueUsers: 156,
    cancelledUsers: 187,
    deceasedUsers: 12,
    pendingDelivery: 8,
    delivered: 4,
  },
  users: [
    {
      id: 1,
      name: "João Silva",
      email: "joao@email.com",
      phone: "(11) 99999-9999",
      cpf: "123.456.789-00",
      birthDate: "15/08/1985",
      registrationDate: "15/03/2023",
      plan: "Premium",
      status: "active",
      luckyNumber: "#7842",
      luckyEnabled: true,
      vaults: 3,
      messages: 12,
      lastPayment: "15/08/2024",
      nextDue: "15/09/2024",
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria@email.com",
      phone: "(11) 88888-8888",
      cpf: "987.654.321-00",
      birthDate: "03/12/1990",
      registrationDate: "22/01/2024",
      plan: "Gratuito",
      status: "overdue",
      luckyNumber: "#3421",
      luckyEnabled: false,
      vaults: 1,
      messages: 3,
    },
    {
      id: 3,
      name: "Carlos Almeida",
      email: "carlos@email.com",
      phone: "(11) 77777-7777",
      cpf: "456.789.123-00",
      birthDate: "20/06/1975",
      registrationDate: "10/05/2022",
      plan: "VIP",
      status: "deceased_pending",
      luckyNumber: "#9876",
      luckyEnabled: true,
      vaults: 5,
      messages: 18,
      pendingDelivery: true,
    },
    {
      id: 4,
      name: "Ana Ferreira",
      email: "ana@email.com",
      phone: "(11) 66666-6666",
      cpf: "789.123.456-00",
      birthDate: "12/09/1988",
      registrationDate: "08/11/2023",
      plan: "Premium",
      status: "cancelled",
      luckyNumber: "#5432",
      luckyEnabled: false,
      vaults: 2,
      messages: 7,
    },
    {
      id: 5,
      name: "Roberto Lima",
      email: "roberto@email.com",
      phone: "(11) 55555-5555",
      cpf: "321.654.987-00",
      birthDate: "25/04/1965",
      registrationDate: "05/02/2021",
      plan: "VIP",
      status: "deceased_delivered",
      luckyNumber: "#1234",
      luckyEnabled: true,
      vaults: 4,
      messages: 15,
      deliveredDate: "10/01/2024",
    },
  ],
};

export default function AdminDashboard() {
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [specialFilter, setSpecialFilter] = useState("");

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: "bg-green-100", text: "text-green-800", label: "Ativo" },
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
      Gratuito: { bg: "bg-yellow-100", text: "text-yellow-800" },
      Premium: { bg: "bg-purple-100", text: "text-purple-800" },
      VIP: { bg: "bg-blue-100", text: "text-blue-800" },
    };

    const config =
      planConfig[plan as keyof typeof planConfig] || planConfig["Gratuito"];
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {plan}
      </span>
    );
  };

  const getLuckyNumberBadge = (luckyNumber: string, enabled: boolean) => {
    if (enabled) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 animate-pulse">
          {luckyNumber} ✓
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        {luckyNumber}
      </span>
    );
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleCloseModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  const handleAction = (action: string, userId?: number) => {
    console.log(
      `Ação executada: ${action}`,
      userId ? `para usuário ${userId}` : ""
    );
  };

  const filteredUsers = mockAdminData.users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.cpf.includes(searchTerm) ||
      user.luckyNumber.includes(searchTerm);
    const matchesPlan = !planFilter || user.plan === planFilter;
    const matchesStatus = !statusFilter || user.status === statusFilter;

    return matchesSearch && matchesPlan && matchesStatus;
  });

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
                <p className="font-medium">{mockAdminData.user.name}</p>
                <p className="text-white/60 text-sm">
                  Último acesso: {mockAdminData.user.lastAccess}
                </p>
              </div>
              <button
                onClick={() => handleAction("logout")}
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
                  {mockAdminData.stats.totalUsers.toLocaleString()}
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
                  {mockAdminData.stats.activeUsers}
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
                  {mockAdminData.stats.overdueUsers}
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
                  {mockAdminData.stats.cancelledUsers}
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
                  {mockAdminData.stats.deceasedUsers}
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
                  {mockAdminData.stats.pendingDelivery}
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
                  {mockAdminData.stats.delivered}
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
                  <option value="Gratuito">Gratuito</option>
                  <option value="Premium">Premium</option>
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
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Exportar</span>
              </button>
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
                    Mostrando 1-{filteredUsers.length} de{" "}
                    {mockAdminData.stats.totalUsers} usuários
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
                  {filteredUsers.map((user) => (
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
                              Cadastro: {user.registrationDate}
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
                          Nasc: {user.birthDate}
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
                          user.luckyNumber,
                          user.luckyEnabled
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.vaults} cofres
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.messages} mensagens
                        </div>
                        {user.pendingDelivery && (
                          <div className="text-sm text-red-600 font-medium">
                            ⚠️ Pendente entrega
                          </div>
                        )}
                        {user.deliveredDate && (
                          <div className="text-sm text-green-600 font-medium">
                            ✅ Entregue em {user.deliveredDate}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => handleAction("edit", user.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-6 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    Anterior
                  </button>
                  <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
                    1
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    2
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    3
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    Próximo
                  </button>
                </div>
                <div className="text-sm text-gray-500">Página 1 de 125</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
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
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">
                    Dados Pessoais
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Nome:</span>{" "}
                      {selectedUser.name}
                    </div>
                    <div>
                      <span className="font-medium">E-mail:</span>{" "}
                      {selectedUser.email}
                    </div>
                    <div>
                      <span className="font-medium">Telefone:</span>{" "}
                      {selectedUser.phone}
                    </div>
                    <div>
                      <span className="font-medium">CPF:</span>{" "}
                      {selectedUser.cpf}
                    </div>
                    <div>
                      <span className="font-medium">Data Nascimento:</span>{" "}
                      {selectedUser.birthDate}
                    </div>
                    <div>
                      <span className="font-medium">Data Cadastro:</span>{" "}
                      {selectedUser.registrationDate}
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
                        {selectedUser.plan}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>{" "}
                      <span className="text-green-600 font-bold">Ativo</span>
                    </div>
                    <div>
                      <span className="font-medium">Número da Sorte:</span>{" "}
                      <span className="text-yellow-600 font-bold">
                        {selectedUser.luckyNumber}{" "}
                        {selectedUser.luckyEnabled ? "✓ Habilitado" : ""}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Tempo Ativo:</span> 18 meses
                    </div>
                    {selectedUser.lastPayment && (
                      <div>
                        <span className="font-medium">Último Pagamento:</span>{" "}
                        {selectedUser.lastPayment}
                      </div>
                    )}
                    {selectedUser.nextDue && (
                      <div>
                        <span className="font-medium">Próximo Vencimento:</span>{" "}
                        {selectedUser.nextDue}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Destinatários */}
              <div className="mb-8">
                <h4 className="text-lg font-bold text-gray-900 mb-4">
                  Destinatários Cadastrados (5)
                </h4>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <div className="font-medium text-gray-900">
                        Maria Silva (Filha)
                      </div>
                      <div className="text-sm text-gray-500">
                        maria.filha@email.com
                      </div>
                      <div className="text-sm text-gray-500">
                        (11) 88888-8888
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="font-medium text-gray-900">
                        Pedro Silva (Filho)
                      </div>
                      <div className="text-sm text-gray-500">
                        pedro.filho@email.com
                      </div>
                      <div className="text-sm text-gray-500">
                        (11) 77777-7777
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cofres */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">
                  Cofres Digitais ({selectedUser.vaults})
                </h4>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-bold text-gray-900">
                        Cofre para Maria Silva
                      </h5>
                      <span className="text-sm text-blue-600 font-medium">
                        Ativo
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div>
                          <span className="font-medium">Destinatário:</span>{" "}
                          Maria Silva (Filha)
                        </div>
                        <div>
                          <span className="font-medium">Mensagens:</span> 5
                        </div>
                        <div>
                          <span className="font-medium">Fotos:</span> 12
                        </div>
                        <div>
                          <span className="font-medium">Vídeos:</span> 2
                        </div>
                      </div>
                      <div>
                        <div>
                          <span className="font-medium">Dica da Senha:</span>
                        </div>
                        <div className="bg-yellow-100 p-2 rounded mt-1 text-xs">
                          &quot;O dia que você nasceu + nome do seu primeiro
                          cachorro&quot;
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-bold text-gray-900">
                        Cofre para Pedro Silva
                      </h5>
                      <span className="text-sm text-green-600 font-medium">
                        Ativo
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div>
                          <span className="font-medium">Destinatário:</span>{" "}
                          Pedro Silva (Filho)
                        </div>
                        <div>
                          <span className="font-medium">Mensagens:</span> 4
                        </div>
                        <div>
                          <span className="font-medium">Fotos:</span> 8
                        </div>
                        <div>
                          <span className="font-medium">Vídeos:</span> 1
                        </div>
                      </div>
                      <div>
                        <div>
                          <span className="font-medium">Dica da Senha:</span>
                        </div>
                        <div className="bg-yellow-100 p-2 rounded mt-1 text-xs">
                          &quot;Sua data de nascimento + nome da sua mãe&quot;
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-bold text-gray-900">
                        Cofre Familiar
                      </h5>
                      <span className="text-sm text-purple-600 font-medium">
                        Ativo
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div>
                          <span className="font-medium">Destinatários:</span>{" "}
                          Maria e Pedro Silva
                        </div>
                        <div>
                          <span className="font-medium">Mensagens:</span> 3
                        </div>
                        <div>
                          <span className="font-medium">Fotos:</span> 15
                        </div>
                        <div>
                          <span className="font-medium">Vídeos:</span> 0
                        </div>
                      </div>
                      <div>
                        <div>
                          <span className="font-medium">Dica da Senha:</span>
                        </div>
                        <div className="bg-yellow-100 p-2 rounded mt-1 text-xs">
                          &quot;Endereço da nossa primeira casa + ano que nos
                          casamos&quot;
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
