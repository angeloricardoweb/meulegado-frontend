"use client";

import { useState } from "react";
import {
  Heart,
  ArrowLeft,
  User,
  Lock,
  Lightbulb,
  Mail,
  Eye,
  EyeOff,
  Check,
  X,
  PlusCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast, ToastContainer } from '@/components/Toast';
import useSWR from "swr";
import api from "@/lib/api";

// Interface para destinatários da API
interface Destinatario {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  relationship: string;
  birth_date: string;
  phone: string;
  formatted_phone: string;
  state: string;
  city: string;
  zip_code: string;
  formatted_zip_code: string;
  address: string;
  facebook_profile: string;
  instagram_profile: string;
  reference1_name: string;
  reference1_phone: string;
  reference2_name: string;
  reference2_phone: string;
  notes: string;
  has_social_media: boolean;
  has_references: boolean;
  created_at: string;
  updated_at: string;
}

// Interface para informações do plano da API
interface PlanInfo {
  current_plan: {
    id: number;
    titulo: string;
    destinatarios_limit: number;
  };
  recipients_limit: number;
  remaining_recipients: number;
  can_add_recipient: boolean;
  completion_percentage: number;
}

// Interface para resposta da API de destinatários
interface RecipientsResponse {
  recipients: Destinatario[];
  plan_info: PlanInfo;
}

// Fetcher para SWR
const fetcher = async (url: string) => {
  const response = await api.get(url);
  return response.data.results;
};

