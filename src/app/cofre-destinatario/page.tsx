"use client";

import { useState, useEffect, Suspense } from "react";
import {
  Heart,
  MailOpen,
  Calendar,
  MessageCircle,
  Image,
  Video,
  Download,
  DownloadCloud,
  ArrowRight,
  Play,
  ZoomIn,
  X,
  Clock,
  User,
  LogOut,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import vaultApi from "@/lib/vaultApi";

// Interfaces para tipagem da API
interface VaultAccessResponse {
  error: boolean;
  messages: string[];
  results: {
    vault: {
      id: number;
      title: string;
      delivery_message: string;
      status: string;
      created_at: string;
      delivered_at: string | null;
      creator: {
        name: string;
        email: string;
      };
      recipients: Array<{
        id: number;
        name: string;
        email: string;
        relationship: string;
      }>;
      stats: {
        messages_count: number;
        photos_count: number;
        videos_count: number;
        total_content_count: number;
      };
      messages: Array<{
        id: number;
        title: string;
        content: string;
        date: string;
        preview: string;
        order: number;
      }>;
      photos: {
        album_1: Array<{
          id: number;
          title: string;
          description: string;
          file_name: string;
          file_url: string;
          file_size: number;
          album_number: number;
          order: number;
        }>;
        album_2: any[];
        album_3: any[];
        album_4: any[];
      };
      videos: Array<{
        id: number;
        title: string;
        description: string;
        file_name: string;
        file_url: string;
        file_size: number;
        duration: string;
        order: number;
      }>;
      download_info: {
        total_size_mb: number;
        estimated_download_time: string;
      };
    };
    token_extended_until: string;
    access_expires_in_minutes: number;
  };
}

function VaultRecipientPage() {
  const searchParams = useSearchParams();
  const vaultId = searchParams.get("vaultId");

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [vaultData, setVaultData] = useState<
    VaultAccessResponse["results"]["vault"] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleLogout = () => {
    // Limpar dados do localStorage
    localStorage.removeItem("vault_token");
    localStorage.removeItem("vault_data");
    localStorage.removeItem("vault_expires_at");

    // Redirecionar para a página de login
    const currentVaultId = new URLSearchParams(window.location.search).get(
      "vaultId"
    );
    window.location.href = `/login-destinatario?vaultId=${
      currentVaultId || "6"
    }`;
  };

  const handleOpenMessage = (message: any) => {
    setSelectedMessage(message);
    setShowMessageModal(true);
  };

  const handleOpenPhoto = (photo: any) => {
    setSelectedPhoto(photo);
    setShowPhotoModal(true);
  };

  const handleOpenVideo = (video: any) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  const handleDownload = (type: string, item: any) => {
    console.log(`Baixando ${type}:`, item.title);
    // Implementar lógica de download
  };

  const handleDownloadAll = async () => {
    if (!vaultId) {
      console.error("ID do cofre não encontrado");
      return;
    }

    setIsDownloading(true);

    try {
      // Fazer requisição para a API de download
      const response = await vaultApi.get(`/vaults/${vaultId}/download`, {
        responseType: "blob", // Importante para arquivos binários
      });

      // Criar URL do blob
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      // Criar elemento de download
      const link = document.createElement("a");
      link.href = url;
      link.download = `cofre-${vaultData?.title || "digital"}-${
        new Date().toISOString().split("T")[0]
      }.zip`;

      // Adicionar ao DOM, clicar e remover
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Limpar URL do blob
      window.URL.revokeObjectURL(url);

      console.log("Download do cofre iniciado com sucesso!");
    } catch (error) {
      console.error("Erro ao baixar cofre:", error);
      // Aqui você pode adicionar um toast de erro se tiver o sistema de notificações
    } finally {
      setIsDownloading(false);
    }
  };

  // Função para formatar tamanho de arquivo
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  useEffect(() => {
    const fetchVaultAccess = async () => {
      if (!vaultId) {
        setError("ID do cofre não encontrado");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await vaultApi.get(`/vaults/${vaultId}/access`);

        if (response.data.error === false) {
          setVaultData(response.data.results.vault);
          setTimeRemaining(response.data.results.access_expires_in_minutes);
        } else {
          setError("Erro ao acessar cofre");
        }
      } catch {
        setError("Erro ao acessar cofre");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVaultAccess();
  }, [vaultId]);

  // Atualizar contador de tempo
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => Math.max(0, prev - 1));
      }, 60000); // Atualiza a cada minuto

      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando cofre...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Erro ao carregar cofre
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!vaultData) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Cofre não encontrado
          </h2>
          <p className="text-gray-600">
            O cofre solicitado não foi encontrado ou não existe.
          </p>
        </div>
      </div>
    );
  }

  // Transformar dados da API para o formato da UI
  const transformedData = {
    messages: vaultData.messages || [],
    photos: Object.values(vaultData.photos || {}).flat(),
    videos: vaultData.videos || [],
    stats: {
      messages: vaultData.stats.messages_count || 0,
      photos: vaultData.stats.photos_count || 0,
      videos: vaultData.stats.videos_count || 0,
    },
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Seu Cofre Digital</h1>
                <p className="text-white/80">Mensagens especiais para você</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-4">
                {timeRemaining > 0 && (
                  <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      {timeRemaining} min restantes
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-white/80 text-sm">Cofre ID:</p>
                  <p className="font-semibold">{vaultId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Message */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <MailOpen className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Olá! 💕</h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-4">
              {vaultData.creator.name} deixou estas mensagens, fotos e vídeos
              para você. Cada item foi criado com muito amor e carinho. Explore
              seu cofre digital e guarde essas memórias para sempre.
            </p>
            {vaultData.delivery_message && (
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700 italic">
                  &ldquo;{vaultData.delivery_message}&rdquo;
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  - {vaultData.creator.name}
                </p>
              </div>
            )}
            <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Criado em: {vaultData.created_at}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>
                  Total de itens: {vaultData.stats.total_content_count}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Overview */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Messages Count */}
            <div className="bg-gradient-to-r from-pink-400 to-red-500 text-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Mensagens</h3>
                  <p className="text-3xl font-bold">
                    {transformedData.stats.messages}
                  </p>
                  <p className="text-white/80 text-sm">Cartas especiais</p>
                </div>
                <MessageCircle className="w-12 h-12 text-white/80" />
              </div>
            </div>

            {/* Photos Count */}
            <div className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Fotos</h3>
                  <p className="text-3xl font-bold">
                    {transformedData.stats.photos}
                  </p>
                  <p className="text-white/80 text-sm">Memórias visuais</p>
                </div>
                <Image className="w-12 h-12 text-white/80" />
              </div>
            </div>

            {/* Videos Count */}
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Vídeos</h3>
                  <p className="text-3xl font-bold">
                    {transformedData.stats.videos}
                  </p>
                  <p className="text-white/80 text-sm">Momentos especiais</p>
                </div>
                <Video className="w-12 h-12 text-white/80" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Messages Section */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              💌 Mensagens para Você
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {transformedData.messages.map((message: any) => (
              <div
                key={message.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {message.title}
                      </h3>
                      <p className="text-sm text-gray-500">{message.date}</p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {message.preview.length > 150
                    ? `${message.preview.substring(0, 150)}...`
                    : message.preview}
                </p>
                <button
                  onClick={() => handleOpenMessage(message)}
                  className="text-purple-600 hover:text-purple-800 font-medium flex items-center space-x-1"
                >
                  <span>Ler mensagem completa</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photos Section */}
      <section className="py-8 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              📸 Álbum de Memórias
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {transformedData.photos.map((photo: any) => (
              <div
                key={photo.id}
                className="relative group cursor-pointer"
                onClick={() => handleOpenPhoto(photo)}
              >
                <div className="aspect-square bg-gray-200 rounded-xl overflow-hidden">
                  <img
                    src={photo.file_url}
                    alt={photo.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all rounded-xl flex items-center justify-center">
                  <div className="opacity-0 group-hover:ospacity-100 transition-opacity">
                    <ZoomIn className="w-8 h-8 text-white" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2 text-center">
                  {photo.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              🎥 Vídeos Especiais
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {transformedData.videos.map((video: any) => (
              <div
                key={video.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => handleOpenVideo(video)}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Video className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(video.file_size)}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {video.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-purple-600">
                    <Play className="w-4 h-4" />
                    <span className="text-sm font-medium">Reproduzir</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download All Section */}
      <section className="py-12 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-4">💾 Baixar Todo o Cofre</h2>
            <p className="text-xl text-white/90 mb-8">
              Guarde todas essas memórias especiais no seu dispositivo para
              sempre
            </p>
            <button
              onClick={handleDownloadAll}
              disabled={isDownloading}
              className="bg-white text-purple-600 px-8 py-4 text-lg font-semibold rounded-xl hover:bg-gray-100 transition-colors flex items-center space-x-3 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <>
                  <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Preparando download...</span>
                </>
              ) : (
                <>
                  <DownloadCloud className="w-6 h-6" />
                  <span>
                    Baixar Tudo ({vaultData.download_info.total_size_mb} MB)
                  </span>
                </>
              )}
            </button>
            <p className="text-white/70 text-sm mt-4">
              Tempo estimado: {vaultData.download_info.estimated_download_time}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold">LegadoBox</span>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Este cofre digital foi criado com muito amor e carinho especialmente
            para você por {vaultData.creator.name}.
          </p>
          <p className="text-gray-500 text-xs">
            © 2024 LegadoBox. Preservando memórias, conectando corações.
          </p>
        </div>
      </footer>

      {/* Message Modal */}
      {showMessageModal && selectedMessage && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={() => setShowMessageModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {selectedMessage.title}
                    </h3>
                    <p className="text-gray-500">{selectedMessage.date}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                {selectedMessage.content}
              </div>
              {/* <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800"
                >
                  Fechar
                </button>
                <button
                  onClick={() => handleDownload("mensagem", selectedMessage)}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Baixar</span>
                </button>
              </div> */}
            </div>
          </div>
        </div>
      )}

      {/* Photo Modal */}
      {showPhotoModal && selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={() => setShowPhotoModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 truncate pr-4">
                  📸 {selectedPhoto.title}
                </h3>
                <button
                  onClick={() => setShowPhotoModal(false)}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="bg-black rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                <img
                  src={selectedPhoto.file_url}
                  alt={selectedPhoto.title || "Imagem do cofre"}
                  className="max-w-full max-h-[60vh] object-contain"
                />
              </div>

              {selectedPhoto.description && (
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Descrição
                  </h4>
                  <p className="text-gray-700 break-words">
                    {selectedPhoto.description}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="truncate">{selectedPhoto.file_name}</span>
                <span className="ml-2">
                  {formatFileSize(selectedPhoto.file_size)}
                </span>
              </div>

              <div className="mt-6 flex justify-end">
                <a href={selectedPhoto.file_url} download target="_blank">
                  <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2">
                    <Download className="w-5 h-5" />
                    <span>Baixar Foto</span>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && selectedVideo && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={() => setShowVideoModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 truncate pr-4">
                  🎥 {selectedVideo.title}
                </h3>
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                <video
                  src={selectedVideo.file_url}
                  controls
                  className="w-full h-full object-contain"
                  preload="metadata"
                >
                  Seu navegador não suporta a reprodução de vídeos.
                </video>
              </div>

              {selectedVideo.description && (
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Descrição
                  </h4>
                  <p className="text-gray-700 break-words">
                    {selectedVideo.description}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="truncate">{selectedVideo.file_name}</span>
                <span className="ml-2">
                  {formatFileSize(selectedVideo.file_size)}
                </span>
              </div>

              <div className="mt-6 flex justify-end">
                <a href={selectedVideo.file_url} download target="_blank">
                  <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2">
                    <Download className="w-5 h-5" />
                    <span>Baixar Vídeo</span>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VaultRecipientPageWrapper() {
  return (
    <Suspense fallback={
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando cofre...</p>
        </div>
      </div>
    }>
      <VaultRecipientPage />
    </Suspense>
  );
}
