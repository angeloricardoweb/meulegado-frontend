"use client";

import { useState, useEffect, Suspense } from "react";
import {
  Heart,
  ArrowLeft,
  Image,
  Video,
  MessageCircle,
  UploadCloud,
  X,
  Eye,
  ArrowRight,
  Check,
  Star,
  Crown,
} from "lucide-react";
import { useToast, ToastContainer } from "@/components/Toast";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

// Dados mockados
const mockContentData = {
  recipient: {
    name: "Maria Silva",
  },
  limits: {
    photos: 40,
    videos: 2,
    messages: 5,
    albums: 4,
    photosPerAlbum: 10,
  },
};

// Fetcher para SWR
const fetcher = (url: string) => api.get(url).then((res) => res.data);

// Interfaces para tipagem
interface ContentResponse {
  error: boolean;
  messages: string[];
  results: {
    data: {
      photos: {
        album_1: any[];
        album_2: any[];
        album_3: any[];
        album_4: any[];
      };
      videos: any[];
      messages: any[];
    };
    counts: {
      photos: {
        total: number;
        album_1: number;
        album_2: number;
        album_3: number;
        album_4: number;
      };
      videos: number;
      messages: number;
    };
    total_contents: number;
  };
}

function CreateVaultContentPage() {
  const { addToast, toasts } = useToast();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const vaultId = searchParams.get("vaultId");
  const [currentTab, setCurrentTab] = useState("photos");
  const [currentAlbum, setCurrentAlbum] = useState(1);
  const [albumTitles, setAlbumTitles] = useState<{ [key: number]: string }>({
    1: "",
    2: "",
    3: "",
    4: "",
  });
  // Estados de IA temporariamente comentados
  // const [showGeneratedScript, setShowGeneratedScript] = useState(false);
  // const [generatedScript, setGeneratedScript] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [planos, setPlanos] = useState<any[]>([]);
  const [loadingPlanos, setLoadingPlanos] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [vaultData, setVaultData] = useState<any>(null);
  const [isLoadingVault, setIsLoadingVault] = useState(true);
  const [photoTitle, setPhotoTitle] = useState("");
  const [photoContent, setPhotoContent] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoContent, setVideoContent] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [showImageModal, setShowImageModal] = useState(false);

  // SWR para buscar conteúdos do cofre
  const { data: contentData, mutate: mutateContent } = useSWR<ContentResponse>(
    vaultId ? `/digital-vaults/${vaultId}/contents` : null,
    fetcher
  );

  // Calcular totais dinâmicos baseados na API
  const totalPhotos = contentData?.results?.counts?.photos?.total || 0;
  const totalVideos = contentData?.results?.counts?.videos || 0;
  const totalMessages = contentData?.results?.counts?.messages || 0;

  const handleTabSwitch = (tab: string) => {
    setCurrentTab(tab);
  };

  const handleAlbumSwitch = (albumNum: number) => {
    setCurrentAlbum(albumNum);
  };

  const handlePhotoUpload = async (files: FileList) => {
    if (!vaultId) {
      addToast({
        type: "error",
        title: "Erro",
        message: "ID do cofre não encontrado.",
      });
      return;
    }

    const fileArray = Array.from(files);

    const currentAlbumCount =
      contentData?.results?.counts?.photos?.[
        `album_${currentAlbum}` as keyof typeof contentData.results.counts.photos
      ] || 0;
    if (
      currentAlbumCount + fileArray.length >
      mockContentData.limits.photosPerAlbum
    ) {
      addToast({
        type: "warning",
        title: "Limite de fotos excedido",
        message: `Máximo ${mockContentData.limits.photosPerAlbum} fotos por álbum!`,
      });
      return;
    }

    setIsUploading(true);

    try {
      for (const file of fileArray) {
        if (file.size > 5 * 1024 * 1024) {
          addToast({
            type: "error",
            title: "Arquivo muito grande",
            message: `${file.name} excede o limite de 5MB por foto.`,
          });
          continue;
        }

        const formData = new FormData();
        formData.append("type", "photo");
        formData.append("title", photoTitle.trim() || file.name);
        formData.append(
          "content",
          photoContent.trim() || `Foto do álbum ${currentAlbum}`
        );
        formData.append("album_number", currentAlbum.toString());
        formData.append("order", currentAlbumCount.toString());
        formData.append("file", file);

        const response = await api.post(
          `/digital-vaults/${vaultId}/contents`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.error === false) {
          // Atualizar dados da API
          mutateContent();

          addToast({
            type: "success",
            title: "Foto enviada",
            message: `${file.name} foi enviada com sucesso!`,
          });
        }
      }
    } catch (error: any) {
      addToast({
        type: "error",
        title: "Erro no upload",
        message: error.response.data.messages[0],
      });
    } finally {
      setIsUploading(false);
      // Limpar campos após upload
      setPhotoTitle("");
      setPhotoContent("");
    }
  };

  const handleVideoUpload = async (files: FileList) => {
    if (!vaultId) {
      addToast({
        type: "error",
        title: "Erro",
        message: "ID do cofre não encontrado.",
      });
      return;
    }

    const fileArray = Array.from(files);

    if (totalVideos + fileArray.length > mockContentData.limits.videos) {
      addToast({
        type: "warning",
        title: "Limite de vídeos excedido",
        message: `Máximo ${mockContentData.limits.videos} vídeos!`,
      });
      return;
    }

    setIsUploading(true);

    try {
      for (const file of fileArray) {
        if (file.size > 100 * 1024 * 1024) {
          addToast({
            type: "error",
            title: "Arquivo muito grande",
            message: `${file.name} excede o limite de 100MB por vídeo.`,
          });
          continue;
        }

        const formData = new FormData();
        formData.append("type", "video");
        formData.append("title", videoTitle.trim() || file.name);
        formData.append("content", videoContent.trim() || "Vídeo especial");
        formData.append("album_number", "1");
        formData.append("order", totalVideos.toString());
        formData.append("file", file);

        const response = await api.post(
          `/digital-vaults/${vaultId}/contents`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.error === false) {
          // Atualizar dados da API
          mutateContent();

          addToast({
            type: "success",
            title: "Vídeo enviado",
            message: `${file.name} foi enviado com sucesso!`,
          });
        }
      }
    } catch (error: any) {
      addToast({
        type: "error",
        title: "Erro no upload",
        message: error.response.data.messages[0],
      });
    } finally {
      setIsUploading(false);
      // Limpar campos após upload
      setVideoTitle("");
      setVideoContent("");
    }
  };

  const handleDeleteContent = async (contentId: number, type: string) => {
    if (!vaultId) {
      addToast({
        type: "error",
        title: "Erro",
        message: "ID do cofre não encontrado.",
      });
      return;
    }

    try {
      const response = await api.delete(
        `/digital-vaults/${vaultId}/contents/${contentId}`
      );

      if (response.data.error === false) {
        // Atualizar dados da API
        mutateContent();

        addToast({
          type: "success",
          title: "Conteúdo excluído",
          message: response.data.messages[0],
        });
      }
    } catch {
      addToast({
        type: "error",
        title: "Erro ao excluir",
        message: "Não foi possível excluir o conteúdo. Tente novamente.",
      });
    }
  };

  const handleViewVideo = (video: any) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  const handleViewImage = (image: any) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  const handleAddMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vaultId) {
      addToast({
        type: "error",
        title: "Erro",
        message: "ID do cofre não encontrado.",
      });
      return;
    }

    const title = (document.getElementById("messageTitle") as HTMLInputElement)
      ?.value;
    const content = (
      document.getElementById("messageContent") as HTMLTextAreaElement
    )?.value;
    const deliveryDate = (
      document.getElementById("messageDeliveryDate") as HTMLInputElement
    )?.value;

    if (!title?.trim() || !content?.trim()) {
      addToast({
        type: "warning",
        title: "Campos obrigatórios",
        message: "Título e conteúdo são obrigatórios.",
      });
      return;
    }

    if (totalMessages >= mockContentData.limits.messages) {
      addToast({
        type: "warning",
        title: "Limite de mensagens excedido",
        message: `Máximo ${mockContentData.limits.messages} mensagens!`,
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("type", "message");
      formData.append("title", title.trim());
      formData.append("content", content.trim());
      formData.append("album_number", "1");
      formData.append("order", totalMessages.toString());
      if (deliveryDate) {
        formData.append("scheduled_delivery_date", deliveryDate);
      }

      const response = await api.post(
        `/digital-vaults/${vaultId}/contents`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.error === false) {
        // Limpar o formulário
        (document.getElementById("messageTitle") as HTMLInputElement).value =
          "";
        (
          document.getElementById("messageContent") as HTMLTextAreaElement
        ).value = "";
        (
          document.getElementById("messageDeliveryDate") as HTMLInputElement
        ).value = "";

        // Atualizar dados da API
        mutateContent();

        addToast({
          type: "success",
          title: "Mensagem salva",
          message: "Mensagem foi salva com sucesso!",
        });
      }
    } catch (error: any) {
      addToast({
        type: "error",
        title: "Erro ao salvar",
        message: error.response.data.messages[0],
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Função de IA temporariamente comentada
  // const handleGenerateScript = () => {
  //   const videoType = (document.getElementById('videoType') as HTMLSelectElement)?.value;

  //   if (!videoType) {
  //     addToast({
  //       type: 'warning',
  //       title: 'Tipo de vídeo não selecionado',
  //       message: 'Por favor, selecione o tipo de vídeo antes de continuar.'
  //     });
  //     return;
  //   }

  //   const scripts: { [key: string]: string } = {
  //     birthday: `Olá minha querida! Hoje é um dia muito especial - seu aniversário! 🎉

  // Quero que você saiba o quanto você significa para mim. Cada ano que passa, vejo você crescer e se tornar uma pessoa ainda mais incrível.

  // Lembro-me de quando você era pequena e sempre sonhava em... [personalize com suas memórias]

  // Meus desejos para você neste novo ano de vida:
  // - Que você continue sendo essa pessoa maravilhosa
  // - Que realize todos os seus sonhos
  // - Que seja sempre feliz e saudável

  // Parabéns, meu amor! Você merece toda a felicidade do mundo! ❤️`,

  //     advice: `Minha querida, quero compartilhar alguns conselhos que aprendi ao longo da vida:

  // 1. Seja sempre verdadeira consigo mesma
  // 2. Nunca tenha medo de sonhar grande
  // 3. Trate as pessoas com gentileza e respeito
  // 4. Aprenda com os erros, eles são seus professores
  // 5. Valorize as pequenas coisas da vida

  // Lembre-se: você é mais forte do que imagina e capaz de superar qualquer desafio. Confie em si mesma e siga seu coração.

  // Estarei sempre torcendo por você, onde quer que eu esteja. ❤️`,

  //     memories: `Quero compartilhar algumas das minhas memórias mais preciosas com você...

  // Lembro-me de quando... [personalize com suas memórias específicas]

  // Esses momentos são tesouros que guardo no coração. Cada risada, cada conversa, cada abraço - tudo isso faz parte de quem somos.

  // Obrigado(a) por me dar tantas memórias lindas para guardar. Você tornou minha vida muito mais especial e cheia de amor.

  // Continue criando memórias maravilhosas! ❤️`
  //   };

  //   const script = scripts[videoType] || 'Script personalizado será gerado baseado nos detalhes fornecidos...';
  //   setGeneratedScript(script);
  //   setShowGeneratedScript(true);
  // };

  const handleFinalizeVault = () => {
    if (totalPhotos === 0 && totalVideos === 0 && totalMessages === 0) {
      addToast({
        type: "warning",
        title: "Cofre vazio",
        message:
          "Adicione pelo menos um conteúdo (foto, vídeo ou mensagem) antes de finalizar.",
      });
      return;
    }

    // Verificar se há assinatura ativa
    if (!user?.assinatura?.possui || user.assinatura.status !== "ativa") {
      addToast({
        type: "warning",
        title: "Assinatura necessária",
        message: "Você precisa de uma assinatura ativa para finalizar o cofre.",
      });
      handleOpenUpgradeModal();
      return;
    }

    setShowConfirmationModal(true);
  };

  const handleConfirmFinalize = async () => {
    setIsFinalizing(true);

    try {
      // Simular processamento
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setShowConfirmationModal(false);

      // Redirecionar para página de finalização
      window.location.href = `/dashboard/criar-cofre-finalizar?vaultId=${vaultId}`;
    } catch {
      addToast({
        type: "error",
        title: "Erro ao finalizar",
        message: "Ocorreu um erro ao finalizar o cofre. Tente novamente.",
      });
    } finally {
      setIsFinalizing(false);
    }
  };

  const handleCancelFinalize = () => {
    setShowConfirmationModal(false);
  };

  const fetchPlanos = async () => {
    try {
      setLoadingPlanos(true);
      const response = await api.get("/planos");

      if (response.data.error === false && response.data.results) {
        setPlanos(response.data.results);
      }
    } catch (error) {
      console.error("Erro ao buscar planos:", error);
      addToast({
        type: "error",
        title: "Erro ao carregar planos",
        message: "Não foi possível carregar os planos disponíveis.",
      });
    } finally {
      setLoadingPlanos(false);
    }
  };

  const handleUpgradePlan = (plano: any) => {
    window.open(plano.url_assinatura, "_blank");
    setShowUpgradeModal(false);
  };

  const handleOpenUpgradeModal = () => {
    if (planos.length === 0) {
      fetchPlanos();
    }
    setShowUpgradeModal(true);
  };

  // Buscar dados do cofre para obter destinatários
  useEffect(() => {
    const fetchVaultData = async () => {
      if (!vaultId) {
        setIsLoadingVault(false);
        return;
      }

      try {
        setIsLoadingVault(true);
        const response = await api.get(`/digital-vaults/${vaultId}`);

        if (response.data.error === false) {
          setVaultData(response.data.results);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do cofre:", error);
      } finally {
        setIsLoadingVault(false);
      }
    };

    fetchVaultData();
  }, [vaultId]);

  // Loading state para dados do cofre
  if (isLoadingVault || !contentData) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados do cofre...</p>
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
              <p className="text-white/80 text-sm">Criar Conteúdo do Cofre</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-white/80">Destinatário(s):</p>
              <p className="font-semibold">
                {isLoadingVault
                  ? "Carregando..."
                  : vaultData?.recipients?.length > 0
                  ? vaultData.recipients.map((r: any) => r.full_name).join(", ")
                  : "Nenhum destinatário"}
              </p>
            </div>
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

      {/* Progress Steps */}
      <section className="py-6 px-4 bg-white border-b">
        <div className="max-w-4xl mx-auto flex items-center justify-center space-x-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold">
              <Check className="w-5 h-5" />
            </div>
            <span className="font-medium text-gray-900">Configuração</span>
          </div>
          <div className="w-16 h-1 bg-green-500 rounded"></div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold">
              2
            </div>
            <span className="font-medium text-gray-900">Conteúdo</span>
          </div>
          <div className="w-16 h-1 bg-gray-200 rounded"></div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold">
              3
            </div>
            <span className="font-medium text-gray-900">Finalizar</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              📝 Criar Conteúdo do Cofre
            </h2>
            <p className="text-xl text-gray-600">
              Adicione fotos, vídeos e mensagens especiais para{" "}
              {isLoadingVault
                ? "os destinatários"
                : vaultData?.recipients?.length > 0
                ? vaultData.recipients.map((r: any) => r.full_name).join(", ")
                : "os destinatários"}
            </p>
          </div>

          {/* Content Tabs */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="border-b">
              <nav className="flex">
                <button
                  onClick={() => handleTabSwitch("photos")}
                  className={`flex-1 py-4 px-6 text-center font-medium border-b-2 transition-colors ${
                    currentTab === "photos"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent hover:text-blue-600 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Image className="w-5 h-5" />
                    <span>Fotos</span>
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {totalPhotos}/{mockContentData.limits.photos}
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => handleTabSwitch("videos")}
                  className={`flex-1 py-4 px-6 text-center font-medium border-b-2 transition-colors ${
                    currentTab === "videos"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent hover:text-blue-600 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Video className="w-5 h-5" />
                    <span>Vídeos</span>
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {totalVideos}/{mockContentData.limits.videos}
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => handleTabSwitch("messages")}
                  className={`flex-1 py-4 px-6 text-center font-medium border-b-2 transition-colors ${
                    currentTab === "messages"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent hover:text-blue-600 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <MessageCircle className="w-5 h-5" />
                    <span>Mensagens</span>
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {totalMessages}/{mockContentData.limits.messages}
                    </span>
                  </div>
                </button>
              </nav>
            </div>

            {/* Photos Tab */}
            {currentTab === "photos" && (
              <div className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    📸 Álbuns de Fotos
                  </h3>
                  <p className="text-gray-600">
                    Organize suas fotos em até 4 álbuns, com 10 fotos cada
                  </p>
                </div>

                {/* Album Tabs */}
                <div className="flex space-x-2 mb-6">
                  {[1, 2, 3, 4].map((albumNum) => (
                    <button
                      key={albumNum}
                      onClick={() => handleAlbumSwitch(albumNum)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        currentAlbum === albumNum
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Álbum {albumNum}{" "}
                      <span className="text-xs">
                        (
                        {contentData?.results?.counts?.photos?.[
                          `album_${albumNum}` as keyof typeof contentData.results.counts.photos
                        ] || 0}
                        /10)
                      </span>
                    </button>
                  ))}
                </div>

                {/* Album Content */}
                <div>
                  {/* Campos de título e conteúdo para fotos */}
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título das fotos (opcional)
                      </label>
                      <input
                        type="text"
                        value={photoTitle}
                        onChange={(e) => setPhotoTitle(e.target.value)}
                        placeholder="Ex: Memórias da infância"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descrição das fotos (opcional)
                      </label>
                      <input
                        type="text"
                        value={photoContent}
                        onChange={(e) => setPhotoContent(e.target.value)}
                        placeholder="Ex: Momentos especiais que quero compartilhar"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Upload Area */}
                  <div
                    className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-8 text-center mb-6 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300"
                    onDrop={(e) => {
                      e.preventDefault();
                      handlePhotoUpload(e.dataTransfer.files);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDragLeave={(e) => e.preventDefault()}
                  >
                    <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      Arraste suas fotos aqui
                    </h4>
                    <p className="text-gray-500 mb-4">
                      ou clique para selecionar arquivos
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      id="photoInput"
                      onChange={(e) =>
                        e.target.files && handlePhotoUpload(e.target.files)
                      }
                    />
                    <button
                      onClick={() =>
                        document.getElementById("photoInput")?.click()
                      }
                      disabled={isUploading}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {isUploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Enviando...</span>
                        </>
                      ) : (
                        <span>Selecionar Fotos</span>
                      )}
                    </button>
                    <p className="text-xs text-gray-400 mt-2">
                      Máximo 10 fotos por álbum • JPG, PNG • Até 5MB cada
                    </p>
                  </div>

                  {/* Fotos Salvas da API */}
                  {contentData?.results?.data?.photos?.[
                    `album_${currentAlbum}` as keyof typeof contentData.results.data.photos
                  ]?.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        📸 Fotos Salvas - Álbum {currentAlbum}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {contentData.results.data.photos[
                          `album_${currentAlbum}` as keyof typeof contentData.results.data.photos
                        ].map((photo: any) => (
                          <div
                            key={photo.id}
                            className="relative group bg-white rounded-lg overflow-hidden aspect-square border border-gray-200"
                          >
                            <img
                              src={photo.file_url}
                              alt={photo.title || "Foto do cofre"}
                              className="w-full h-full object-contain"
                            />
                            <div className="absolute top-2 right-2 flex space-x-1">
                              <button
                                onClick={() => handleViewImage(photo)}
                                className="bg-green-500 text-white rounded-full p-1 hover:bg-green-600 transition-colors"
                                title="Visualizar foto"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteContent(photo.id, "photo")
                                }
                                className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                title="Excluir foto"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2">
                              <p className="text-xs truncate">{photo.title}</p>
                              <p className="text-xs text-gray-300">
                                {photo.file_size_human}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Videos Tab */}
            {currentTab === "videos" && (
              <div className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    🎥 Vídeos Especiais
                  </h3>
                  <p className="text-gray-600">
                    Adicione até 2 vídeos especiais para o destinatário
                  </p>
                </div>

                {/* Campos de título e conteúdo para vídeos */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título dos vídeos (opcional)
                    </label>
                    <input
                      type="text"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      placeholder="Ex: Mensagem especial de aniversário"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição dos vídeos (opcional)
                    </label>
                    <input
                      type="text"
                      value={videoContent}
                      onChange={(e) => setVideoContent(e.target.value)}
                      placeholder="Ex: Um vídeo especial para você"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Upload Area */}
                <div
                  className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-8 text-center mb-6 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300"
                  onDrop={(e) => {
                    e.preventDefault();
                    handleVideoUpload(e.dataTransfer.files);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDragLeave={(e) => e.preventDefault()}
                >
                  <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Arraste seus vídeos aqui
                  </h4>
                  <p className="text-gray-500 mb-4">
                    ou clique para selecionar arquivos
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="video/*"
                    className="hidden"
                    id="videoInput"
                    onChange={(e) =>
                      e.target.files && handleVideoUpload(e.target.files)
                    }
                  />
                  <button
                    onClick={() =>
                      document.getElementById("videoInput")?.click()
                    }
                    disabled={isUploading}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <span>Selecionar Vídeos</span>
                    )}
                  </button>
                  <p className="text-xs text-gray-400 mt-2">
                    Máximo 2 vídeos • MP4, MOV • Até 100MB cada
                  </p>
                </div>

                {/* Videos List - API Data */}
                {contentData?.results?.data?.videos?.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      🎥 Vídeos Salvos
                    </h4>
                    <div className="space-y-4">
                      {contentData.results.data.videos.map((video: any) => (
                        <div
                          key={video.id}
                          className="bg-white rounded-lg p-4 border border-gray-200"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Video className="w-8 h-8 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">
                                {video.title}
                              </h5>
                              <p className="text-sm text-gray-600">
                                {video.content}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {video.file_name} • {video.file_size_human}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewVideo(video)}
                                className="text-blue-500 hover:text-blue-700 p-2"
                                title="Visualizar vídeo"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteContent(video.id, "video")
                                }
                                className="text-red-500 hover:text-red-700 p-2"
                                title="Excluir vídeo"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Script Generator - Temporariamente comentado */}
                {/* <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 mt-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">🤖 Assistente de Script com IA</h4>
                  </div>
                  <p className="text-gray-600 mb-4">Precisa de ajuda para criar um roteiro para seu vídeo? Nossa IA pode ajudar!</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Que tipo de vídeo você quer criar?</label>
                      <select id="videoType" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        <option value="">Selecione o tipo...</option>
                        <option value="birthday">Mensagem de aniversário</option>
                        <option value="advice">Conselhos para a vida</option>
                        <option value="memories">Compartilhar memórias</option>
                        <option value="love">Declaração de amor</option>
                        <option value="farewell">Mensagem de despedida</option>
                        <option value="custom">Personalizado</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Detalhes adicionais (opcional)</label>
                      <textarea 
                        id="videoDetails"
                        rows={3} 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                        placeholder="Ex: Quero falar sobre nossa viagem para Paris em 2020, mencionar o restaurante onde comemos..."
                      />
                    </div>
                    
                    <button 
                      onClick={handleGenerateScript}
                      className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Gerar Script com IA</span>
                    </button>
                  </div>
                  
                  {showGeneratedScript && (
                    <div className="mt-6 p-4 bg-white rounded-lg border">
                      <h5 className="font-medium text-gray-900 mb-2">📝 Script Gerado:</h5>
                      <div className="text-gray-700 whitespace-pre-line">{generatedScript}</div>
                      <div className="flex items-center space-x-2 mt-4">
                        <button 
                          onClick={() => navigator.clipboard.writeText(generatedScript)}
                          className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
                        >
                          Copiar Script
                        </button>
                        <button 
                          onClick={handleGenerateScript}
                          className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded hover:bg-purple-200 transition-colors"
                        >
                          Gerar Novo
                        </button>
                      </div>
                    </div>
                  )}
                </div> */}
              </div>
            )}

            {/* Messages Tab */}
            {currentTab === "messages" && (
              <div className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    💌 Mensagens Especiais
                  </h3>
                  <p className="text-gray-600">
                    Escreva até 5 mensagens especiais para o destinatário
                  </p>
                </div>

                {/* Messages List - API Data */}
                {contentData?.results?.data?.messages?.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      📝 Mensagens Salvas
                    </h4>
                    <div className="space-y-4">
                      {contentData.results.data.messages.map((message: any) => (
                        <div
                          key={message.id}
                          className="bg-white rounded-lg p-6 border border-gray-200"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-medium text-gray-900">
                              {message.title}
                            </h4>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">
                                {message.scheduled_delivery_date
                                  ? `Entrega: ${new Date(
                                      message.scheduled_delivery_date
                                    ).toLocaleDateString("pt-BR")}`
                                  : `Criada: ${new Date(
                                      message.created_at
                                    ).toLocaleDateString("pt-BR")}`}
                              </span>
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                Salvo
                              </span>
                              <button
                                onClick={() =>
                                  handleDeleteContent(message.id, "message")
                                }
                                className="text-red-500 hover:text-red-700 p-1"
                                title="Excluir mensagem"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="text-gray-700 whitespace-pre-line">
                            {message.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add New Message Form */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    ✏️ Adicionar Nova Mensagem
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <form onSubmit={handleAddMessage}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Título da mensagem
                          </label>
                          <input
                            type="text"
                            id="messageTitle"
                            placeholder="Ex: Mensagem de aniversário"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Conteúdo da mensagem
                          </label>
                          <textarea
                            id="messageContent"
                            rows={6}
                            placeholder="Escreva sua mensagem especial aqui..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isUploading}
                          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          {isUploading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Salvando...</span>
                            </>
                          ) : (
                            <>
                              <MessageCircle className="w-5 h-5" />
                              <span>Salvar Mensagem</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </button>

            <div className="flex items-center space-x-4">
              <button
                onClick={() =>
                  window.open(`/dashboard/cofre?vaultId=${vaultId}`, "_blank")
                }
                disabled={!vaultId}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Eye className="w-5 h-5" />
                <span>Visualizar Cofre</span>
              </button>

              <button
                onClick={handleFinalizeVault}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
              >
                <span>Finalizar Cofre</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={handleCancelFinalize}
        onConfirm={handleConfirmFinalize}
        title="Finalizar Cofre"
        message="Tem certeza que deseja finalizar o cofre? Após finalizar, ele será enviado para o destinatário."
        confirmText="Sim, Finalizar"
        cancelText="Cancelar"
        type="warning"
        isLoading={isFinalizing}
      />

      {/* Upgrade Plans Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">
                  🚀 Escolha seu Plano
                </h3>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
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
                          ? "border-green-400 bg-gradient-to-r from-green-50 to-emerald-50 ring-2 ring-green-200"
                          : "border-gray-300 bg-white hover:border-indigo-400"
                      }`}
                      style={{
                        borderColor: plano.mais_popular ? undefined : plano.cor,
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${plano.cor}20` }}
                          >
                            {plano.mais_popular ? (
                              <Star
                                className="w-5 h-5"
                                style={{ color: plano.cor }}
                              />
                            ) : (
                              <Crown
                                className="w-5 h-5"
                                style={{ color: plano.cor }}
                              />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="text-xl font-bold text-gray-900">
                                {plano.titulo}
                              </h4>
                              {plano.mais_popular && (
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                                  Mais Popular
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600">
                              {plano.destinatarios === 999
                                ? "Destinatários ilimitados"
                                : `Até ${plano.destinatarios} destinatários`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            R$ {plano.preco.toFixed(2).replace(".", ",")}
                          </p>
                          <p className="text-sm text-gray-500">/mês</p>
                        </div>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-center space-x-2">
                          <Check
                            className="w-4 h-4"
                            style={{ color: plano.cor }}
                          />
                          <span>
                            {plano.destinatarios === 999
                              ? "Destinatários ilimitados"
                              : `Até ${plano.destinatarios} destinatários`}
                          </span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check
                            className="w-4 h-4"
                            style={{ color: plano.cor }}
                          />
                          <span>Cofres ilimitados</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check
                            className="w-4 h-4"
                            style={{ color: plano.cor }}
                          />
                          <span>Suporte prioritário</span>
                        </li>
                        {plano.id === 3 && (
                          <li className="flex items-center space-x-2">
                            <Check
                              className="w-4 h-4"
                              style={{ color: plano.cor }}
                            />
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
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && selectedVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
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

              {selectedVideo.content && (
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Descrição
                  </h4>
                  <p className="text-gray-700 break-words">
                    {selectedVideo.content}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="truncate">{selectedVideo.file_name}</span>
                <span className="ml-2">{selectedVideo.file_size_human}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 truncate pr-4">
                  📸 {selectedImage.title}
                </h3>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="bg-black rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                <img
                  src={selectedImage.file_url}
                  alt={selectedImage.title || "Imagem do cofre"}
                  className="max-w-full max-h-[60vh] object-contain"
                />
              </div>

              {selectedImage.content && (
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Descrição
                  </h4>
                  <p className="text-gray-700 break-words">
                    {selectedImage.content}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="truncate">{selectedImage.file_name}</span>
                <span className="ml-2">{selectedImage.file_size_human}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}

export default function CreateVaultContentPageWrapper() {
  return (
    <Suspense fallback={
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <CreateVaultContentPage />
    </Suspense>
  );
}
