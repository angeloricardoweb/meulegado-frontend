"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import axios from "axios";
import { cookieUtils, UserPreferences } from "@/lib/cookies";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Schema de validação com Zod
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, insira um email válido.",
  }),
  age: z.coerce.number().min(18, {
    message: "Idade deve ser pelo menos 18 anos.",
  }).max(120, {
    message: "Idade deve ser no máximo 120 anos.",
  }),
  phone: z.string().min(10, {
    message: "Telefone deve ter pelo menos 10 dígitos.",
  }).regex(/^[0-9+\-\s()]+$/, {
    message: "Telefone deve conter apenas números e caracteres válidos.",
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiData, setApiData] = useState<{ id: number; title: string; body: string; userId: number } | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [tempData, setTempData] = useState<string>("");
  const [visitCount, setVisitCount] = useState<number>(0);
  const [formData, setFormData] = useState<FormData | null>(null);

  // React Hook Form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      age: 18,
      phone: "",
    },
  });

  // Carregar dados dos cookies ao inicializar
  useEffect(() => {
    const prefs = cookieUtils.getUserPreferences();
    setUserPreferences(prefs);
    
    const temp = cookieUtils.getTempData('demo');
    setTempData(temp || '');
    
    // Contador de visitas
    const currentCount = cookieUtils.getTempData('visitCount') || 0;
    const newCount = currentCount + 1;
    setVisitCount(newCount);
    cookieUtils.setTempData('visitCount', newCount, 1);
  }, []);

  const handleApiCall = async () => {
    try {
      const response = await axios.get("https://jsonplaceholder.typicode.com/posts/1");
      setApiData(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Erro na chamada da API:", error);
    }
  };

  const handleSavePreferences = () => {
    if (userPreferences) {
      cookieUtils.setUserPreferences(userPreferences);
      alert('Preferências salvas nos cookies!');
    }
  };

  const handleSaveTempData = () => {
    if (tempData.trim()) {
      cookieUtils.setTempData('demo', tempData, 1);
      alert('Dados temporários salvos!');
    }
  };

  const handleClearCookies = () => {
    cookieUtils.clearAll();
    setUserPreferences(cookieUtils.getUserPreferences());
    setTempData('');
    setVisitCount(0);
    alert('Todos os cookies foram limpos!');
  };

  // Função de submit do formulário
  const onSubmit = (data: FormData) => {
    console.log("Dados do formulário:", data);
    setFormData(data);
    alert('Formulário enviado com sucesso!');
    
    // Salvar dados do formulário nos cookies
    cookieUtils.setTempData('formData', data, 7);
  };

  const carouselItems = [
    {
      id: 1,
      title: "Primeiro Slide",
      description: "Este é o primeiro slide do carrossel",
      image: "https://picsum.photos/800/400?random=1",
    },
    {
      id: 2,
      title: "Segundo Slide",
      description: "Este é o segundo slide do carrossel",
      image: "https://picsum.photos/800/400?random=2",
    },
    {
      id: 3,
      title: "Terceiro Slide",
      description: "Este é o terceiro slide do carrossel",
      image: "https://picsum.photos/800/400?random=3",
    },
    {
      id: 4,
      title: "Quarto Slide",
      description: "Este é o quarto slide do carrossel",
      image: "https://picsum.photos/800/400?random=4",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Next.js 14 + shadcn/ui + Swiper
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Projeto boilerplate com todas as tecnologias solicitadas
          </p>
        </div>

        {/* Carrossel Swiper */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Carrossel Swiper
          </h2>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="rounded-lg"
          >
            {carouselItems.map((item) => (
              <SwiperSlide key={item.id}>
                <Card className="h-full">
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Componentes shadcn/ui */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Card com Input */}
          <Card>
            <CardHeader>
              <CardTitle>Input Component</CardTitle>
              <CardDescription>
                Exemplo de uso do componente Input do shadcn/ui
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Digite algo aqui..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Valor atual: {inputValue || "Nenhum valor"}
              </p>
            </CardContent>
          </Card>

          {/* Card com Botões */}
          <Card>
            <CardHeader>
              <CardTitle>Button Components</CardTitle>
              <CardDescription>
                Diferentes variações do componente Button
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </CardContent>
          </Card>

          {/* Card com Modal */}
          <Card>
            <CardHeader>
              <CardTitle>Modal Component</CardTitle>
              <CardDescription>
                Exemplo de uso do componente Dialog/Modal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleApiCall} className="w-full">
                    Fazer chamada API
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Dados da API</DialogTitle>
                    <DialogDescription>
                      Dados retornados da API usando Axios
                    </DialogDescription>
                  </DialogHeader>
                  {apiData && (
                    <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <pre className="text-sm overflow-auto">
                        {JSON.stringify(apiData, null, 2)}
                      </pre>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Card com Cookies */}
          <Card>
            <CardHeader>
              <CardTitle>js-cookie Demo</CardTitle>
              <CardDescription>
                Gerenciamento de cookies com js-cookie
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Dados Temporários:</label>
                <Input
                  placeholder="Digite algo para salvar..."
                  value={tempData}
                  onChange={(e) => setTempData(e.target.value)}
                />
                <Button onClick={handleSaveTempData} size="sm" className="w-full">
                  Salvar nos Cookies
                </Button>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Preferências:</label>
                {userPreferences && (
                  <div className="text-xs space-y-1">
                    <p>Tema: {userPreferences.theme}</p>
                    <p>Idioma: {userPreferences.language}</p>
                    <p>Notificações: {userPreferences.notifications ? 'Sim' : 'Não'}</p>
                  </div>
                )}
                <Button onClick={handleSavePreferences} size="sm" variant="outline" className="w-full">
                  Salvar Preferências
                </Button>
              </div>

              <div className="text-center p-2 bg-gray-100 dark:bg-gray-800 rounded">
                <p className="text-sm">Visitas: {visitCount}</p>
              </div>

              <Button onClick={handleClearCookies} size="sm" variant="destructive" className="w-full">
                Limpar Cookies
              </Button>
            </CardContent>
          </Card>

          {/* Card com Formulário */}
          <Card>
            <CardHeader>
              <CardTitle>Formulário com Validação</CardTitle>
              <CardDescription>
                React Hook Form + Zod + shadcn/ui
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
                  <FormField
                    control={form.control as any}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control as any}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="seu@email.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Idade</FormLabel>
                        <FormControl>
                          <Input placeholder="18" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input placeholder="(11) 99999-9999" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full">
                    Enviar Formulário
                  </Button>
                </form>
              </Form>
              
              {formData && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    Dados Enviados:
                  </h4>
                  <pre className="text-xs text-green-800 dark:text-green-200 overflow-auto">
                    {JSON.stringify(formData, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Informações do Projeto */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Tecnologias Utilizadas</CardTitle>
            <CardDescription>
              Este projeto foi criado com as seguintes tecnologias:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Next.js 14</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">Framework React</p>
              </div>
              <div className="text-center p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                <h3 className="font-semibold text-cyan-900 dark:text-cyan-100">Tailwind CSS</h3>
                <p className="text-sm text-cyan-700 dark:text-cyan-300">Styling</p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">shadcn/ui</h3>
                <p className="text-sm text-purple-700 dark:text-purple-300">Componentes</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h3 className="font-semibold text-green-900 dark:text-green-100">Swiper</h3>
                <p className="text-sm text-green-700 dark:text-green-300">Carrossel</p>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <h3 className="font-semibold text-orange-900 dark:text-orange-100">js-cookie</h3>
                <p className="text-sm text-orange-700 dark:text-orange-300">Cookies</p>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <h3 className="font-semibold text-red-900 dark:text-red-100">Zod</h3>
                <p className="text-sm text-red-700 dark:text-red-300">Validação</p>
              </div>
              <div className="text-center p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                <h3 className="font-semibold text-pink-900 dark:text-pink-100">React Hook Form</h3>
                <p className="text-sm text-pink-700 dark:text-pink-300">Formulários</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}