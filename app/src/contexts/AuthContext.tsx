import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';
import { createUser, RegisterFormData as ApiRegisterData } from '@/services/userRegistration';
import { usersApi } from '@/services/api/endpoints';
import { UserProfileService } from '@/services/userProfile';

export interface User {
  id: string;
  nome: string;
  email: string;
  genero?: string;
  cargo: string;
  ativo: boolean;
  criadoEm: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  genero?: string;
  cargo: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('auth_user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Chamar API de login do backend
      const response = await usersApi.login(email, senha);

      if (!response.success || !response.data) {
        toast({
          variant: "destructive",
          title: "Erro ao fazer login",
          description: response.message || "Email ou senha incorretos",
        });
        return false;
      }

      // Extrair dados do usuário da resposta
      const userData = response.data;

      // Debug: Verificar o formato real dos dados da API
      console.log('AuthContext - Login - userData completo:', userData);
      console.log('AuthContext - Login - userData.gender:', userData.gender);
      console.log('AuthContext - Login - userData.role:', userData.role);
      console.log('AuthContext - Login - userData.gender_name:', userData.gender_name);
      console.log('AuthContext - Login - userData.role_name:', userData.role_name);
      console.log('AuthContext - Login - userData.genero:', userData.genero);
      console.log('AuthContext - Login - userData.cargo:', userData.cargo);

      const user: User = {
        id: userData.id,
        nome: userData.name,
        email: userData.email,
        // Tentar diferentes formatos que a API pode retornar
        genero: userData.gender?.name || userData.gender_name || userData.genero || undefined,
        cargo: userData.role?.name || userData.role_name || userData.cargo || '',
        ativo: userData.active,
        criadoEm: userData.created_at,
      };

      console.log('AuthContext - Login - User mapeado:', user);

      // Salvar sessão no localStorage
      localStorage.setItem('auth_token', 'simple_session');
      localStorage.setItem('auth_user', JSON.stringify(user));

      setUser(user);

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta ao sistema",
      });

      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: "Ocorreu um erro. Tente novamente.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Convert form data to API format
      const apiData: ApiRegisterData = {
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        genero: data.genero,
        cargo: data.cargo,
      };

      // Create user via API
      return await createUser(apiData);
    } catch (error) {
      console.error('Erro no registro:', error);
      toast({
        variant: "destructive",
        title: "Erro ao criar conta",
        description: "Ocorreu um erro inesperado. Tente novamente.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setUser(null);

    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
  };

  const updateUserProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      return await UserProfileService.changePassword({
        currentPassword,
        newPassword
      });
    } catch (error) {
      console.error('Error changing password:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUserProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