export default function CreateVaultPage() {
  const router = useRouter();
  const { addToast, toasts } = useToast();
  
  // SWR para buscar destinatários
  const { data: recipientsData, error, isLoading } = useSWR<RecipientsResponse>(
    "/recipients",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  const [selectedRecipients, setSelectedRecipients] = useState<number[]>([]);
  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordHint, setPasswordHint] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dados derivados do SWR
  const recipients = recipientsData?.recipients || [];

  const getPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z\d]/.test(pwd)) strength++;
    return strength;
  };

  const getPasswordStrengthConfig = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return { width: "25%", color: "bg-red-500", text: "Senha fraca" };
      case 2:
        return { width: "50%", color: "bg-yellow-500", text: "Senha média" };
      case 3:
        return { width: "75%", color: "bg-green-500", text: "Senha boa" };
      case 4:
        return { width: "100%", color: "bg-green-600", text: "Senha forte" };
      default:
        return {
          width: "0%",
          color: "bg-gray-200",
          text: "Digite uma senha para ver a força",
        };
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordStrength(getPasswordStrength(value));
  };

  const handleRecipientSelect = (id: number) => {
    setSelectedRecipients(prev => {
      if (prev.includes(id)) {
        return prev.filter(recipientId => recipientId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      addToast({
        type: 'warning',
        title: 'Título obrigatório',
        message: 'Informe um título para o cofre.'
      });
      return;
    }

    if (selectedRecipients.length === 0) {
      addToast({
        type: 'warning',
        title: 'Destinatário não selecionado',
        message: 'Por favor, selecione pelo menos um destinatário para o cofre.'
      });
      return;
    }

    if (password !== confirmPassword) {
      addToast({
        type: 'error',
        title: 'Senhas não coincidem',
        message: 'As senhas digitadas não são iguais. Verifique e tente novamente.'
      });
      return;
    }

    if (password.length < 8) {
      addToast({
        type: 'error',
        title: 'Senha muito curta',
        message: 'A senha deve ter pelo menos 8 caracteres para maior segurança.'
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        title: title.trim(),
        password: password,
        password_hint: passwordHint,
        delivery_message: deliveryMessage,
        recipient_ids: selectedRecipients,
      };

      const response = await api.post('/digital-vaults', payload);

      if (response.data.error === false) {
        const vaultId = response.data.results.id;
        
        addToast({
          type: 'success',
          title: 'Cofre criado com sucesso',
          message: 'Você será redirecionado para a etapa de conteúdo.'
        });

        return router.push(`/dashboard/criar-cofre-conteudo?vaultId=${vaultId}`);
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Erro ao criar cofre',
        message: err.response.data.messages[0]
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedRecipientsData = recipients.filter((r) => selectedRecipients.includes(r.id));
  const passwordStrengthConfig = getPasswordStrengthConfig(passwordStrength);
  const passwordsMatch = password === confirmPassword && confirmPassword !== "";

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
              <p className="text-white/80 text-sm">Criar Cofre Digital</p>
            </div>
          </div>
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-white/80 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
        </div>
      </header>

      {/* Progress Steps */}
      <section className="py-6 px-4 bg-white border-b">
        <div className="max-w-4xl mx-auto flex items-center justify-center space-x-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold">
              1
            </div>
            <span className="font-medium text-gray-900">Configuração</span>
          </div>
          <div className="w-16 h-1 bg-gray-200 rounded"></div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-semibold">
              2
            </div>
            <span className="font-medium text-gray-500">Conteúdo</span>
          </div>
          <div className="w-16 h-1 bg-gray-200 rounded"></div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-semibold">
              3
            </div>
            <span className="font-medium text-gray-500">Finalizar</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🎁 Configurar Seu Cofre Digital
            </h2>
            <p className="text-xl text-gray-600">
              Vamos começar definindo para quem será este cofre especial
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Lock className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Título do Cofre
                  </h3>
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Ex: Memórias da Família"
                  required
                />
              </div>
              {/* Select Recipient */}
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Escolha o Destinatário
                  </h3>
                </div>

                <p className="text-gray-600 mb-6">
                  Selecione para quem você está criando este cofre digital
                  especial. Você pode selecionar múltiplos destinatários.
                </p>

                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando destinatários...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <X className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar destinatários</h3>
                    <p className="text-gray-600 mb-4">Não foi possível carregar a lista de destinatários.</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                    >
                      Tentar novamente
                    </button>
                  </div>
                ) : recipients.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum destinatário cadastrado</h3>
                    <p className="text-gray-600 mb-4">Você precisa cadastrar pelo menos um destinatário para criar um cofre.</p>
                    <button
                      onClick={() => router.push("/dashboard/destinatarios")}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                    >
                      Cadastrar Destinatário
                    </button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {recipients.map((recipient) => (
                      <div
                        key={recipient.id}
                        onClick={() => handleRecipientSelect(recipient.id)}
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:border-indigo-500 hover:shadow-md ${
                          selectedRecipients.includes(recipient.id)
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {recipient.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                              {recipient.full_name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {recipient.relationship} • {recipient.email}
                            </p>
                            <p className="text-xs text-gray-400">
                              {recipient.city && recipient.state 
                                ? `${recipient.city}, ${recipient.state}`
                                : "Localização não informada"
                              }
                            </p>
                          </div>
                          {selectedRecipients.includes(recipient.id) && (
                            <div className="text-indigo-600">
                              <Check className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {recipients.length > 0 && (
                  <div
                    onClick={() => router.push("/dashboard/destinatarios?redirect=criar-cofre")}
                    className="mt-3 border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300"
                  >
                    <div className="flex items-center justify-center space-x-3 h-full">
                      <PlusCircle className="w-8 h-8 text-gray-400" />
                      <div className="text-center">
                        <p className="font-medium text-gray-600">
                          Adicionar Novo
                        </p>
                        <p className="text-sm text-gray-400">
                          Cadastrar destinatário
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Set Password */}
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Lock className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Definir Senha de Acesso
                  </h3>
                </div>

                <p className="text-gray-600 mb-6">
                  Crie uma senha que o destinatário usará para acessar o cofre
                  digital
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Senha do Cofre
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Digite uma senha segura"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div
                          className={`h-1 rounded-full transition-all duration-300 ${passwordStrengthConfig.color}`}
                          style={{ width: passwordStrengthConfig.width }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {passwordStrengthConfig.text}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Confirme a senha"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <div className="mt-2">
                      {confirmPassword && (
                        <div className="flex items-center space-x-1">
                          {passwordsMatch ? (
                            <>
                              <Check className="w-4 h-4 text-green-600" />
                              <span className="text-xs text-green-600">
                                Senhas coincidem
                              </span>
                            </>
                          ) : (
                            <>
                              <X className="w-4 h-4 text-red-600" />
                              <span className="text-xs text-red-600">
                                Senhas não coincidem
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Reminder */}
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Lembrete da Senha
                  </h3>
                </div>

                <p className="text-gray-600 mb-6">
                  Crie um lembrete que ajudará o destinatário a descobrir a
                  senha. Seja criativo mas claro!
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lembrete Personalizado
                  </label>
                  <textarea
                    value={passwordHint}
                    onChange={(e) => setPasswordHint(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 'A data do nosso primeiro encontro seguida do nome do nosso primeiro pet' ou 'O ano que nos casamos + o nome da nossa música favorita'"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Este lembrete será enviado junto com o link de acesso ao
                    cofre
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-yellow-800 mb-2">
                      💡 Exemplo 1:
                    </h4>
                    <p className="text-sm text-yellow-700">
                      &quot;Lembra da nossa primeira viagem juntos? O nome da
                      cidade + o ano que fomos&quot;
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-800 mb-2">
                      💡 Exemplo 2:
                    </h4>
                    <p className="text-sm text-green-700">
                      &quot;O apelido carinhoso que eu te dava + sua idade
                      quando nos conhecemos&quot;
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Message */}
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-pink-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Mensagem de Entrega
                  </h3>
                </div>

                <p className="text-gray-600 mb-6">
                  Esta mensagem será enviada junto com o link do cofre para
                  contextualizar o presente
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem Personalizada
                  </label>
                  <textarea
                    value={deliveryMessage}
                    onChange={(e) => setDeliveryMessage(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 'Minha querida filha, criei este cofre digital especial para você. Dentro há memórias, fotos e mensagens que quero que você tenha para sempre. Use o lembrete abaixo para descobrir a senha e acessar seu presente.'"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Esta mensagem aparecerá no e-mail de notificação
                  </p>
                </div>

                {/* Preview */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-medium text-gray-900 mb-3">
                    📧 Preview do E-mail:
                  </h4>
                  <div className="bg-white p-4 rounded border text-sm">
                    <div className="border-b pb-2 mb-3">
                      <p>
                        <strong>De:</strong> LegadoBox
                        &lt;noreply@legadobox.com.br&gt;
                      </p>
                      <p>
                        <strong>Para:</strong>{" "}
                        {selectedRecipientsData.length > 0 
                          ? selectedRecipientsData.map(r => r.email).join(", ")
                          : "destinatario@email.com"
                        }
                      </p>
                      <p>
                        <strong>Assunto:</strong> 💝 Você recebeu um Cofre
                        Digital especial
                      </p>
                    </div>
                    <div className="space-y-3">
                      <p>
                        Olá {selectedRecipientsData.length > 0 
                          ? selectedRecipientsData.map(r => r.full_name).join(", ")
                          : "Destinatário"
                        },
                      </p>
                      <div className="italic text-gray-700">
                        {deliveryMessage ||
                          "[Sua mensagem personalizada aparecerá aqui]"}
                      </div>
                      <div className="bg-blue-50 p-3 rounded">
                        <p>
                          <strong>🔗 Link do Cofre:</strong>{" "}
                          https://cofre.legadobox.com.br/abc123
                        </p>
                        <p>
                          <strong>💡 Lembrete da Senha:</strong>
                        </p>
                        <div className="italic">
                          {passwordHint || "[Seu lembrete aparecerá aqui]"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Voltar</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Criando...</span>
                    </>
                  ) : (
                    <>
                      <span>Continuar para Conteúdo</span>
                      <ArrowLeft className="w-5 h-5 rotate-180" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}
