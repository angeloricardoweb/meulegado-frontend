import Cookies from 'js-cookie';

// Tipos para os cookies que vamos usar
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
}

export interface UserSession {
  token: string;
  userId: string;
  expires: number;
}

// Utilitários para gerenciar cookies
export const cookieUtils = {
  // Salvar preferências do usuário
  setUserPreferences: (preferences: Partial<UserPreferences>) => {
    const currentPrefs = cookieUtils.getUserPreferences();
    const updatedPrefs = { ...currentPrefs, ...preferences };
    Cookies.set('user-preferences', JSON.stringify(updatedPrefs), { 
      expires: 365, // 1 ano
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
  },

  // Obter preferências do usuário
  getUserPreferences: (): UserPreferences => {
    const defaultPrefs: UserPreferences = {
      theme: 'system',
      language: 'pt-BR',
      notifications: true
    };

    try {
      const prefs = Cookies.get('user-preferences');
      return prefs ? { ...defaultPrefs, ...JSON.parse(prefs) } : defaultPrefs;
    } catch {
      return defaultPrefs;
    }
  },

  // Salvar sessão do usuário
  setUserSession: (session: UserSession) => {
    Cookies.set('user-session', JSON.stringify(session), {
      expires: new Date(session.expires),
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: false // Para permitir acesso via JavaScript
    });
  },

  // Obter sessão do usuário
  getUserSession: (): UserSession | null => {
    try {
      const session = Cookies.get('user-session');
      if (!session) return null;
      
      const parsedSession = JSON.parse(session);
      
      // Verificar se a sessão não expirou
      if (parsedSession.expires && Date.now() > parsedSession.expires) {
        cookieUtils.clearUserSession();
        return null;
      }
      
      return parsedSession;
    } catch {
      return null;
    }
  },

  // Limpar sessão do usuário
  clearUserSession: () => {
    Cookies.remove('user-session');
  },

  // Salvar dados temporários
  setTempData: (key: string, data: any, expiresInDays: number = 1) => {
    Cookies.set(`temp-${key}`, JSON.stringify(data), {
      expires: expiresInDays,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
  },

  // Obter dados temporários
  getTempData: (key: string) => {
    try {
      const data = Cookies.get(`temp-${key}`);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  // Remover dados temporários
  removeTempData: (key: string) => {
    Cookies.remove(`temp-${key}`);
  },

  // Limpar todos os cookies do app
  clearAll: () => {
    const cookies = Cookies.get();
    Object.keys(cookies).forEach(key => {
      if (key.startsWith('user-') || key.startsWith('temp-')) {
        Cookies.remove(key);
      }
    });
  }
};
