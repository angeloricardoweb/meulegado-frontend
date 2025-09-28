'use client';

import { useState, useEffect } from 'react';
import { Heart, ArrowLeft, Users, Plus, X, User, Phone, Share2, FileText, ShieldCheck, ArrowUp, Edit, Trash2, Check, Star, Crown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { ConfirmationModal } from '@/components/ConfirmationModal';

// Interface para planos da API
interface Plano {
  id: number;
  titulo: string;
  preco: number;
  destinatarios: number;
  url_assinatura: string;
  mais_popular: boolean;
  cor: string;
}

// Interface para destinatários
interface Destinatario {
  id: number;
  fullName: string;
  email: string;
  relationship: string;
  birthDate: string;
  phone: string;
  state: string;
  city: string;
  zipCode: string;
  address: string;
  facebook: string;
  instagram: string;
  reference1Name: string;
  reference1Phone: string;
  reference2Name: string;
  reference2Phone: string;
  notes: string;
  createdAt: string;
}

// Dados mockados
const mockRecipientsData = {
  currentPlan: {
    type: 'free', // free, premium, vip
    maxRecipients: 2,
    currentRecipients: 0
  },
  recipients: []
};

export default function RecipientsPage() {
  const { user, isLoading } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(mockRecipientsData.currentPlan);
  const [recipients, setRecipients] = useState<Destinatario[]>(mockRecipientsData.recipients);
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [loadingPlanos, setLoadingPlanos] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recipientToDelete, setRecipientToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    relationship: '',
    birthDate: '',
    phone: '',
    state: '',
    city: '',
    zipCode: '',
    address: '',
    facebook: '',
    instagram: '',
    reference1Name: '',
    reference1Phone: '',
    reference2Name: '',
    reference2Phone: '',
    notes: ''
  });

  const progressPercentage = currentPlan.type === 'vip' ? 0 : (currentPlan.currentRecipients / currentPlan.maxRecipients) * 100;

  // Função para buscar planos da API
  const fetchPlanos = async () => {
    try {
      setLoadingPlanos(true);
      const response = await api.get('/planos');
      
      if (response.data.error === false && response.data.results) {
        setPlanos(response.data.results);
      }
    } catch (error) {
      console.error('Erro ao buscar planos:', error);
    } finally {
      setLoadingPlanos(false);
    }
  };

  // Atualizar plano atual baseado nos dados do usuário
  useEffect(() => {
    if (user?.assinatura) {
      const assinatura = user.assinatura;
      const planoAtual = planos.find(p => p.titulo === assinatura.plano);
      
      if (planoAtual) {
        setCurrentPlan({
          type: planoAtual.id === 1 ? 'free' : planoAtual.id === 2 ? 'premium' : 'vip',
          maxRecipients: planoAtual.destinatarios,
          currentRecipients: recipients.length
        });
      }
    }
  }, [user, planos, recipients.length]);

  // Buscar planos ao carregar a página
  useEffect(() => {
    fetchPlanos();
  }, []);

  const getPlanConfig = () => {
    if (user?.assinatura) {
      const assinatura = user.assinatura;
      const planoAtual = planos.find(p => p.titulo === assinatura.plano);
      
      if (planoAtual) {
        return {
          name: planoAtual.titulo,
          description: `Você pode cadastrar até ${planoAtual.destinatarios} destinatários`,
          bgClass: 'bg-gradient-to-r from-green-50 to-emerald-50',
          borderClass: 'border-green-400',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          buttonClass: 'bg-green-600 hover:bg-green-700',
          cor: planoAtual.cor
        };
      }
    }

    // Fallback para planos mockados
    switch (currentPlan.type) {
      case 'free':
        return {
          name: 'Plano Gratuito',
          description: 'Você pode cadastrar até 2 destinatários',
          bgClass: 'bg-gradient-to-r from-amber-50 to-yellow-50',
          borderClass: 'border-amber-400',
          iconBg: 'bg-amber-100',
          iconColor: 'text-amber-600',
          buttonClass: 'bg-amber-600 hover:bg-amber-700',
          cor: '#f59e0b'
        };
      case 'premium':
        return {
          name: 'Plano Premium',
          description: 'Você pode cadastrar até 10 destinatários',
          bgClass: 'bg-gradient-to-r from-green-50 to-emerald-50',
          borderClass: 'border-green-400',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          buttonClass: 'bg-green-600 hover:bg-green-700',
          cor: '#16a34a'
        };
      case 'vip':
        return {
          name: 'Plano VIP',
          description: 'Destinatários ilimitados',
          bgClass: 'bg-gradient-to-r from-purple-50 to-violet-50',
          borderClass: 'border-purple-400',
          iconBg: 'bg-purple-100',
          iconColor: 'text-purple-600',
          buttonClass: 'bg-purple-600 hover:bg-purple-700',
          cor: '#9233ea'
        };
      default:
        return {
          name: 'Plano Gratuito',
          description: 'Você pode cadastrar até 2 destinatários',
          bgClass: 'bg-gradient-to-r from-amber-50 to-yellow-50',
          borderClass: 'border-amber-400',
          iconBg: 'bg-amber-100',
          iconColor: 'text-amber-600',
          buttonClass: 'bg-amber-600 hover:bg-amber-700',
          cor: '#f59e0b'
        };
    }
  };

  const planConfig = getPlanConfig();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentPlan.type !== 'vip' && currentPlan.currentRecipients >= currentPlan.maxRecipients) {
      setShowUpgradeModal(true);
      return;
    }

    const newRecipient = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString()
    };

    setRecipients(prev => [...prev, newRecipient]);
    setCurrentPlan(prev => ({
      ...prev,
      currentRecipients: prev.currentRecipients + 1
    }));
    
    setFormData({
      fullName: '',
      email: '',
      relationship: '',
      birthDate: '',
      phone: '',
      state: '',
      city: '',
      zipCode: '',
      address: '',
      facebook: '',
      instagram: '',
      reference1Name: '',
      reference1Phone: '',
      reference2Name: '',
      reference2Phone: '',
      notes: ''
    });
    
    setShowAddForm(false);
  };

  const handleDeleteRecipient = (id: number) => {
    setRecipientToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!recipientToDelete) return;
    
    setIsDeleting(true);
    
    try {
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setRecipients(prev => prev.filter(r => r.id !== recipientToDelete));
      setCurrentPlan(prev => ({
        ...prev,
        currentRecipients: prev.currentRecipients - 1
      }));
      setShowDeleteModal(false);
      setRecipientToDelete(null);
    } catch {
      // Em caso de erro, apenas fechar o modal
      setShowDeleteModal(false);
      setRecipientToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setRecipientToDelete(null);
  };

  const handleUpgradePlan = (plano: Plano) => {
    // Redirecionar para a URL de assinatura do Stripe
    window.open(plano.url_assinatura, '_blank');
    setShowUpgradeModal(false);
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      if (numbers.length <= 10) {
        return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      } else {
        return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
    }
    return value;
  };

  const formatZipCode = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    return value;
  };

  // Tela de loading
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
              <p className="text-white/80 text-sm">Gerenciar Destinatários</p>
            </div>
          </div>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-white/80 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar ao Dashboard</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Page Title */}
          <div className="text-center mb-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">👥 Meus Destinatários</h2>
            <p className="text-xl text-gray-600">Gerencie as pessoas que receberão seus legados digitais</p>
          </div>

          {/* Plan Status Card */}
          <div className="mb-8 animate-fade-in">
            <div className={`${planConfig.bgClass} border-2 ${planConfig.borderClass} rounded-2xl p-6`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${planConfig.iconBg} rounded-full flex items-center justify-center`}>
                    <Crown className={`w-6 h-6 ${planConfig.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{planConfig.name}</h3>
                    <p className="text-gray-700">{planConfig.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl font-bold text-gray-900">{currentPlan.currentRecipients}</span>
                    <span className="text-gray-500">/</span>
                    <span className="text-lg text-gray-600">{currentPlan.type === 'vip' ? '∞' : currentPlan.maxRecipients}</span>
                    <Users className="w-5 h-5 text-gray-500" />
                  </div>
                  {currentPlan.type !== 'vip' && (
                    <button 
                      onClick={() => setShowUpgradeModal(true)}
                      className={`${planConfig.buttonClass} text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2`}
                    >
                      <ArrowUp className="w-4 h-4" />
                      <span>Fazer Upgrade</span>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Progress Bar */}
              {currentPlan.type !== 'vip' && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Destinatários cadastrados</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="w-full bg-white/50 rounded-full h-2">
                    <div 
                      className={`${planConfig.buttonClass.replace('hover:', '')} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recipients List */}
          <div className="mb-8 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">📋 Destinatários Cadastrados</h3>
                  <button 
                    onClick={() => {
                      if (currentPlan.type !== 'vip' && currentPlan.currentRecipients >= currentPlan.maxRecipients) {
                        setShowUpgradeModal(true);
                        return;
                      }
                      setShowAddForm(true);
                    }}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Adicionar Destinatário</span>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {recipients.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-xl font-medium text-gray-500 mb-2">Nenhum destinatário cadastrado</h4>
                    <p className="text-gray-400">Clique em &quot;Adicionar Destinatário&quot; para começar</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recipients.map((recipient) => (
                      <div key={recipient.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-500 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {recipient.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{recipient.fullName}</h4>
                              <p className="text-sm text-gray-500">{recipient.relationship} • {recipient.email}</p>
                              <p className="text-xs text-gray-400">
                                {recipient.city ? `${recipient.city}, ${recipient.state}` : 'Localização não informada'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => console.log('Editar destinatário', recipient.id)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteRecipient(recipient.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Add Recipient Form */}
          {showAddForm && (
            <div className="animate-fade-in">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">➕ Adicionar Novo Destinatário</h3>
                  <button 
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Explanatory Message */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Por que precisamos dessas informações?</h4>
                      <p className="text-blue-700 text-sm">
                        Preencha os dados abaixo para garantir que sua mensagem chegue com segurança e rapidez no momento certo. 
                        Quanto mais informações você fornecer, mais fácil será localizar e entregar sua mensagem para a pessoa escolhida.
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  
                  {/* Basic Information */}
                  <div className="bg-gray-50 rounded-lg p-6 mb-6 border-l-4 border-indigo-500">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                      <User className="w-5 h-5 text-blue-600" />
                      <span>Informações Básicas</span>
                    </h4>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome Completo <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          required 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                          placeholder="Ex: Maria Silva Santos"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          E-mail <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                          placeholder="Ex: maria@email.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Relacionamento <span className="text-red-500">*</span>
                        </label>
                        <select 
                          value={formData.relationship}
                          onChange={(e) => handleInputChange('relationship', e.target.value)}
                          required 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Selecione...</option>
                          <option value="filho">Filho(a)</option>
                          <option value="esposo">Esposo(a)</option>
                          <option value="pai">Pai/Mãe</option>
                          <option value="irmao">Irmão(ã)</option>
                          <option value="neto">Neto(a)</option>
                          <option value="amigo">Amigo(a)</option>
                          <option value="primo">Primo(a)</option>
                          <option value="sobrinho">Sobrinho(a)</option>
                          <option value="outro">Outro</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Data de Nascimento
                        </label>
                        <input 
                          type="date" 
                          value={formData.birthDate}
                          onChange={(e) => handleInputChange('birthDate', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-gray-50 rounded-lg p-6 mb-6 border-l-4 border-green-500">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                      <Phone className="w-5 h-5 text-green-600" />
                      <span>Informações de Contato</span>
                    </h4>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Telefone
                        </label>
                        <input 
                          type="tel" 
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', formatPhone(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                          placeholder="Ex: (11) 99999-9999"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Estado
                        </label>
                        <select 
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Selecione o estado...</option>
                          <option value="AC">Acre</option>
                          <option value="AL">Alagoas</option>
                          <option value="AP">Amapá</option>
                          <option value="AM">Amazonas</option>
                          <option value="BA">Bahia</option>
                          <option value="CE">Ceará</option>
                          <option value="DF">Distrito Federal</option>
                          <option value="ES">Espírito Santo</option>
                          <option value="GO">Goiás</option>
                          <option value="MA">Maranhão</option>
                          <option value="MT">Mato Grosso</option>
                          <option value="MS">Mato Grosso do Sul</option>
                          <option value="MG">Minas Gerais</option>
                          <option value="PA">Pará</option>
                          <option value="PB">Paraíba</option>
                          <option value="PR">Paraná</option>
                          <option value="PE">Pernambuco</option>
                          <option value="PI">Piauí</option>
                          <option value="RJ">Rio de Janeiro</option>
                          <option value="RN">Rio Grande do Norte</option>
                          <option value="RS">Rio Grande do Sul</option>
                          <option value="RO">Rondônia</option>
                          <option value="RR">Roraima</option>
                          <option value="SC">Santa Catarina</option>
                          <option value="SP">São Paulo</option>
                          <option value="SE">Sergipe</option>
                          <option value="TO">Tocantins</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cidade
                        </label>
                        <input 
                          type="text" 
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                          placeholder="Ex: São Paulo"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CEP
                        </label>
                        <input 
                          type="text" 
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange('zipCode', formatZipCode(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                          placeholder="Ex: 01234-567"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Endereço Completo
                      </label>
                      <input 
                        type="text" 
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        placeholder="Ex: Rua das Flores, 123, Apto 45, Jardim Primavera"
                      />
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="bg-gray-50 rounded-lg p-6 mb-6 border-l-4 border-purple-500">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                      <Share2 className="w-5 h-5 text-purple-600" />
                      <span>Redes Sociais</span>
                    </h4>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Facebook
                        </label>
                        <input 
                          type="url" 
                          value={formData.facebook}
                          onChange={(e) => handleInputChange('facebook', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                          placeholder="Ex: https://facebook.com/maria.silva"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Instagram
                        </label>
                        <input 
                          type="url" 
                          value={formData.instagram}
                          onChange={(e) => handleInputChange('instagram', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                          placeholder="Ex: https://instagram.com/maria.silva"
                        />
                      </div>
                    </div>
                  </div>

                  {/* References */}
                  <div className="bg-gray-50 rounded-lg p-6 mb-6 border-l-4 border-orange-500">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                      <Users className="w-5 h-5 text-orange-600" />
                      <span>Referências Pessoais</span>
                    </h4>
                    
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nome da Referência 1
                          </label>
                          <input 
                            type="text" 
                            value={formData.reference1Name}
                            onChange={(e) => handleInputChange('reference1Name', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                            placeholder="Ex: João Santos (amigo próximo)"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Telefone da Referência 1
                          </label>
                          <input 
                            type="tel" 
                            value={formData.reference1Phone}
                            onChange={(e) => handleInputChange('reference1Phone', formatPhone(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                            placeholder="Ex: (11) 88888-8888"
                          />
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nome da Referência 2
                          </label>
                          <input 
                            type="text" 
                            value={formData.reference2Name}
                            onChange={(e) => handleInputChange('reference2Name', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                            placeholder="Ex: Ana Costa (colega de trabalho)"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Telefone da Referência 2
                          </label>
                          <input 
                            type="tel" 
                            value={formData.reference2Phone}
                            onChange={(e) => handleInputChange('reference2Phone', formatPhone(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                            placeholder="Ex: (11) 77777-7777"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="bg-gray-50 rounded-lg p-6 mb-6 border-l-4 border-indigo-500">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-indigo-600" />
                      <span>Observações Importantes</span>
                    </h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Informações Adicionais (opcional)
                      </label>
                      <textarea 
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        rows={4} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        placeholder="Ex: Trabalha na empresa XYZ, frequenta a academia do bairro, tem um cachorro chamado Rex, costuma viajar nas férias..."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Inclua detalhes que possam ajudar a localizar o destinatário no futuro (trabalho, hobbies, locais frequentados, etc.)
                      </p>
                    </div>
                  </div>

                  {/* Security Message */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-900 mb-1">🔒 Segurança e Privacidade</h4>
                        <p className="text-green-700 text-sm">
                          Esses dados são usados apenas para confirmar a identidade do destinatário e garantir que sua mensagem seja entregue, 
                          mesmo que ele mude de telefone ou e-mail no futuro. Nosso compromisso é que sua mensagem chegue onde precisa, no momento certo.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center justify-between pt-6 border-t">
                    <button 
                      type="button" 
                      onClick={() => setShowAddForm(false)}
                      className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800"
                    >
                      <X className="w-5 h-5" />
                      <span>Cancelar</span>
                    </button>
                    
                    <button 
                      type="submit" 
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
                    >
                      <Users className="w-5 h-5" />
                      <span>Adicionar Destinatário</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Upgrade Modal */}
          {showUpgradeModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">🚀 Upgrade de Plano</h3>
                  <button 
                    onClick={() => setShowUpgradeModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
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
                            ? 'border-green-400 bg-gradient-to-r from-green-50 to-emerald-50 ring-2 ring-green-200' 
                            : 'border-gray-300 bg-white hover:border-indigo-400'
                        }`}
                        style={{ borderColor: plano.mais_popular ? undefined : plano.cor }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: `${plano.cor}20` }}
                            >
                              {plano.mais_popular ? (
                                <Star className="w-5 h-5" style={{ color: plano.cor }} />
                              ) : (
                                <Crown className="w-5 h-5" style={{ color: plano.cor }} />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="text-xl font-bold text-gray-900">{plano.titulo}</h4>
                                {plano.mais_popular && (
                                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                                    Mais Popular
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600">
                                {plano.destinatarios === 999 ? 'Destinatários ilimitados' : `Até ${plano.destinatarios} destinatários`}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">R$ {plano.preco.toFixed(2).replace('.', ',')}</p>
                            <p className="text-sm text-gray-500">/mês</p>
                          </div>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-center space-x-2">
                            <Check className="w-4 h-4" style={{ color: plano.cor }} />
                            <span>
                              {plano.destinatarios === 999 ? 'Destinatários ilimitados' : `Até ${plano.destinatarios} destinatários`}
                            </span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <Check className="w-4 h-4" style={{ color: plano.cor }} />
                            <span>Cofres ilimitados</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <Check className="w-4 h-4" style={{ color: plano.cor }} />
                            <span>Suporte prioritário</span>
                          </li>
                          {plano.id === 3 && (
                            <li className="flex items-center space-x-2">
                              <Check className="w-4 h-4" style={{ color: plano.cor }} />
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
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Excluir Destinatário"
        message="Tem certeza que deseja excluir este destinatário? Esta ação não pode ser desfeita."
        confirmText="Sim, Excluir"
        cancelText="Cancelar"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
