'use client';

import { useState } from 'react';
import { Heart, MailOpen, Calendar, User, MessageCircle, Image, Video, Download, DownloadCloud, ArrowRight, Play, ZoomIn, X, Check } from 'lucide-react';

// Dados mockados para o cofre digital
const mockVaultData = {
  recipient: {
    name: 'Maria Silva',
    creator: 'João Silva',
    createdDate: '15/01/2024'
  },
  stats: {
    messages: 5,
    photos: 12,
    videos: 3
  },
  messages: [
    {
      id: 1,
      title: 'Para minha filha querida',
      date: '15 de Janeiro, 2024',
      preview: '"Minha querida Maria, se você está lendo isso, saiba que você foi a maior alegria da minha vida. Cada sorriso seu iluminou meus dias, e cada conquista sua encheu meu coração de orgulho..."',
      content: `Minha querida Maria,

Se você está lendo isso, saiba que você foi a maior alegria da minha vida. Cada sorriso seu iluminou meus dias, e cada conquista sua encheu meu coração de orgulho.

Lembro-me de quando você era pequena e corria pela casa com aquele sorriso travesso. Você sempre foi especial, sempre teve essa luz única que fazia todos ao seu redor se sentirem melhor.

Quero que saiba que, mesmo não estando mais fisicamente presente, meu amor por você é eterno. Ele vive em cada memória que construímos juntos, em cada lição que tentei te ensinar, e em cada momento de felicidade que compartilhamos.

Seja forte, seja corajosa, mas acima de tudo, seja você mesma. O mundo precisa da sua luz, da sua bondade e do seu amor.

Te amo para sempre,
Papai 💕`,
      icon: Heart,
      color: 'pink'
    },
    {
      id: 2,
      title: 'Conselhos para a vida',
      date: '20 de Janeiro, 2024',
      preview: '"Filha, quero compartilhar alguns conselhos que aprendi ao longo da vida. Primeiro, nunca tenha medo de sonhar grande. Segundo, seja sempre gentil com as pessoas..."',
      content: `Minha filha querida,

Quero compartilhar alguns conselhos que aprendi ao longo da vida:

1. Nunca tenha medo de sonhar grande. Seus sonhos são válidos e possíveis.

2. Seja sempre gentil com as pessoas. A gentileza é uma força poderosa que pode mudar o mundo.

3. Não tenha medo de falhar. Os erros são oportunidades de aprendizado e crescimento.

4. Valorize suas amizades verdadeiras. Elas são tesouros raros na vida.

5. Sempre seja grata pelo que tem, mas nunca pare de lutar pelo que quer.

6. Cuide da sua saúde física e mental. Elas são seus bens mais preciosos.

7. Ame com intensidade, mas também saiba se proteger.

8. Seja independente, mas nunca tenha medo de pedir ajuda quando precisar.

Lembre-se: você é capaz de tudo que se propuser a fazer.

Com todo meu amor,
Papai`,
      icon: Check,
      color: 'blue'
    },
    {
      id: 3,
      title: 'Para seu casamento',
      date: 'Entrega programada',
      preview: '"No dia do seu casamento, quero que saiba o quanto estou feliz por você ter encontrado o amor. Lembro-me de quando você era pequena e sonhava com este dia..."',
      content: `Minha querida filha,

No dia do seu casamento, quero que saiba o quanto estou feliz por você ter encontrado o amor. Lembro-me de quando você era pequena e sonhava com este dia, imaginando como seria seu vestido e como seria o homem que conquistaria seu coração.

Hoje, vendo você realizar esse sonho, meu coração se enche de alegria e orgulho. Você cresceu e se tornou uma mulher incrível, forte, inteligente e cheia de amor para dar.

Alguns conselhos para sua nova jornada:

- O casamento é uma parceria. Sejam companheiros em todas as situações.
- A comunicação é a base de tudo. Conversem sempre, sobre tudo.
- Nunca durmam brigados. Resolvam os problemas com amor e paciência.
- Mantenham viva a paixão, mas construam também uma amizade sólida.
- Apoiem os sonhos um do outro e cresçam juntos.

Que vocês sejam muito felizes e que construam uma família cheia de amor, risadas e cumplicidade.

Estarei sempre com vocês, em cada momento especial, em cada desafio, em cada alegria.

Te amo infinitamente,
Papai 💕

P.S.: No cofre há uma surpresa especial para vocês dois. Procurem pela pasta "Presente de Casamento".`,
      icon: Heart,
      color: 'green'
    }
  ],
  photos: [
    {
      id: 1,
      title: 'Primeiro dia de aula',
      gradient: 'from-pink-200 to-purple-300'
    },
    {
      id: 2,
      title: 'Aniversário de 10 anos',
      gradient: 'from-blue-200 to-cyan-300'
    },
    {
      id: 3,
      title: 'Viagem em família',
      gradient: 'from-green-200 to-emerald-300'
    },
    {
      id: 4,
      title: 'Formatura',
      gradient: 'from-yellow-200 to-orange-300'
    }
  ],
  videos: [
    {
      id: 1,
      title: 'Mensagem de aniversário',
      description: 'Uma mensagem especial para o seu aniversário de 18 anos',
      duration: '2:30 min',
      gradient: 'from-purple-400 to-pink-500'
    },
    {
      id: 2,
      title: 'Conselhos para a vida',
      description: 'Palavras de sabedoria para te guiar sempre',
      duration: '5:15 min',
      gradient: 'from-blue-400 to-cyan-500'
    },
    {
      id: 3,
      title: 'Memórias da infância',
      description: 'Lembranças especiais dos seus primeiros anos',
      duration: '3:45 min',
      gradient: 'from-green-400 to-emerald-500'
    }
  ]
};

