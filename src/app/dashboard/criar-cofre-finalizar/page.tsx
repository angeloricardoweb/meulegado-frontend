'use client';

import { useState, useEffect, Suspense } from 'react';
import { Heart, ArrowLeft, CheckCircle, Star, Gift, Users, Clock, Shield, Mail, Share2, Download, Home, Sparkles, Trophy, Crown, Rainbow } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';

// Interface para dados do cofre
interface VaultData {
  id: number;
  title: string;
  password_hint: string;
  delivery_message: string;
  status: string;
  delivered_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  recipients: Array<{
    id: number;
    full_name: string;
    email: string;
    relationship: string;
  }>;
  contents: Array<{
    id: number;
    type: string;
    title: string;
    content: string;
    file_name?: string;
    file_size?: number;
    file_type?: string;
    file_url?: string;
    album_number: number;
    order: number;
    scheduled_delivery_date?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    file_size_human?: string;
    type_label: string;
  }>;
  recipients_count: number;
  contents_count: number;
  can_be_edited: boolean;
  content_stats: {
    photos: number;
    videos: number;
    messages: number;
    total: number;
  };
}

function FinalizeVaultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vaultId = searchParams.get('vaultId');
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [vaultData, setVaultData] = useState<VaultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVaultData = async () => {
      if (!vaultId) {
        setError('ID do cofre não encontrado');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await api.get(`/digital-vaults/${vaultId}`);
        
        if (response.data.error === false) {
          setVaultData(response.data.results);
          // Simular confetti após carregar os dados
          setTimeout(() => setShowConfetti(true), 1000);
          
          // Simular progresso dos steps
          const interval = setInterval(() => {
            setCurrentStep(prev => prev < 3 ? prev + 1 : prev);
          }, 2000);

          return () => clearInterval(interval);
        } else {
          setError('Erro ao carregar dados do cofre');
        }
      } catch (err) {
        setError('Erro ao carregar dados do cofre');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVaultData();
  }, [vaultId]);

  const handleGoHome = () => {
    router.push('/dashboard');
  };

  const handleCreateAnother = () => {
    router.push('/dashboard/criar-cofre');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados do cofre...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !vaultData) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro ao carregar cofre</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/dashboard/cofres')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Voltar aos Cofres
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            >
              <div className={`w-3 h-3 rounded-full ${
                ['bg-yellow-400', 'bg-pink-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400'][Math.floor(Math.random() * 5)]
              }`}></div>
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">LegadoBox</h1>
              <p className="text-white/80 text-sm">Cofre Finalizado com Sucesso!</p>
            </div>
          </div>
          <button 
            onClick={handleGoHome}
            className="flex items-center space-x-2 text-white/80 hover:text-white"
          >
            <Home className="w-5 h-5" />
            <span>Início</span>
          </button>
        </div>
      </header>

      {/* Progress Steps */}
      <section className="py-6 px-4 bg-white border-b">
        <div className="max-w-4xl mx-auto flex items-center justify-center space-x-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="font-medium text-gray-900">Configuração</span>
          </div>
          <div className="w-16 h-1 bg-green-500 rounded"></div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="font-medium text-gray-900">Conteúdo</span>
          </div>
          <div className="w-16 h-1 bg-green-500 rounded"></div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center justify-center font-semibold">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="font-medium text-gray-900">Finalizar</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Trophy className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎉 Parabéns! Seu Cofre Digital foi Criado!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Você acabou de criar algo muito especial para {vaultData.recipients.map(r => r.full_name).join(', ')}
            </p>
          </div>

          {/* Vault Summary Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-green-200">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Cofre Digital #{vaultData.id}</h2>
              <p className="text-gray-600">Criado para {vaultData.recipients.map(r => r.full_name).join(', ')}</p>
            </div>

            {/* Content Summary */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{vaultData.content_stats.photos}</h3>
                <p className="text-gray-600">Fotos Especiais</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{vaultData.content_stats.videos}</h3>
                <p className="text-gray-600">Vídeos Especiais</p>
              </div>
              
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{vaultData.content_stats.messages}</h3>
                <p className="text-gray-600">Mensagens</p>
              </div>
            </div>

            {/* Albums Summary */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Conteúdo Criado</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {vaultData.contents.map((content, index) => (
                  <div key={content.id} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <p className="font-medium text-gray-900 text-sm">{content.title}</p>
                    <p className="text-gray-500 text-xs">{content.type_label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery Status */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8 border border-blue-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Status de Entrega</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-green-200">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">E-mail enviado com sucesso!</p>
                  <p className="text-sm text-gray-600">
                    {vaultData.recipients.map(r => r.full_name).join(', ')} receberá o link de acesso em {vaultData.recipients.map(r => r.email).join(', ')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{formatDate(vaultData.created_at)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-blue-200">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Aguardando acesso</p>
                  <p className="text-sm text-gray-600">
                    O destinatário poderá acessar o cofre usando o lembrete da senha
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Importance Message */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 mb-8 border border-amber-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Crown className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                🌟 O Que Você Acabou de Criar é Inestimável
              </h2>
              
              <div className="max-w-3xl mx-auto space-y-6 text-lg text-gray-700">
                <p className="leading-relaxed">
                  <strong>Seu cofre digital não é apenas uma coleção de fotos e vídeos.</strong> 
                  É um <span className="text-amber-600 font-bold">tesouro de memórias</span> que preservará 
                  momentos únicos da sua vida para as pessoas que mais ama.
                </p>
                
                <p className="leading-relaxed">
                  Cada foto, cada vídeo, cada mensagem que você adicionou representa um pedaço da sua história, 
                  da sua essência, do seu <span className="text-orange-600 font-bold">legado de amor</span> 
                  que será transmitido através das gerações.
                </p>
                
                <div className="bg-white rounded-xl p-6 border border-amber-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center justify-center space-x-2">
                    <Rainbow className="w-6 h-6 text-amber-600" />
                    <span>Por que isso é tão importante?</span>
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6 text-left">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Heart className="w-4 h-4 text-amber-600" />
                        </div>
                        <p className="text-gray-700">
                          <strong>Preserva memórias únicas</strong> que poderiam se perder no tempo
                        </p>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Users className="w-4 h-4 text-amber-600" />
                        </div>
                        <p className="text-gray-700">
                          <strong>Fortalece laços familiares</strong> através de histórias compartilhadas
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Star className="w-4 h-4 text-amber-600" />
                        </div>
                        <p className="text-gray-700">
                          <strong>Cria um legado duradouro</strong> para futuras gerações
                        </p>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Shield className="w-4 h-4 text-amber-600" />
                        </div>
                        <p className="text-gray-700">
                          <strong>Protege momentos preciosos</strong> com segurança digital
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-center text-xl font-medium text-amber-800 bg-amber-100 rounded-lg p-4">
                  💝 <strong>{vaultData.recipients.map(r => r.full_name).join(', ')}</strong> receberá não apenas um presente, 
                  mas um pedaço do seu coração preservado para sempre.
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          {/* <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Próximos Passos</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share2 className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Compartilhe o Link</h4>
                <p className="text-sm text-gray-600 mb-4">
                  O destinatário receberá um e-mail com o link de acesso
                </p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Copiar Link
                </button>
              </div>
              
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Baixar Backup</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Faça backup do seu cofre para maior segurança
                </p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Baixar ZIP
                </button>
              </div>
              
              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Criar Outro Cofre</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Que tal criar mais cofres para outras pessoas especiais?
                </p>
                <button 
                  onClick={handleCreateAnother}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Novo Cofre
                </button>
              </div>
            </div>
          </div> */}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={handleGoHome}
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 text-lg font-medium"
            >
              <Home className="w-6 h-6" />
              <span>Voltar ao Início</span>
            </button>
            
            <button 
              onClick={handleCreateAnother}
              className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 text-lg font-medium"
            >
              <Gift className="w-6 h-6" />
              <span>Criar Outro Cofre</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function FinalizeVaultPageWrapper() {
  return (
    <Suspense fallback={
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <FinalizeVaultPage />
    </Suspense>
  );
}
