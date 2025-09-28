'use client';

import { useState, useEffect } from 'react';
import { X, Gift, Calendar, Star, CheckCircle, Clock, Users, Trophy, Heart } from 'lucide-react';

interface LuckyNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  luckyNumber: number;
  subscriptionStatus: 'active' | 'inactive' | 'expired';
  nextDrawDate: string;
}

export default function LuckyNumberModal({ 
  isOpen, 
  onClose, 
  luckyNumber, 
  subscriptionStatus, 
  nextDrawDate 
}: LuckyNumberModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <div 
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div 
        className={`bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Gift className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">🎉 Sorteio Anual LegadoBox</h2>
                <p className="text-white/90">Seu número da sorte: <span className="font-bold text-2xl">{luckyNumber}</span></p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Prize Section */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Trophy className="w-8 h-8 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-900">🏆 Prêmio Principal</h3>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">R$ 10.000</div>
              <p className="text-gray-600">Em dinheiro + 1 ano de LegadoBox Premium gratuito</p>
            </div>
          </div>

          {/* How it Works */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Star className="w-6 h-6 text-yellow-500" />
              <span>Como Funciona</span>
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Mantenha sua assinatura ativa</p>
                  <p className="text-gray-600 text-sm">Seu número da sorte permanece válido enquanto você for assinante</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Sorteio anual em dezembro</p>
                  <p className="text-gray-600 text-sm">Todos os assinantes ativos participam automaticamente</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Resultado divulgado em tempo real</p>
                  <p className="text-gray-600 text-sm">Acompanhe o sorteio ao vivo em nossa plataforma</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Rules */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span>Regras Principais</span>
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700 text-sm">Apenas assinantes ativos no momento do sorteio podem participar</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700 text-sm">Cada assinante possui um número único e permanente</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700 text-sm">O sorteio é realizado por sistema automatizado e auditado</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700 text-sm">O prêmio será pago em até 30 dias após o sorteio</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700 text-sm">Em caso de empate, será realizado um novo sorteio entre os ganhadores</p>
              </div>
            </div>
          </div>

          {/* Next Draw */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="w-8 h-8 text-green-600" />
              <h3 className="text-xl font-bold text-gray-900">📅 Próximo Sorteio</h3>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">{nextDrawDate}</div>
              <p className="text-gray-600">Faltam apenas alguns meses!</p>
            </div>
          </div>

          {/* Your Lucky Number */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Heart className="w-8 h-8 text-indigo-600" />
              <h3 className="text-xl font-bold text-gray-900">🍀 Seu Número da Sorte</h3>
            </div>
            
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-indigo-600 mb-2">{luckyNumber}</div>
              <p className="text-gray-600">Este é seu número permanente no sorteio</p>
            </div>

            {/* Subscription Status */}
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-900">Status da Assinatura:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  subscriptionStatus === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : subscriptionStatus === 'expired'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {subscriptionStatus === 'active' ? 'Ativa' : subscriptionStatus === 'expired' ? 'Expirada' : 'Inativa'}
                </span>
              </div>
              
              {subscriptionStatus === 'active' ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Você está participando do sorteio!</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500">Assinatura ativa - 100% elegível</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-red-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Sua assinatura precisa estar ativa para participar</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500">Renove sua assinatura para participar do sorteio</p>
                </div>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <Users className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">1.247</div>
              <p className="text-sm text-gray-600">Participantes</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <Trophy className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">1</div>
              <p className="text-sm text-gray-600">Ganhador</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Boa sorte! 🍀
            </p>
            <button 
              onClick={handleClose}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Entendi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
