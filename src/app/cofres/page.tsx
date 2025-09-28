'use client';

import { useState, useEffect } from 'react';
import { Heart, ArrowLeft, Plus, Eye, Edit, Trash2, Lock, Users, Calendar, Image, Video, MessageCircle, Gift, Clock, CheckCircle, AlertCircle, Star, Crown, Archive, Share2, Download } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

// Interface para cofres
interface Cofre {
  id: string;
  titulo: string;
  destinatario: {
    id: number;
    name: string;
    email: string;
    relationship: string;
    avatar: string;
  };
  status: 'ativo' | 'pendente' | 'entregue' | 'arquivado';
  dataCriacao: string;
  dataEntrega?: string;
  conteudo: {
    totalFotos: number;
    totalVideos: number;
    totalMensagens: number;
    albuns: Array<{
      nome: string;
      fotos: number;
    }>;
  };
  configuracao: {
    senha: string;
    lembreteSenha: string;
    mensagemEntrega: string;
  };
  estatisticas: {
    visualizacoes: number;
    ultimaVisualizacao?: string;
    downloads: number;
  };
  tags: string[];
  prioridade: 'baixa' | 'media' | 'alta';
}

// Dados mockados dos cofres
const mockCofres: Cofre[] = [
  {
    id: 'LB-2024-001',
    titulo: 'Memórias da Infância - Maria',
    destinatario: {
      id: 1,
      name: 'Maria Silva Santos',
      email: 'maria@email.com',
      relationship: 'Filha',
      avatar: 'MS'
    },
    status: 'ativo',
    dataCriacao: '2024-01-15T10:30:00Z',
    conteudo: {
      totalFotos: 24,
      totalVideos: 2,
      totalMensagens: 3,
      albuns: [
        { nome: 'Primeiros Anos', fotos: 8 },
        { nome: 'Família', fotos: 6 },
        { nome: 'Viagens', fotos: 5 },
        { nome: 'Especiais', fotos: 5 }
      ]
    },
    configuracao: {
      senha: '******',
      lembreteSenha: 'A data do nosso primeiro encontro seguida do nome do nosso primeiro pet',
      mensagemEntrega: 'Minha querida filha, criei este cofre digital especial para você...'
    },
    estatisticas: {
      visualizacoes: 0,
      downloads: 0
    },
    tags: ['família', 'infância', 'memórias'],
    prioridade: 'alta'
  },
  {
    id: 'LB-2024-002',
    titulo: 'Conselhos de Vida - João',
    destinatario: {
      id: 2,
      name: 'João Silva',
      email: 'joao@email.com',
      relationship: 'Filho',
      avatar: 'JS'
    },
    status: 'pendente',
    dataCriacao: '2024-01-20T14:15:00Z',
    conteudo: {
      totalFotos: 12,
      totalVideos: 1,
      totalMensagens: 5,
      albuns: [
        { nome: 'Conselhos', fotos: 4 },
        { nome: 'Experiências', fotos: 8 }
      ]
    },
    configuracao: {
      senha: '******',
      lembreteSenha: 'O ano que nos casamos + o nome da nossa música favorita',
      mensagemEntrega: 'Meu querido filho, quero compartilhar com você...'
    },
    estatisticas: {
      visualizacoes: 0,
      downloads: 0
    },
    tags: ['conselhos', 'pai', 'sabedoria'],
    prioridade: 'media'
  },
  {
    id: 'LB-2024-003',
    titulo: 'Histórias de Amor - Ana',
    destinatario: {
      id: 3,
      name: 'Ana Santos',
      email: 'ana@email.com',
      relationship: 'Esposa',
      avatar: 'AS'
    },
    status: 'entregue',
    dataCriacao: '2024-01-10T09:45:00Z',
    dataEntrega: '2024-01-25T18:00:00Z',
    conteudo: {
      totalFotos: 36,
      totalVideos: 3,
      totalMensagens: 7,
      albuns: [
        { nome: 'Nosso Casamento', fotos: 12 },
        { nome: 'Viagens Juntos', fotos: 10 },
        { nome: 'Momentos Especiais', fotos: 8 },
        { nome: 'Família', fotos: 6 }
      ]
    },
    configuracao: {
      senha: '******',
      lembreteSenha: 'O nome da nossa música de casamento',
      mensagemEntrega: 'Minha amada esposa, este cofre contém...'
    },
    estatisticas: {
      visualizacoes: 3,
      ultimaVisualizacao: '2024-01-26T10:30:00Z',
      downloads: 1
    },
    tags: ['amor', 'casamento', 'esposa'],
    prioridade: 'alta'
  },
  {
    id: 'LB-2024-004',
    titulo: 'Legado Digital - Netos',
    destinatario: {
      id: 4,
      name: 'Carlos e Sofia',
      email: 'netos@email.com',
      relationship: 'Netos',
      avatar: 'CS'
    },
    status: 'arquivado',
    dataCriacao: '2024-01-05T16:20:00Z',
    conteudo: {
      totalFotos: 48,
      totalVideos: 4,
      totalMensagens: 2,
      albuns: [
        { nome: 'História da Família', fotos: 15 },
        { nome: 'Tradições', fotos: 12 },
        { nome: 'Receitas', fotos: 8 },
        { nome: 'Fotos Antigas', fotos: 13 }
      ]
    },
    configuracao: {
      senha: '******',
      lembreteSenha: 'O nome do nosso primeiro neto',
      mensagemEntrega: 'Meus queridos netos, quero que vocês conheçam...'
    },
    estatisticas: {
      visualizacoes: 1,
      ultimaVisualizacao: '2024-01-12T14:15:00Z',
      downloads: 0
    },
    tags: ['família', 'história', 'tradições', 'netos'],
    prioridade: 'baixa'
  }
];

