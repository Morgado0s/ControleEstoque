import { usersApi, rolesApi, genderApi } from './api/endpoints';
import { fetchRegistrationOptions, mapCargoToApiName, mapGeneroToApiName } from './userRegistration';
import { toast } from '@/hooks/use-toast';
import { ApiRole, ApiGender } from '@/types';

export interface ProfileFormData {
  nome: string;
  email: string;
  genero: string;
  cargo: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

/**
 * Service for handling user profile operations
 */
export class UserProfileService {
  /**
   * Fetches current user data from API
   */
  static async getCurrentUser() {
    try {
      const response = await usersApi.getCurrent();

      if (!response.success || !response.data) {
        // If the /me endpoint fails, fallback to AuthContext user data
        console.warn('API /me endpoint failed, using AuthContext fallback');
        return null; // This will trigger fallback to AuthContext data
      }

      return response.data;
    } catch (error: any) {
      console.error('Error fetching current user:', error);
      // Return null to trigger fallback to AuthContext data
      return null;
    }
  }

  /**
   * Updates user profile information
   */
  static async updateProfile(userId: string, formData: ProfileFormData): Promise<boolean> {
    try {
      // If no userId provided, we can't update via API
      if (!userId) {
        throw new Error('User ID not available for update');
      }

      // Fetch roles and genders for mapping
      const options = await fetchRegistrationOptions();

      // Map form data to API format
      const apiData = await this.mapFormDataToApiRequest(formData, options);

      // Update user via API
      const response = await usersApi.update(userId, apiData);

      if (response.success) {
        toast({
          title: "Perfil atualizado com sucesso!",
          description: "Suas informações foram atualizadas.",
        });
        return true;
      } else {
        // Handle API-level errors
        const errorMessage = response.message || 'Ocorreu um erro ao atualizar seu perfil';

        if (errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('exists')) {
          toast({
            variant: "destructive",
            title: "Email já cadastrado",
            description: "Este email já está em uso por outro usuário.",
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
            title: "Erro ao atualizar perfil",
            description: errorMessage,
          });
        }
        return false;
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);

      // Handle network or unexpected errors
      const errorMessage = error?.message || 'Ocorreu um erro inesperado';

      toast({
        variant: "destructive",
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
      });

      return false;
    }
  }

  /**
   * Changes user password
   */
  static async changePassword(passwordData: PasswordChangeData): Promise<boolean> {
    try {
      const response = await usersApi.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      if (response.success) {
        toast({
          title: "Senha alterada com sucesso!",
          description: "Sua senha foi atualizada.",
        });
        return true;
      } else {
        const errorMessage = response.message || 'Ocorreu um erro ao alterar sua senha';

        if (errorMessage.toLowerCase().includes('current password') && errorMessage.toLowerCase().includes('incorrect')) {
          toast({
            variant: "destructive",
            title: "Senha atual incorreta",
            description: "Verifique sua senha atual e tente novamente.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Erro ao alterar senha",
            description: errorMessage,
          });
        }
        return false;
      }
    } catch (error: any) {
      console.error('Error changing password:', error);

      toast({
        variant: "destructive",
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
      });

      return false;
    }
  }

  /**
   * Maps form data to API request format
   */
  private static async mapFormDataToApiRequest(
    formData: ProfileFormData,
    options: { roles: ApiRole[], genders: ApiGender[] }
  ) {
    // Find role by name
    const role = options.roles.find(r =>
      r.name.toLowerCase() === formData.cargo.toLowerCase() ||
      r.name.toLowerCase() === mapCargoToApiName(formData.cargo).toLowerCase()
    );

    if (!role) {
      throw new Error(`Role "${formData.cargo}" not found`);
    }

    // Find gender by name (if provided)
    let genderId: string | undefined;
    if (formData.genero && formData.genero !== 'nao_informar' && formData.genero !== 'nao-informar') {
      const gender = options.genders.find(g =>
        g.name.toLowerCase() === formData.genero.toLowerCase() ||
        g.name.toLowerCase() === mapGeneroToApiName(formData.genero)?.toLowerCase()
      );

      if (gender) {
        genderId = gender.id;
      }
    }

    return {
      name: formData.nome,
      email: formData.email,
      gender_id: genderId,
      role_id: role.id
    };
  }

  /**
   * Validates profile form data
   */
  static validateProfileData(data: ProfileFormData): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    // Name validation
    if (!data.nome) {
      errors.nome = 'Nome é obrigatório';
    } else if (data.nome.length < 3) {
      errors.nome = 'Nome deve ter pelo menos 3 caracteres';
    } else if (data.nome.length > 100) {
      errors.nome = 'Nome deve ter no máximo 100 caracteres';
    }

    // Email validation
    if (!data.email) {
      errors.email = 'Email é obrigatório';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        errors.email = 'Digite um email válido';
      }
    }

    // Cargo validation
    if (!data.cargo) {
      errors.cargo = 'Cargo é obrigatório';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}