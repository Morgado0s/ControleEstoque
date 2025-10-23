import { usersApi, rolesApi, genderApi } from './api/endpoints';
import { CreateUserRequest, ApiRole, ApiGender } from '@/types';
import { toast } from '@/hooks/use-toast';

export interface RegisterFormData {
  nome: string;
  email: string;
  senha: string;
  genero?: string;
  cargo: string;
}

export interface RegistrationOptions {
  roles: ApiRole[];
  genders: ApiGender[];
}

/**
 * Fetches roles and genders from the API for the registration form
 */
export const fetchRegistrationOptions = async (): Promise<RegistrationOptions> => {
  try {
    const [rolesResponse, gendersResponse] = await Promise.all([
      rolesApi.getAll(),
      genderApi.getAll()
    ]);

    const roles = rolesResponse.data || [];
    const genders = gendersResponse.data || [];

    return { roles, genders };
  } catch (error) {
    console.error('Error fetching registration options:', error);

    // Fallback options for development
    return {
      roles: [
        { id: '1', name: 'Administrador', description: 'Acesso total ao sistema', active: true, created_at: '', updated_at: '' },
        { id: '2', name: 'Gerente', description: 'Gerenciamento de operações', active: true, created_at: '', updated_at: '' },
        { id: '3', name: 'Funcionário', description: 'Acesso básico ao sistema', active: true, created_at: '', updated_at: '' },
        { id: '4', name: 'Operador', description: 'Operações de estoque', active: true, created_at: '', updated_at: '' }
      ],
      genders: [
        { id: '1', name: 'Masculino', active: true, created_at: '', updated_at: '' },
        { id: '2', name: 'Feminino', active: true, created_at: '', updated_at: '' },
        { id: '3', name: 'Outro', active: true, created_at: '', updated_at: '' }
      ]
    };
  }
};

/**
 * Maps form data to API request format
 */
export const mapFormDataToApiRequest = (formData: RegisterFormData, options: RegistrationOptions): CreateUserRequest => {
  // Find role ID by name
  const role = options.roles.find(r => r.name.toLowerCase() === formData.cargo.toLowerCase());
  if (!role) {
    throw new Error(`Role "${formData.cargo}" not found`);
  }

  // Find gender ID by name (if provided)
  let genderId: string | undefined;
  if (formData.genero && formData.genero !== 'nao-informar') {
    const gender = options.genders.find(g =>
      g.name.toLowerCase() === formData.genero.toLowerCase()
    );
    genderId = gender?.id;
  }

  return {
    name: formData.nome,
    email: formData.email,
    password: formData.senha,
    gender_id: genderId,
    role_id: role.id
  };
};

/**
 * Validates email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 */
export const validatePassword = (senha: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!senha) {
    errors.push('Senha é obrigatória');
    return { isValid: false, errors };
  }

  if (senha.length < 8) {
    errors.push('A senha deve ter no mínimo 8 caracteres');
  }

  if (!/[A-Z]/.test(senha)) {
    errors.push('A senha deve ter pelo menos 1 letra maiúscula');
  }

  if (!/[0-9]/.test(senha)) {
    errors.push('A senha deve ter pelo menos 1 número');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(senha)) {
    errors.push('A senha deve ter pelo menos 1 caractere especial');
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Creates a new user via the API
 */
export const createUser = async (formData: RegisterFormData): Promise<boolean> => {
  try {
    // Fetch registration options first
    const options = await fetchRegistrationOptions();

    // Map form data to API request
    const apiRequest = mapFormDataToApiRequest(formData, options);

    // Create user via API
    const response = await usersApi.create(apiRequest);

    if (response.success) {
      toast({
        title: "Conta criada com sucesso!",
        description: "Você já pode fazer login no sistema",
      });
      return true;
    } else {
      // Handle API-level errors
      const errorMessage = response.message || 'Ocorreu um erro ao criar sua conta';

      // Common error patterns
      if (errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('exists')) {
        toast({
          variant: "destructive",
          title: "Email já cadastrado",
          description: "Este email já está em uso. Tente fazer login ou use outro email.",
        });
      } else if (errorMessage.toLowerCase().includes('validation')) {
        toast({
          variant: "destructive",
          title: "Dados inválidos",
          description: "Verifique os dados informados e tente novamente.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao criar conta",
          description: errorMessage,
        });
      }
      return false;
    }
  } catch (error: any) {
    console.error('Error creating user:', error);

    // Handle network or unexpected errors
    const errorMessage = error?.message || 'Ocorreu um erro inesperado';

    toast({
      variant: "destructive",
      title: "Erro de conexão",
      description: "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
    });

    return false;
  }
};

/**
 * Maps cargo names from form to API-friendly names
 */
export const mapCargoToApiName = (cargo: string): string => {
  const cargoMapping: Record<string, string> = {
    'administrador': 'Administrador',
    'gerente': 'Gerente',
    'funcionario': 'Funcionário',
    'operador': 'Operador'
  };

  return cargoMapping[cargo.toLowerCase()] || cargo;
};

/**
 * Maps gender names from form to API-friendly names
 */
export const mapGeneroToApiName = (genero: string): string | undefined => {
  const generoMapping: Record<string, string> = {
    'masculino': 'Masculino',
    'feminino': 'Feminino',
    'outro': 'Outro'
  };

  return generoMapping[genero.toLowerCase()] || (genero === 'nao-informar' ? undefined : genero);
};