export default function VaultPage() {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

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

  const handleDownloadAll = () => {
    console.log('Baixando todo o cofre...');
    // Implementar lógica de download completo
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
              <p className="text-white/80 text-sm">Destinatário:</p>
              <p className="font-semibold">{mockVaultData.recipient.name}</p>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Olá, {mockVaultData.recipient.name}! 💕
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Alguém muito especial deixou estas mensagens, fotos e vídeos para você. 
              Cada item foi criado com muito amor e carinho. Explore seu cofre digital 
              e guarde essas memórias para sempre.
            </p>
            <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Criado em: {mockVaultData.recipient.createdDate}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>De: {mockVaultData.recipient.creator}</span>
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
                  <p className="text-3xl font-bold">{mockVaultData.stats.messages}</p>
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
                  <p className="text-3xl font-bold">{mockVaultData.stats.photos}</p>
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
                  <p className="text-3xl font-bold">{mockVaultData.stats.videos}</p>
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
            <h2 className="text-3xl font-bold text-gray-900">💌 Mensagens para Você</h2>
            <button 
              onClick={() => handleDownloadAll()}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Baixar Todas</span>
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {mockVaultData.messages.map((message) => {
              const IconComponent = message.icon;
              return (
                <div key={message.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-${message.color}-100 rounded-full flex items-center justify-center`}>
                        <IconComponent className={`w-5 h-5 text-${message.color}-600`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{message.title}</h3>
                        <p className="text-sm text-gray-500">{message.date}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDownload('mensagem', message)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {message.preview}
                  </p>
                  <button 
                    onClick={() => handleOpenMessage(message)}
                    className="text-purple-600 hover:text-purple-800 font-medium flex items-center space-x-1"
                  >
                    <span>Ler mensagem completa</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Photos Section */}
      <section className="py-8 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">📸 Álbum de Memórias</h2>
            <button 
              onClick={() => handleDownloadAll()}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Baixar Todas</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockVaultData.photos.map((photo) => (
              <div 
                key={photo.id}
                className="relative group cursor-pointer" 
                onClick={() => handleOpenPhoto(photo)}
              >
                <div className={`aspect-square bg-gradient-to-br ${photo.gradient} rounded-xl overflow-hidden`}>
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="w-12 h-12 text-white/80" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all rounded-xl flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-8 h-8 text-white" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2 text-center">{photo.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">🎥 Vídeos Especiais</h2>
            <button 
              onClick={() => handleDownloadAll()}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Baixar Todos</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockVaultData.videos.map((video) => (
              <div key={video.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div 
                  className={`aspect-video bg-gradient-to-br ${video.gradient} flex items-center justify-center cursor-pointer`}
                  onClick={() => handleOpenVideo(video)}
                >
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{video.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{video.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{video.duration}</span>
                    <button 
                      onClick={() => handleDownload('vídeo', video)}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      <Download className="w-4 h-4" />
                    </button>
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
              Guarde todas essas memórias especiais no seu dispositivo para sempre
            </p>
            <button 
              onClick={handleDownloadAll}
              className="bg-white text-purple-600 px-8 py-4 text-lg font-semibold rounded-xl hover:bg-gray-100 transition-colors flex items-center space-x-3 mx-auto"
            >
              <DownloadCloud className="w-6 h-6" />
              <span>Baixar Tudo (ZIP - 245 MB)</span>
            </button>
            <p className="text-white/70 text-sm mt-4">
              Inclui todas as mensagens, fotos e vídeos em alta qualidade
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
            Este cofre digital foi criado com muito amor e carinho especialmente para você.
          </p>
          <p className="text-gray-500 text-xs">
            © 2024 LegadoBox. Preservando memórias, conectando corações.
          </p>
        </div>
      </footer>

      {/* Message Modal */}
      {showMessageModal && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedMessage.title}</h3>
                  <p className="text-gray-500">{selectedMessage.date}</p>
                </div>
              </div>
              <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                {selectedMessage.content}
              </div>
              <div className="mt-8 flex justify-end space-x-4">
                <button 
                  onClick={() => setShowMessageModal(false)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800"
                >
                  Fechar
                </button>
                <button 
                  onClick={() => handleDownload('mensagem', selectedMessage)}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Baixar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Photo Modal */}
      {showPhotoModal && selectedPhoto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-black rounded-2xl max-w-2xl w-full">
            <div className="p-4">
              <div className={`aspect-video bg-gradient-to-br ${selectedPhoto.gradient} rounded-lg flex items-center justify-center`}>
                <Image className="w-24 h-24 text-white/80" />
              </div>
              <div className="text-center mt-4">
                <h3 className="text-white text-xl font-semibold">{selectedPhoto.title}</h3>
                <button 
                  onClick={() => handleDownload('foto', selectedPhoto)}
                  className="mt-4 bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2 mx-auto"
                >
                  <Download className="w-5 h-5" />
                  <span>Baixar Foto</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && selectedVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-black rounded-2xl max-w-2xl w-full">
            <div className="p-4">
              <div className={`aspect-video bg-gradient-to-br ${selectedVideo.gradient} rounded-lg flex items-center justify-center`}>
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                  <Play className="w-12 h-12 text-white ml-1" />
                </div>
              </div>
              <div className="text-center mt-4">
                <h3 className="text-white text-xl font-semibold">{selectedVideo.title}</h3>
                <button 
                  onClick={() => handleDownload('vídeo', selectedVideo)}
                  className="mt-4 bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2 mx-auto"
                >
                  <Download className="w-5 h-5" />
                  <span>Baixar Vídeo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
