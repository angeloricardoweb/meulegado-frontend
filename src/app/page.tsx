"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  PlayCircle,
  Gift,
  FileText,
  Key,
  MessageCircle,
  Users,
  ChevronDown,
  Mail,
  Info,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";

interface Plano {
  id: number;
  titulo: string;
  preco: string;
  destinatarios: number;
  url_assinatura: string;
  mais_popular: boolean;
  cor: string;
}

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [loadingPlanos, setLoadingPlanos] = useState(true);
  const [showReceiveLegacyModal, setShowReceiveLegacyModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    fetchPlanos();
  }, []);

  const fetchPlanos = async () => {
    try {
      setLoadingPlanos(true);
      const response = await api.get("/planos");
      if (response.data.error === false && response.data.results) {
        setPlanos(response.data.results);
      }
    } catch (error) {
      console.error("Erro ao buscar planos:", error);
    } finally {
      setLoadingPlanos(false);
    }
  };

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const handleSelectPlan = (plano: Plano) => {
    window.open(plano.url_assinatura, "_blank");
  };

  const handleStartFreeTrial = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/cadastro");
    }
  };

  const handleLoginOrDashboard = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  const handleReceiveLegacy = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/destinatario/login");
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Mensagem enviada com sucesso!");
    setShowContactModal(false);
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-800 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                LegadoBox
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#inicio"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Início
              </a>
              <a
                href="#como-funciona"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Como Funciona
              </a>
              <a
                href="#planos"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Planos
              </a>
              <a
                href="#faq"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                FAQ
              </a>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {/* <button
                onClick={() => setShowReceiveLegacyModal(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg flex items-center space-x-2"
              >
                <Gift className="w-4 h-4" />
                <span>Receber Legado</span>
              </button> */}
              <button
                onClick={handleLoginOrDashboard}
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg"
              >
                {isLoading ? "..." : user ? "Dashboard" : "Login"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="inicio"
        className="bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            O que você gostaria
            <br />
            <span className="text-blue-200">de dizer...</span>
          </h1>
          <h2 className="text-3xl md:text-4xl font-light mb-8 text-blue-100">
            quando não estiver mais aqui?
          </h2>
          <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-4xl mx-auto leading-relaxed">
            Preserve suas memórias, instruções e mensagens de amor em um cofre
            digital seguro. Garanta que suas palavras mais importantes cheguem
            às pessoas certas no momento certo.
          </p>

          {/* Single CTA Button */}
          <div className="flex justify-center">
            <button
              onClick={handleStartFreeTrial}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-4 rounded-xl text-xl font-bold transition-all hover:shadow-2xl transform hover:scale-105 flex items-center space-x-3"
            >
              <PlayCircle className="w-6 h-6" />
              <span>Comece seu Teste Grátis</span>
            </button>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Como Funciona
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Um processo simples, seguro e humano para garantir que sua voz
              será ouvida, mesmo quando você não estiver mais aqui.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center hover:transform hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Crie seu cofre digital seguro
              </h3>
              <p className="text-gray-600">
                Cadastre-se e configure seu espaço protegido. Somente você
                controla quem poderá acessar suas mensagens.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center hover:transform hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Deixe mensagens que importam
              </h3>
              <p className="text-gray-600">
                Escreva cartas, grave vídeos, adicione fotos e registre
                instruções e despedidas especiais que farão diferença para quem
                você ama.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center hover:transform hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Escolha seus destinatários
              </h3>
              <p className="text-gray-600">
                Defina quem receberá cada mensagem. Cadastre familiares, amigos
                e pessoas especiais.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center hover:transform hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                4
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Nós garantimos a entrega
              </h3>
              <p className="text-gray-600">
                Confirmamos oficialmente seu falecimento e, com toda segurança e
                privacidade, entregamos suas mensagens no momento certo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* O que você pode preservar */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              O que você pode preservar
            </h2>
            <p className="text-xl text-gray-600">
              Suas memórias e instruções mais importantes, organizadas e
              protegidas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Mensagens para filhos */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 hover:shadow-xl hover:transform hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Mensagens para filhos
              </h3>
              <p className="text-gray-600">
                Cartas de amor, conselhos para o futuro, vídeos especiais, fotos
                de família e palavras de encorajamento para momentos especiais da
                vida dos seus filhos.
              </p>
            </div>

            {/* Instruções sobre bens */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 hover:shadow-xl hover:transform hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Instruções sobre bens
              </h3>
              <p className="text-gray-600">
                Localização de documentos importantes, instruções sobre
                investimentos, informações sobre seguros e orientações para a
                família.
              </p>
            </div>

            {/* Senhas e contas */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 hover:shadow-xl hover:transform hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Key className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Senhas e contas importantes
              </h3>
              <p className="text-gray-600">
                Acesso a contas bancárias, redes sociais, e-mails e outros
                serviços digitais que precisam ser gerenciados pela família.
              </p>
            </div>

            {/* Recado final */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 hover:shadow-xl hover:transform hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <MessageCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Recado final para quem você ama
              </h3>
              <p className="text-gray-600">
                Suas últimas palavras de amor, gratidão e despedida para cônjuge,
                familiares e amigos especiais que marcaram sua vida.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Escolha seu plano
            </h2>
            <p className="text-xl text-gray-600">
              Opções mensais flexíveis para preservar seus legados digitais
            </p>
          </div>

          {loadingPlanos ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando planos...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {planos.map((plano) => (
                <div
                  key={plano.id}
                  className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:transform hover:-translate-y-1 transition-all duration-300 ${
                    plano.mais_popular ? "ring-4 ring-green-400 relative" : ""
                  }`}
                >
                  {plano.mais_popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      Mais Popular
                    </div>
                  )}
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {plano.titulo}
                    </h3>
                    <div
                      className="text-4xl font-bold mb-6"
                      style={{ color: plano.cor }}
                    >
                      R$ {plano.preco.replace(".", ",")}
                      <span className="text-lg text-gray-500">/mês</span>
                    </div>
                    <div className="text-gray-600 mb-8">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Users className="w-5 h-5" style={{ color: plano.cor }} />
                        <span>Até {plano.destinatarios} destinatários</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSelectPlan(plano)}
                      className={`w-full text-white py-3 rounded-lg font-bold transition-all hover:shadow-lg ${
                        plano.mais_popular
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-700"
                          : "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
                      }`}
                    >
                      Assinar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-gray-600">
              Tire suas dúvidas sobre o LegadoBox
            </p>
          </div>

          <div className="space-y-4">
            {/* FAQ Item 1 */}
            <div className="border-b border-gray-200">
              <button
                onClick={() => toggleFaq(1)}
                className="w-full text-left py-6 flex items-center justify-between"
              >
                <span className="text-lg font-semibold text-gray-900">
                  Como funciona a entrega das mensagens?
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openFaq === 1 ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openFaq === 1 ? "max-h-48 pb-6" : "max-h-0"
                }`}
              >
                <p className="text-gray-600">
                  Monitoramos discretamente através do CPF e confirmamos
                  oficialmente o falecimento. Após a confirmação, entramos em
                  contato com os destinatários cadastrados e entregamos as
                  mensagens de forma segura e privada.
                </p>
              </div>
            </div>

            {/* FAQ Item 2 */}
            <div className="border-b border-gray-200">
              <button
                onClick={() => toggleFaq(2)}
                className="w-full text-left py-6 flex items-center justify-between"
              >
                <span className="text-lg font-semibold text-gray-900">
                  Meus dados estão seguros?
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openFaq === 2 ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openFaq === 2 ? "max-h-48 pb-6" : "max-h-0"
                }`}
              >
                <p className="text-gray-600">
                  Sim! Utilizamos criptografia de ponta a ponta e seguimos os
                  mais rigorosos padrões de segurança. Seus dados são protegidos
                  com a mesma tecnologia usada por bancos e instituições
                  financeiras.
                </p>
              </div>
            </div>

            {/* FAQ Item 3 */}
            <div className="border-b border-gray-200">
              <button
                onClick={() => toggleFaq(3)}
                className="w-full text-left py-6 flex items-center justify-between"
              >
                <span className="text-lg font-semibold text-gray-900">
                  Posso alterar as mensagens depois de criadas?
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openFaq === 3 ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openFaq === 3 ? "max-h-48 pb-6" : "max-h-0"
                }`}
              >
                <p className="text-gray-600">
                  Claro! Você pode editar, adicionar ou remover mensagens a
                  qualquer momento enquanto sua conta estiver ativa. Suas
                  mensagens ficam sempre sob seu controle.
                </p>
              </div>
            </div>

            {/* FAQ Item 4 */}
            <div className="border-b border-gray-200">
              <button
                onClick={() => toggleFaq(4)}
                className="w-full text-left py-6 flex items-center justify-between"
              >
                <span className="text-lg font-semibold text-gray-900">
                  Quantos destinatários posso adicionar?
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openFaq === 4 ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openFaq === 4 ? "max-h-48 pb-6" : "max-h-0"
                }`}
              >
                <p className="text-gray-600">
                  Depende do seu plano: Memória (2 destinatários), Lembrança (5
                  destinatários) ou Legado (10 destinatários). Você pode fazer
                  upgrade a qualquer momento.
                </p>
              </div>
            </div>

            {/* FAQ Item 5 */}
            <div className="border-b border-gray-200">
              <button
                onClick={() => toggleFaq(5)}
                className="w-full text-left py-6 flex items-center justify-between"
              >
                <span className="text-lg font-semibold text-gray-900">
                  E se eu quiser cancelar o serviço?
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openFaq === 5 ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openFaq === 5 ? "max-h-48 pb-6" : "max-h-0"
                }`}
              >
                <p className="text-gray-600">
                  Você pode cancelar a qualquer momento. Após o cancelamento,
                  seus dados serão mantidos por 90 dias para possível reativação.
                  Após esse período, tudo será permanentemente excluído.
                </p>
              </div>
            </div>

            {/* FAQ Item 6 */}
            <div className="border-b border-gray-200">
              <button
                onClick={() => toggleFaq(6)}
                className="w-full text-left py-6 flex items-center justify-between"
              >
                <span className="text-lg font-semibold text-gray-900">
                  Como vocês verificam se algo aconteceu comigo?
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openFaq === 6 ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openFaq === 6 ? "max-h-48 pb-6" : "max-h-0"
                }`}
              >
                <p className="text-gray-600">
                  Utilizamos verificação oficial através do CPF em bases de dados
                  governamentais. O processo é discreto, seguro e respeitoso,
                  garantindo que as mensagens sejam entregues apenas no momento
                  apropriado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Comece a preservar sua história hoje
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Não deixe para amanhã as palavras que podem fazer a diferença na
            vida de quem você ama.
          </p>
          <button
            onClick={handleStartFreeTrial}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-4 rounded-xl text-xl font-bold transition-all hover:shadow-2xl transform hover:scale-105"
          >
            Criar meu cofre digital
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo e descrição */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-800 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold">LegadoBox</span>
              </div>
              <p className="text-gray-400 mb-6">
                Preserve suas memórias e mensagens mais importantes em um cofre
                digital seguro. Garanta que suas palavras cheguem às pessoas
                certas no momento certo.
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#inicio"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Início
                  </a>
                </li>
                <li>
                  <a
                    href="#como-funciona"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Como Funciona
                  </a>
                </li>
                <li>
                  <a
                    href="#planos"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Planos
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Contato */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contato</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Enviar Mensagem
                  </button>
                </li>
                <li>
                  <a
                    href="/privacidade"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacidade
                  </a>
                </li>
                <li>
                  <a
                    href="/termos"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Termos de Uso
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2024 LegadoBox. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Modal Receber Legado */}
      {showReceiveLegacyModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          style={{ backdropFilter: "blur(8px)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowReceiveLegacyModal(false);
            }
          }}
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Receber Legado
              </h3>
              <p className="text-gray-600">
                Acesse o legado digital deixado para você
              </p>
            </div>

            <form onSubmit={handleReceiveLegacy} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Login/CPF
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Digite seu CPF ou login"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Digite a senha"
                  required
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800 flex items-start">
                  <Info className="w-4 h-4 inline mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    Você recebeu de nossa equipe uma dica deixada por quem enviou
                    a mensagem, para que possa lembrar ou descobrir a senha e
                    acessar o legado com segurança.
                  </span>
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReceiveLegacyModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-700 text-white py-3 rounded-lg font-medium transition-all hover:shadow-lg"
                >
                  Acessar Legado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Contato */}
      {showContactModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          style={{ backdropFilter: "blur(8px)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowContactModal(false);
            }
          }}
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Entre em Contato
              </h3>
              <p className="text-gray-600">
                Envie sua mensagem para nossa equipe
              </p>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Seu nome completo"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Digite sua mensagem..."
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-700 text-white py-3 rounded-lg font-medium transition-all hover:shadow-lg"
                >
                  Enviar Mensagem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
