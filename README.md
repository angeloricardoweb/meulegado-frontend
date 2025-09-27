# Next.js 14 Boilerplate com shadcn/ui e Swiper

Este é um projeto boilerplate completo criado com Next.js 14, incluindo todas as tecnologias solicitadas:

## 🚀 Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Biblioteca de componentes
- **Axios** - Cliente HTTP
- **SWR** - Data fetching e cache
- **Swiper** - Biblioteca de carrossel
- **js-cookie** - Gerenciamento de cookies
- **Zod** - Validação de schemas
- **React Hook Form** - Gerenciamento de formulários
- **Lucide React** - Ícones

## 📦 Componentes shadcn/ui Incluídos

- ✅ Button (com todas as variações)
- ✅ Input
- ✅ Dialog/Modal
- ✅ Card
- ✅ Form (com validação)
- ✅ Label
- ✅ Utils (cn function)

## 🎨 Funcionalidades

- **Carrossel Responsivo**: Implementado com Swiper, com navegação, paginação e autoplay
- **Componentes Interativos**: Botões, inputs e modais funcionais
- **Chamadas API**: Exemplo com Axios para demonstrar integração
- **Data Fetching**: SWR para cache inteligente e sincronização de dados
- **Gerenciamento de Cookies**: Utilitários completos com js-cookie
- **Formulários com Validação**: React Hook Form + Zod para validação robusta
- **Design Responsivo**: Layout adaptável para diferentes tamanhos de tela
- **Tema Dark/Light**: Suporte automático baseado na preferência do sistema
- **TypeScript**: Tipagem completa em todo o projeto

## 🛠️ Instalação e Uso

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar o projeto:**
   ```bash
   npm run dev
   ```

3. **Abrir no navegador:**
   ```
   http://localhost:3000
   ```

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── globals.css          # Estilos globais com variáveis CSS
│   ├── layout.tsx           # Layout principal
│   └── page.tsx             # Página principal com exemplos
├── components/
│   └── ui/                  # Componentes shadcn/ui
│       ├── button.tsx
│       ├── input.tsx
│       ├── dialog.tsx
│       └── card.tsx
└── lib/
    ├── utils.ts             # Utilitários (cn function)
    └── cookies.ts           # Utilitários para gerenciamento de cookies
```

## 🎯 Exemplos Incluídos

### Carrossel Swiper
- 4 slides com imagens aleatórias
- Navegação por setas
- Paginação clicável
- Autoplay configurado
- Responsivo (1-3 slides por viewport)

### Componentes shadcn/ui
- **Button**: Todas as variações (default, secondary, destructive, outline, ghost)
- **Input**: Campo de texto com estado controlado
- **Dialog**: Modal que abre ao fazer chamada API
- **Card**: Layout de cartões para organizar conteúdo

### Integração com API
- Exemplo de chamada HTTP com Axios
- Exibição dos dados em modal
- Tratamento de erros

### Data Fetching com SWR
- **Cache inteligente**: Dados armazenados em cache para melhor performance
- **Revalidação automática**: Sincronização de dados em background
- **Error handling**: Tratamento robusto de erros
- **Loading states**: Estados de carregamento integrados
- **Otimização de rede**: Reduz requisições desnecessárias

### Gerenciamento de Cookies
- **Preferências do usuário**: Tema, idioma, notificações
- **Dados temporários**: Armazenamento com expiração
- **Contador de visitas**: Persistência entre sessões
- **Sessão do usuário**: Gerenciamento de tokens e autenticação
- **Utilitários completos**: Funções para salvar, recuperar e limpar cookies

### Formulários com Validação
- **React Hook Form**: Gerenciamento eficiente de estado de formulários
- **Zod**: Validação de schemas com TypeScript
- **Validação em tempo real**: Feedback imediato para o usuário
- **Mensagens de erro**: Personalizadas e em português
- **Integração com shadcn/ui**: Componentes Form, FormField, FormMessage
- **Persistência**: Dados salvos automaticamente nos cookies

## 🎨 Personalização

### Adicionar Novos Componentes shadcn/ui
```bash
npx shadcn@latest add [component-name]
```

### Configurar Tema
As variáveis CSS estão em `src/app/globals.css` e podem ser personalizadas facilmente.

### Adicionar Novas Páginas
Crie novos arquivos em `src/app/` seguindo a estrutura do App Router do Next.js 14.

## 📝 Scripts Disponíveis

- `npm run dev` - Executa o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run start` - Executa o servidor de produção
- `npm run lint` - Executa o linter ESLint

## 🔧 Configurações

- **Tailwind**: Configurado com tema personalizado e suporte a dark mode
- **TypeScript**: Configuração otimizada para Next.js 14
- **ESLint**: Configuração padrão do Next.js
- **shadcn/ui**: Configurado com tema neutral e CSS variables

## 🚀 Próximos Passos

Este boilerplate está pronto para desenvolvimento. Você pode:

1. Adicionar mais componentes shadcn/ui conforme necessário
2. Implementar autenticação
3. Adicionar mais páginas e rotas
4. Integrar com banco de dados
5. Implementar testes
6. Configurar CI/CD

---

**Desenvolvido com ❤️ usando Next.js 14, shadcn/ui e Swiper**