export default function CofresPage() {
  const { user, isLoading } = useAuth();
  const [cofres, setCofres] = useState<Cofre[]>(mockCofres);
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroPrioridade, setFiltroPrioridade] = useState<string>('todos');
  const [busca, setBusca] = useState<string>('');

  // Filtrar cofres
  const cofresFiltrados = cofres.filter(cofre => {
    const matchStatus = filtroStatus === 'todos' || cofre.status === filtroStatus;
    const matchPrioridade = filtroPrioridade === 'todos' || cofre.prioridade === filtroPrioridade;
    const matchBusca = busca === '' || 
      cofre.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      cofre.destinatario.name.toLowerCase().includes(busca.toLowerCase()) ||
      cofre.tags.some(tag => tag.toLowerCase().includes(busca.toLowerCase()));
    
    return matchStatus && matchPrioridade && matchBusca;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ativo':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-100',
          text: 'Ativo',
          description: 'Pronto para entrega'
        };
      case 'pendente':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bg: 'bg-yellow-100',
          text: 'Pendente',
          description: 'Aguardando finalização'
        };
      case 'entregue':
        return {
          icon: Gift,
          color: 'text-blue-600',
          bg: 'bg-blue-100',
          text: 'Entregue',
          description: 'Já foi entregue'
        };
      case 'arquivado':
        return {
          icon: Archive,
          color: 'text-gray-600',
          bg: 'bg-gray-100',
          text: 'Arquivado',
          description: 'Cofre arquivado'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-gray-600',
          bg: 'bg-gray-100',
          text: 'Desconhecido',
          description: 'Status não definido'
        };
    }
  };

  const getPrioridadeConfig = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return {
          icon: Star,
          color: 'text-red-600',
          bg: 'bg-red-100',
          text: 'Alta'
        };
      case 'media':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bg: 'bg-yellow-100',
          text: 'Média'
        };
      case 'baixa':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-100',
          text: 'Baixa'
        };
      default:
        return {
          icon: Clock,
          color: 'text-gray-600',
          bg: 'bg-gray-100',
          text: 'Normal'
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteCofre = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cofre? Esta ação não pode ser desfeita.')) {
      setCofres(prev => prev.filter(cofre => cofre.id !== id));
    }
  };

  const handleArchiveCofre = (id: string) => {
    setCofres(prev => prev.map(cofre => 
      cofre.id === id 
        ? { ...cofre, status: 'arquivado' as const }
        : cofre
    ));
  };

  // Tela de loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando cofres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">LegadoBox</h1>
              <p className="text-white/80 text-sm">Meus Cofres Digitais</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 text-white/80 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Page Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">📦 Meus Cofres Digitais</h2>
            <p className="text-xl text-gray-600">Gerencie seus legados digitais para as pessoas especiais</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Archive className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{cofres.length}</p>
                  <p className="text-gray-600">Total de Cofres</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {cofres.filter(c => c.status === 'ativo').length}
                  </p>
                  <p className="text-gray-600">Ativos</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Gift className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {cofres.filter(c => c.status === 'entregue').length}
                  </p>
                  <p className="text-gray-600">Entregues</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {cofres.reduce((sum, c) => sum + c.conteudo.totalFotos, 0)}
                  </p>
                  <p className="text-gray-600">Fotos Totais</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Buscar cofres, destinatários ou tags..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-4">
                <select
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="todos">Todos os Status</option>
                  <option value="ativo">Ativo</option>
                  <option value="pendente">Pendente</option>
                  <option value="entregue">Entregue</option>
                  <option value="arquivado">Arquivado</option>
                </select>
                
                <select
                  value={filtroPrioridade}
                  onChange={(e) => setFiltroPrioridade(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="todos">Todas as Prioridades</option>
                  <option value="alta">Alta</option>
                  <option value="media">Média</option>
                  <option value="baixa">Baixa</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cofres Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {cofresFiltrados.map((cofre) => {
              const statusConfig = getStatusConfig(cofre.status);
              const prioridadeConfig = getPrioridadeConfig(cofre.prioridade);
              const StatusIcon = statusConfig.icon;
              const PrioridadeIcon = prioridadeConfig.icon;

              return (
                <div key={cofre.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {/* Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{cofre.titulo}</h3>
                        <p className="text-sm text-gray-600">ID: {cofre.id}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${prioridadeConfig.bg} ${prioridadeConfig.color}`}>
                          <PrioridadeIcon className="w-3 h-3 inline mr-1" />
                          {prioridadeConfig.text}
                        </div>
                      </div>
                    </div>
                    
                    {/* Destinatário */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {cofre.destinatario.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{cofre.destinatario.name}</p>
                        <p className="text-sm text-gray-500">{cofre.destinatario.relationship}</p>
                      </div>
                    </div>
                    
                    {/* Status */}
                    <div className="flex items-center space-x-2">
                      <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                      <span className={`text-sm font-medium ${statusConfig.color}`}>
                        {statusConfig.text}
                      </span>
                      <span className="text-sm text-gray-500">• {statusConfig.description}</span>
                    </div>
                  </div>

                  {/* Content Stats */}
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <Image className="w-4 h-4 text-blue-600" />
                          <span className="text-lg font-bold text-gray-900">{cofre.conteudo.totalFotos}</span>
                        </div>
                        <p className="text-xs text-gray-500">Fotos</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <Video className="w-4 h-4 text-purple-600" />
                          <span className="text-lg font-bold text-gray-900">{cofre.conteudo.totalVideos}</span>
                        </div>
                        <p className="text-xs text-gray-500">Vídeos</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <MessageCircle className="w-4 h-4 text-green-600" />
                          <span className="text-lg font-bold text-gray-900">{cofre.conteudo.totalMensagens}</span>
                        </div>
                        <p className="text-xs text-gray-500">Mensagens</p>
                      </div>
                    </div>

                    {/* Álbuns */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Álbuns:</p>
                      <div className="flex flex-wrap gap-1">
                        {cofre.conteudo.albuns.map((album, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {album.nome} ({album.fotos})
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {cofre.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Estatísticas */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <span>👁️ {cofre.estatisticas.visualizacoes} visualizações</span>
                        <span>📥 {cofre.estatisticas.downloads} downloads</span>
                      </div>
                    </div>

                    {/* Data */}
                    <div className="text-sm text-gray-500 mb-4">
                      <p>Criado em: {formatDate(cofre.dataCriacao)}</p>
                      {cofre.dataEntrega && (
                        <p>Entregue em: {formatDate(cofre.dataEntrega)}</p>
                      )}
                      {cofre.estatisticas.ultimaVisualizacao && (
                        <p>Última visualização: {formatDate(cofre.estatisticas.ultimaVisualizacao)}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {cofre.status !== 'arquivado' && (
                          <button 
                            onClick={() => handleArchiveCofre(cofre.id)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Arquivar cofre"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteCofre(cofre.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Excluir cofre"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {cofresFiltrados.length === 0 && (
            <div className="text-center py-12">
              <Archive className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-xl font-medium text-gray-500 mb-2">
                {busca || filtroStatus !== 'todos' || filtroPrioridade !== 'todos' 
                  ? 'Nenhum cofre encontrado' 
                  : 'Nenhum cofre criado ainda'
                }
              </h4>
              <p className="text-gray-400 mb-6">
                {busca || filtroStatus !== 'todos' || filtroPrioridade !== 'todos'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece criando seu primeiro cofre digital'
                }
              </p>
              {(!busca && filtroStatus === 'todos' && filtroPrioridade === 'todos') && (
                <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2 mx-auto">
                  <Plus className="w-5 h-5" />
                  <span>Criar Primeiro Cofre</span>
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
