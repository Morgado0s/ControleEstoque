import { useState, useEffect } from 'react';
import { User, Mail, Briefcase, Save, X, Edit2, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfileService, ProfileFormData } from '@/services/userProfile';
import { fetchRegistrationOptions } from '@/services/userRegistration';
import { ApiRole, ApiGender } from '@/types';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Form validation schema
const perfilSchema = z.object({
  nome: z.string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z.string()
    .email('Digite um email válido')
    .min(1, 'Email é obrigatório'),
  genero: z.string().optional(),
  cargo: z.string().optional(),
});

type PerfilFormData = z.infer<typeof perfilSchema>;

export default function Perfil() {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState<ApiRole[]>([]);
  const [genders, setGenders] = useState<ApiGender[]>([]);

  // Load roles and genders for selects
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const options = await fetchRegistrationOptions();
        setRoles(options.roles);
        setGenders(options.genders);
      } catch (error) {
        console.error('Error loading registration options:', error);
      }
    };
    loadOptions();
  }, []);

  // Use real user data from AuthContext (not from API with mock data)
  const currentData = user;

  const defaultValues = {
    nome: currentData?.nome || '',
    email: currentData?.email || '',
    genero: currentData?.genero || '',
    cargo: currentData?.cargo || '',
  };

  const form = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { register, handleSubmit, formState: { errors, isDirty, isValid }, watch, reset, setValue } = form;
  const watchedValues = watch();

  // Update form values when user data changes
  useEffect(() => {
    if (currentData) {
      reset({
        nome: currentData?.nome || '',
        email: currentData?.email || '',
        genero: currentData?.genero || '',
        cargo: currentData?.cargo || '',
      });
    }
  }, [currentData, reset]);

  const handleEdit = () => {
    setIsEditing(true);
    // Reset form with current data when entering edit mode
    reset({
      nome: currentData?.nome || '',
      email: currentData?.email || '',
      genero: currentData?.genero || '',
      cargo: currentData?.cargo || '',
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to original data
    reset({
      nome: currentData?.nome || '',
      email: currentData?.email || '',
      genero: currentData?.genero || '',
      cargo: currentData?.cargo || '',
    });
  };

  const handleSave = async (data: PerfilFormData) => {
    setIsLoading(true);

    try {
      // Call API to update user profile
      const success = await UserProfileService.updateProfile(
        currentData?.id || user?.id,
        data
      );

      if (success) {
        // Update local user data in AuthContext only after API success
        updateUserProfile({
          nome: data.nome,
          email: data.email,
          genero: data.genero,
          cargo: data.cargo,
        });

        setIsEditing(false);

        // Success message is already shown by UserProfileService
      } else {
        // Error message is already shown by UserProfileService
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      // Error message is already shown by UserProfileService
    } finally {
      setIsLoading(false);
    }
  };

  
  // Show loading state if user is not available yet
  if (!currentData) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Perfil do Usuário</h1>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Carregando dados do usuário...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Perfil do Usuário</h1>
        <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
      </div>

      {/* Main Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>
                {isEditing ? 'Edite suas informações abaixo' : 'Visualize e edite seus dados pessoais'}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize">
                <Shield className="w-3 h-3 mr-1" />
                {user?.cargo || 'Usuário'}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit(handleSave)}>
          <CardContent className="space-y-6">
            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="nome" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nome Completo
                </Label>
                <Input
                  id="nome"
                  {...register('nome')}
                  disabled={!isEditing}
                  placeholder="Digite seu nome completo"
                  className={errors.nome ? 'border-destructive' : ''}
                />
                {errors.nome && (
                  <p className="text-sm text-destructive">{errors.nome.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  disabled={!isEditing}
                  placeholder="seu.email@empresa.com"
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* Gender Field */}
              <div className="space-y-2">
                <Label htmlFor="genero">Gênero</Label>
                <Select
                  value={watchedValues.genero}
                  onValueChange={(value) => setValue('genero', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    {genders.map((gender) => (
                      <SelectItem key={gender.id} value={gender.name.toLowerCase()}>
                        {gender.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="nao-informar">Prefiro não informar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Role Field */}
              <div className="space-y-2">
                <Label htmlFor="cargo" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Cargo/Função
                </Label>
                <Select
                  value={watchedValues.cargo}
                  onValueChange={(value) => setValue('cargo', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.name.toLowerCase()}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />
          </CardContent>

          <CardFooter className="flex justify-end gap-3 pt-6">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={!isDirty || !isValid || isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={handleEdit}>
                <Edit2 className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}