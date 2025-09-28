'use client';

import { useState, useEffect } from 'react';
import { Heart, ArrowLeft, Image, Video, MessageCircle, Plus, UploadCloud, X, Trash2, Save, Eye, ArrowRight, Sparkles, Check, Play, PlusCircle, Lightbulb, Camera, Star } from 'lucide-react';

// Dados mockados
const mockContentData = {
  recipient: {
    name: 'Maria Silva'
  },
  limits: {
    photos: 40,
    videos: 2,
    messages: 5,
    albums: 4,
    photosPerAlbum: 10
  }
};

export default function CreateVaultContentPage() {
  const [currentTab, setCurrentTab] = useState('photos');
  const [currentAlbum, setCurrentAlbum] = useState(1);
  const [photos, setPhotos] = useState<{ [key: number]: any[] }>({ 1: [], 2: [], 3: [], 4: [] });
  const [videos, setVideos] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [albumTitles, setAlbumTitles] = useState<{ [key: number]: string }>({ 1: '', 2: '', 3: '', 4: '' });
  const [showGeneratedScript, setShowGeneratedScript] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');

  const totalPhotos = Object.values(photos).reduce((sum, album) => sum + album.length, 0);

  const handleTabSwitch = (tab: string) => {
    setCurrentTab(tab);
  };

  const handleAlbumSwitch = (albumNum: number) => {
    setCurrentAlbum(albumNum);
  };

  const handlePhotoUpload = (files: FileList) => {
    const fileArray = Array.from(files);
    const currentAlbumPhotos = photos[currentAlbum] || [];
    
    if (currentAlbumPhotos.length + fileArray.length > mockContentData.limits.photosPerAlbum) {
      alert(`Máximo ${mockContentData.limits.photosPerAlbum} fotos por álbum!`);
      return;
    }

    fileArray.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert('Arquivo muito grande: ' + file.name + '. Máximo 5MB por foto.');
        return;
      }

      const reader = new FileReader();
      reader.onload = function(e) {
        const newPhoto = {
          id: Date.now() + Math.random(),
          name: file.name,
          url: e.target?.result,
          size: file.size
        };
        
        setPhotos(prev => ({
          ...prev,
          [currentAlbum]: [...(prev[currentAlbum] || []), newPhoto]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVideoUpload = (files: FileList) => {
    const fileArray = Array.from(files);
    
    if (videos.length + fileArray.length > mockContentData.limits.videos) {
      alert(`Máximo ${mockContentData.limits.videos} vídeos!`);
      return;
    }

    fileArray.forEach(file => {
      if (file.size > 100 * 1024 * 1024) {
        alert('Arquivo muito grande: ' + file.name + '. Máximo 100MB por vídeo.');
        return;
      }

      const newVideo = {
        id: Date.now() + Math.random(),
        name: file.name,
        file: file,
        size: file.size,
        title: '',
        description: ''
      };
      
      setVideos(prev => [...prev, newVideo]);
    });
  };

  const handleRemovePhoto = (albumNum: number, photoIndex: number) => {
    setPhotos(prev => ({
      ...prev,
      [albumNum]: prev[albumNum].filter((_, index) => index !== photoIndex)
    }));
  };

  const handleRemoveVideo = (videoIndex: number) => {
    setVideos(prev => prev.filter((_, index) => index !== videoIndex));
  };

  const handleRemoveMessage = (messageIndex: number) => {
    setMessages(prev => prev.filter((_, index) => index !== messageIndex));
  };

  const handleAddMessage = () => {
    if (messages.length >= mockContentData.limits.messages) {
      alert(`Máximo ${mockContentData.limits.messages} mensagens!`);
      return;
    }

    const newMessage = {
      id: Date.now(),
      title: '',
      content: '',
      deliveryDate: ''
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const handleUpdateMessage = (index: number, field: string, value: string) => {
    setMessages(prev => prev.map((msg, i) => 
      i === index ? { ...msg, [field]: value } : msg
    ));
  };

  const handleUpdateVideo = (index: number, field: string, value: string) => {
    setVideos(prev => prev.map((video, i) => 
      i === index ? { ...video, [field]: value } : video
    ));
  };

  const handleGenerateScript = () => {
    const videoType = (document.getElementById('videoType') as HTMLSelectElement)?.value;
    const videoDetails = (document.getElementById('videoDetails') as HTMLTextAreaElement)?.value;

    if (!videoType) {
      alert('Por favor, selecione o tipo de vídeo.');
      return;
    }

    const scripts: { [key: string]: string } = {
      birthday: `Olá minha querida! Hoje é um dia muito especial - seu aniversário! 🎉

Quero que você saiba o quanto você significa para mim. Cada ano que passa, vejo você crescer e se tornar uma pessoa ainda mais incrível.

Lembro-me de quando você era pequena e sempre sonhava em... [personalize com suas memórias]

Meus desejos para você neste novo ano de vida:
- Que você continue sendo essa pessoa maravilhosa
- Que realize todos os seus sonhos
- Que seja sempre feliz e saudável

Parabéns, meu amor! Você merece toda a felicidade do mundo! ❤️`,

      advice: `Minha querida, quero compartilhar alguns conselhos que aprendi ao longo da vida:

1. Seja sempre verdadeira consigo mesma
2. Nunca tenha medo de sonhar grande
3. Trate as pessoas com gentileza e respeito
4. Aprenda com os erros, eles são seus professores
5. Valorize as pequenas coisas da vida

Lembre-se: você é mais forte do que imagina e capaz de superar qualquer desafio. Confie em si mesma e siga seu coração.

Estarei sempre torcendo por você, onde quer que eu esteja. ❤️`,

      memories: `Quero compartilhar algumas das minhas memórias mais preciosas com você...

Lembro-me de quando... [personalize com suas memórias específicas]

Esses momentos são tesouros que guardo no coração. Cada risada, cada conversa, cada abraço - tudo isso faz parte de quem somos.

Obrigado(a) por me dar tantas memórias lindas para guardar. Você tornou minha vida muito mais especial e cheia de amor.

Continue criando memórias maravilhosas! ❤️`
    };

    const script = scripts[videoType] || 'Script personalizado será gerado baseado nos detalhes fornecidos...';
    setGeneratedScript(script);
    setShowGeneratedScript(true);
  };

  const handleSuggestMessage = (type: string) => {
    if (messages.length >= mockContentData.limits.messages) {
      alert(`Máximo ${mockContentData.limits.messages} mensagens!`);
      return;
    }

    const suggestions: { [key: string]: string } = {
      love: 'Minha querida, quero que você saiba que meu amor por você é infinito e incondicional. Você é a luz da minha vida e minha maior alegria...',
      advice: 'Ao longo da vida, aprendi algumas lições valiosas que gostaria de compartilhar com você. Primeiro, sempre seja verdadeira consigo mesma...',
      memories: 'Tenho tantas memórias lindas guardadas no coração. Lembro-me de quando você era pequena e sempre me perguntava sobre...',
      future: 'Meus desejos para o seu futuro são os mais belos possíveis. Que você encontre sua paixão, realize seus sonhos e seja imensamente feliz...'
    };

    const newMessage = {
      id: Date.now(),
      title: 'Mensagem Especial',
      content: suggestions[type],
      deliveryDate: ''
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSaveProgress = () => {
    const data = {
      photos: photos,
      videos: videos,
      messages: messages,
      albumTitles: albumTitles
    };
    localStorage.setItem('cofreContent', JSON.stringify(data));
    alert('Progresso salvo com sucesso!');
  };

  const handleFinalizeVault = () => {
    if (totalPhotos === 0 && videos.length === 0 && messages.length === 0) {
      alert('Adicione pelo menos um conteúdo (foto, vídeo ou mensagem) antes de finalizar.');
      return;
    }

    if (confirm('Tem certeza que deseja finalizar o cofre? Após finalizar, ele será enviado para o destinatário.')) {
      handleSaveProgress();
      // Redirecionar para página de finalização
      window.location.href = '/criar-cofre-finalizar';
    }
  };

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
              <p className="text-sm text-white/80">Destinatário:</p>
              <p className="font-semibold">{mockContentData.recipient.name}</p>
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
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold">2</div>
            <span className="font-medium text-gray-900">Conteúdo</span>
          </div>
          <div className="w-16 h-1 bg-gray-200 rounded"></div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold">3</div>
            <span className="font-medium text-gray-900">Finalizar</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">📝 Criar Conteúdo do Cofre</h2>
            <p className="text-xl text-gray-600">Adicione fotos, vídeos e mensagens especiais para {mockContentData.recipient.name}</p>
          </div>

          {/* Content Tabs */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="border-b">
              <nav className="flex">
                <button 
                  onClick={() => handleTabSwitch('photos')}
                  className={`flex-1 py-4 px-6 text-center font-medium border-b-2 transition-colors ${
                    currentTab === 'photos' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent hover:text-blue-600 hover:border-blue-300'
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
                  onClick={() => handleTabSwitch('videos')}
                  className={`flex-1 py-4 px-6 text-center font-medium border-b-2 transition-colors ${
                    currentTab === 'videos' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent hover:text-blue-600 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Video className="w-5 h-5" />
                    <span>Vídeos</span>
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {videos.length}/{mockContentData.limits.videos}
                    </span>
                  </div>
                </button>
                <button 
                  onClick={() => handleTabSwitch('messages')}
                  className={`flex-1 py-4 px-6 text-center font-medium border-b-2 transition-colors ${
                    currentTab === 'messages' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent hover:text-blue-600 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <MessageCircle className="w-5 h-5" />
                    <span>Mensagens</span>
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {messages.length}/{mockContentData.limits.messages}
                    </span>
                  </div>
                </button>
              </nav>
            </div>

            {/* Photos Tab */}
            {currentTab === 'photos' && (
              <div className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">📸 Álbuns de Fotos</h3>
                  <p className="text-gray-600">Organize suas fotos em até 4 álbuns, com 10 fotos cada</p>
                </div>

                {/* Album Tabs */}
                <div className="flex space-x-2 mb-6">
                  {[1, 2, 3, 4].map((albumNum) => (
                    <button 
                      key={albumNum}
                      onClick={() => handleAlbumSwitch(albumNum)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        currentAlbum === albumNum
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Álbum {albumNum} <span className="text-xs">({photos[albumNum]?.length || 0}/10)</span>
                    </button>
                  ))}
                </div>

                {/* Album Content */}
                <div>
                  <div className="mb-4">
                    <input 
                      type="text" 
                      value={albumTitles[currentAlbum] || ''}
                      onChange={(e) => setAlbumTitles(prev => ({ ...prev, [currentAlbum]: e.target.value }))}
                      placeholder="Nome do álbum (ex: Memórias da Infância)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
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
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Arraste suas fotos aqui</h4>
                    <p className="text-gray-500 mb-4">ou clique para selecionar arquivos</p>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      className="hidden" 
                      id="photoInput"
                      onChange={(e) => e.target.files && handlePhotoUpload(e.target.files)}
                    />
                    <button 
                      onClick={() => document.getElementById('photoInput')?.click()}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Selecionar Fotos
                    </button>
                    <p className="text-xs text-gray-400 mt-2">Máximo 10 fotos por álbum • JPG, PNG • Até 5MB cada</p>
                  </div>

                  {/* Photos Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {(photos[currentAlbum] || []).map((photo, index) => (
                      <div key={photo.id} className="relative group bg-gray-100 rounded-lg overflow-hidden aspect-square">
                        <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2">
                          <button 
                            onClick={() => handleRemovePhoto(currentAlbum, index)}
                            className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Videos Tab */}
            {currentTab === 'videos' && (
              <div className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">🎥 Vídeos Especiais</h3>
                  <p className="text-gray-600">Adicione até 2 vídeos especiais para o destinatário</p>
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
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Arraste seus vídeos aqui</h4>
                  <p className="text-gray-500 mb-4">ou clique para selecionar arquivos</p>
                  <input 
                    type="file" 
                    multiple 
                    accept="video/*" 
                    className="hidden" 
                    id="videoInput"
                    onChange={(e) => e.target.files && handleVideoUpload(e.target.files)}
                  />
                  <button 
                    onClick={() => document.getElementById('videoInput')?.click()}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Selecionar Vídeos
                  </button>
                  <p className="text-xs text-gray-400 mt-2">Máximo 2 vídeos • MP4, MOV • Até 100MB cada</p>
                </div>

                {/* Videos List */}
                <div className="space-y-4">
                  {videos.map((video, index) => (
                    <div key={video.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Video className="w-8 h-8 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <input 
                            type="text" 
                            placeholder="Título do vídeo" 
                            value={video.title}
                            onChange={(e) => handleUpdateVideo(index, 'title', e.target.value)}
                            className="w-full font-medium text-gray-900 bg-transparent border-b border-gray-300 focus:border-purple-500 outline-none mb-2"
                          />
                          <textarea 
                            placeholder="Descrição (opcional)" 
                            value={video.description}
                            onChange={(e) => handleUpdateVideo(index, 'description', e.target.value)}
                            className="w-full text-sm text-gray-600 bg-transparent border-b border-gray-300 focus:border-purple-500 outline-none resize-none" 
                            rows={2}
                          />
                          <p className="text-xs text-gray-400 mt-1">
                            {video.name} • {(video.size / 1024 / 1024).toFixed(1)}MB
                          </p>
                        </div>
                        <button 
                          onClick={() => handleRemoveVideo(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Script Generator */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 mt-8">
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
                </div>
              </div>
            )}

            {/* Messages Tab */}
            {currentTab === 'messages' && (
              <div className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">💌 Mensagens Especiais</h3>
                  <p className="text-gray-600">Escreva até 5 mensagens especiais para o destinatário</p>
                </div>

                {/* Messages List */}
                <div className="space-y-6 mb-8">
                  {messages.map((message, index) => (
                    <div key={message.id} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <input 
                          type="text" 
                          placeholder="Título da mensagem" 
                          value={message.title}
                          onChange={(e) => handleUpdateMessage(index, 'title', e.target.value)}
                          className="text-lg font-medium text-gray-900 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none flex-1 mr-4"
                        />
                        <button 
                          onClick={() => handleRemoveMessage(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <textarea 
                        placeholder="Escreva sua mensagem especial aqui..." 
                        value={message.content}
                        onChange={(e) => handleUpdateMessage(index, 'content', e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" 
                        rows={8}
                      />
                      <div className="mt-4 flex items-center space-x-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Entrega programada (opcional)</label>
                          <input 
                            type="date" 
                            value={message.deliveryDate}
                            onChange={(e) => handleUpdateMessage(index, 'deliveryDate', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <button 
                          onClick={() => console.log('Melhorar com IA')}
                          className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-2"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>Melhorar com IA</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Message Button */}
                <button 
                  onClick={handleAddMessage}
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <PlusCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="font-medium text-gray-600">Adicionar Nova Mensagem</p>
                  <p className="text-sm text-gray-400">Clique para criar uma mensagem especial</p>
                </button>

                {/* AI Message Helper */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mt-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">✨ Assistente de Mensagens com IA</h4>
                  </div>
                  <p className="text-gray-600 mb-4">Precisa de inspiração? Nossa IA pode ajudar você a escrever mensagens emocionantes!</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <button 
                      onClick={() => handleSuggestMessage('love')}
                      className="p-4 bg-white rounded-lg border hover:border-pink-300 hover:bg-pink-50 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <Heart className="w-5 h-5 text-pink-500" />
                        <span className="font-medium">Mensagem de Amor</span>
                      </div>
                      <p className="text-sm text-gray-600">Expressar amor incondicional</p>
                    </button>
                    
                    <button 
                      onClick={() => handleSuggestMessage('advice')}
                      className="p-4 bg-white rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <Lightbulb className="w-5 h-5 text-blue-500" />
                        <span className="font-medium">Conselhos de Vida</span>
                      </div>
                      <p className="text-sm text-gray-600">Compartilhar sabedoria e experiências</p>
                    </button>
                    
                    <button 
                      onClick={() => handleSuggestMessage('memories')}
                      className="p-4 bg-white rounded-lg border hover:border-green-300 hover:bg-green-50 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <Camera className="w-5 h-5 text-green-500" />
                        <span className="font-medium">Memórias Especiais</span>
                      </div>
                      <p className="text-sm text-gray-600">Relembrar momentos únicos</p>
                    </button>
                    
                    <button 
                      onClick={() => handleSuggestMessage('future')}
                      className="p-4 bg-white rounded-lg border hover:border-purple-300 hover:bg-purple-50 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <Star className="w-5 h-5 text-purple-500" />
                        <span className="font-medium">Desejos para o Futuro</span>
                      </div>
                      <p className="text-sm text-gray-600">Expressar esperanças e sonhos</p>
                    </button>
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
                onClick={handleSaveProgress}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>Salvar Progresso</span>
              </button>
              
              <button 
                onClick={() => console.log('Visualizar cofre')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
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
    </div>
  );
}
