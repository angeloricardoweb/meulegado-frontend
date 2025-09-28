'use client';

import { useState, useEffect } from 'react';
import { Heart, ArrowLeft, CheckCircle, Star, Gift, Users, Clock, Shield, Mail, Share2, Download, Home, Sparkles, Trophy, Crown, Rainbow } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Dados mockados do cofre finalizado
const mockVaultData = {
  recipient: {
    name: 'Maria Silva',
    email: 'maria@email.com',
    relationship: 'Filha'
  },
  config: {
    passwordHint: 'A data do nosso primeiro encontro seguida do nome do nosso primeiro pet',
    deliveryMessage: 'Minha querida filha, criei este cofre digital especial para você. Dentro há memórias, fotos e mensagens que quero que você tenha para sempre.'
  },
  content: {
    totalPhotos: 24,
    totalVideos: 2,
    totalMessages: 3,
    albums: [
      { name: 'Memórias da Infância', count: 8 },
      { name: 'Família', count: 6 },
      { name: 'Viagens', count: 5 },
      { name: 'Especiais', count: 5 }
    ]
  },
  vaultId: 'LB-2024-001',
  createdAt: '2024-01-15T10:30:00Z',
  deliveryDate: '2024-01-15T18:00:00Z'
};

export default function FinalizeVaultPage() {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Simular confetti após carregar a página
    setTimeout(() => setShowConfetti(true), 1000);
    
    // Simular progresso dos steps
    const interval = setInterval(() => {
      setCurrentStep(prev => prev < 3 ? prev + 1 : prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleGoHome = () => {
    router.push('/');
  };

  const handleCreateAnother = () => {
    router.push('/criar-cofre');
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
              Você acabou de criar algo muito especial para {mockVaultData.recipient.name}
            </p>
          </div>

          {/* Vault Summary Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-green-200">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Cofre Digital #{mockVaultData.vaultId}</h2>
              <p className="text-gray-600">Criado para {mockVaultData.recipient.name} ({mockVaultData.recipient.relationship})</p>
            </div>

            {/* Content Summary */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{mockVaultData.content.totalPhotos}</h3>
                <p className="text-gray-600">Fotos Especiais</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{mockVaultData.content.totalVideos}</h3>
                <p className="text-gray-600">Vídeos Especiais</p>
              </div>
              
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{mockVaultData.content.totalMessages}</h3>
                <p className="text-gray-600">Mensagens</p>
              </div>
            </div>

            {/* Albums Summary */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Álbuns Criados</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mockVaultData.content.albums.map((album, index) => (
                  <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <p className="font-medium text-gray-900 text-sm">{album.name}</p>
                    <p className="text-gray-500 text-xs">{album.count} fotos</p>
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
                    {mockVaultData.recipient.name} receberá o link de acesso em {mockVaultData.recipient.email}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{formatDate(mockVaultData.deliveryDate)}</p>
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
                  💝 <strong>{mockVaultData.recipient.name}</strong> receberá não apenas um presente, 
                  mas um pedaço do seu coração preservado para sempre.
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
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
          </div>

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
