import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Briefcase, Package, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { fetchRegistrationOptions, validatePassword } from '@/services/userRegistration';
import { ApiRole, ApiGender } from '@/types';

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // API data state
  const [roles, setRoles] = useState<ApiRole[]>([]);
  const [genders, setGenders] = useState<ApiGender[]>([]);

  // Load API data on component mount
  useEffect(() => {
    const loadRegistrationData = async () => {
      try {
        const options = await fetchRegistrationOptions();
        setRoles(options.roles);
        setGenders(options.genders);
      } catch (error) {
        console.error('Error loading registration data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadRegistrationData();
  }, []);
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    genero: '',
    senha: '',
    confirmarSenha: '',
    cargo: '',
  });
  
  const [errors, setErrors] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    cargo: '',
    terms: '',
  });

  // Redirecionar se já estiver autenticado
  if (isAuthenticated) {
    navigate('/');
  }

  const validateNome = (nome: string): boolean => {
    if (!nome) {
      setErrors((prev) => ({ ...prev, nome: 'Nome é obrigatório' }));
      return false;
    }
    if (nome.length < 3) {
      setErrors((prev) => ({ ...prev, nome: 'Nome deve ter pelo menos 3 caracteres' }));
      return false;
    }
    if (nome.length > 100) {
      setErrors((prev) => ({ ...prev, nome: 'Nome deve ter no máximo 100 caracteres' }));
      return false;
    }
    setErrors((prev) => ({ ...prev, nome: '' }));
    return true;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setErrors((prev) => ({ ...prev, email: 'Email é obrigatório' }));
      return false;
    }
    if (!emailRegex.test(email)) {
      setErrors((prev) => ({ ...prev, email: 'Digite um email válido' }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: '' }));
    return true;
  };

  const getPasswordStrength = (senha: string): { strength: 'fraca' | 'média' | 'forte'; color: string; width: string } => {
    if (senha.length < 8) {
      return { strength: 'fraca', color: 'bg-destructive', width: '33.33%' };
    }
    
    const hasUpperCase = /[A-Z]/.test(senha);
    const hasNumber = /[0-9]/.test(senha);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);
    
    const criteriaMet = [hasUpperCase, hasNumber, hasSpecial].filter(Boolean).length;
    
    if (criteriaMet === 3) {
      return { strength: 'forte', color: 'bg-status-success', width: '100%' };
    } else if (criteriaMet >= 1) {
      return { strength: 'média', color: 'bg-status-warning', width: '66.66%' };
    }
    
    return { strength: 'fraca', color: 'bg-destructive', width: '33.33%' };
  };

  const validateSenha = (senha: string): boolean => {
    const validation = validatePassword(senha);

    if (!validation.isValid) {
      setErrors((prev) => ({ ...prev, senha: validation.errors[0] || 'Senha inválida' }));
      return false;
    }

    setErrors((prev) => ({ ...prev, senha: '' }));
    return true;
  };

  const validateConfirmarSenha = (confirmarSenha: string): boolean => {
    if (!confirmarSenha) {
      setErrors((prev) => ({ ...prev, confirmarSenha: 'Confirmação de senha é obrigatória' }));
      return false;
    }
    if (confirmarSenha !== formData.senha) {
      setErrors((prev) => ({ ...prev, confirmarSenha: 'As senhas não coincidem' }));
      return false;
    }
    setErrors((prev) => ({ ...prev, confirmarSenha: '' }));
    return true;
  };

  const validateCargo = (cargo: string): boolean => {
    if (!cargo) {
      setErrors((prev) => ({ ...prev, cargo: 'Cargo é obrigatório' }));
      return false;
    }
    setErrors((prev) => ({ ...prev, cargo: '' }));
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const isNomeValid = validateNome(formData.nome);
    const isEmailValid = validateEmail(formData.email);
    const isSenhaValid = validateSenha(formData.senha);
    const isConfirmarSenhaValid = validateConfirmarSenha(formData.confirmarSenha);
    const isCargoValid = validateCargo(formData.cargo);
    
    if (!acceptedTerms) {
      setErrors((prev) => ({ ...prev, terms: 'Você deve aceitar os termos para continuar' }));
      return;
    }
    
    if (!isNomeValid || !isEmailValid || !isSenhaValid || !isConfirmarSenhaValid || !isCargoValid) {
      return;
    }
    
    setIsLoading(true);
    const success = await registerUser({
      nome: formData.nome,
      email: formData.email,
      senha: formData.senha,
      genero: formData.genero,
      cargo: formData.cargo,
    });
    setIsLoading(false);
    
    if (success) {
      navigate('/login');
    }
  };

  const passwordStrength = getPasswordStrength(formData.senha);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4 py-12">
      <div className="w-full max-w-[550px] animate-fade-in">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Package className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Sistema de Estoque</h1>
          <p className="text-muted-foreground mt-2">Controle inteligente do seu inventário</p>
        </div>

        {/* Card de Registro */}
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">Criar nova conta</h2>
            <p className="text-muted-foreground text-sm mt-1">Preencha os dados para começar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isLoadingData && (
              <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-card border border-border rounded-lg shadow-lg p-6 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-lg font-medium">Carregando dados...</p>
                  <p className="text-sm text-muted-foreground">Estamos preparando o formulário</p>
                </div>
              </div>
            )}
            {/* Informações Pessoais */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <User className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm text-foreground">Informações Pessoais</h3>
              </div>

              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="nome"
                    type="text"
                    placeholder="João da Silva"
                    className={`pl-10 h-12 ${errors.nome ? 'border-destructive' : formData.nome && !errors.nome ? 'border-status-success' : ''}`}
                    value={formData.nome}
                    onChange={(e) => {
                      setFormData({ ...formData, nome: e.target.value });
                      if (errors.nome) validateNome(e.target.value);
                    }}
                    onBlur={(e) => validateNome(e.target.value)}
                    disabled={isLoading}
                  />
                  {formData.nome && !errors.nome && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-status-success" />
                  )}
                </div>
                {errors.nome && (
                  <p className="text-sm text-destructive">{errors.nome}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className={`pl-10 h-12 ${errors.email ? 'border-destructive' : formData.email && !errors.email ? 'border-status-success' : ''}`}
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) validateEmail(e.target.value);
                    }}
                    onBlur={(e) => validateEmail(e.target.value)}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                  {formData.email && !errors.email && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-status-success" />
                  )}
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Gênero */}
              <div className="space-y-2">
                <Label htmlFor="genero">Gênero</Label>
                <Select
                  value={formData.genero}
                  onValueChange={(value) => setFormData({ ...formData, genero: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger id="genero" className="h-12">
                    <SelectValue placeholder="Selecione seu gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingData ? (
                      <div className="flex items-center justify-center py-2">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span className="text-sm text-muted-foreground">Carregando...</span>
                      </div>
                    ) : (
                      <>
                        {genders.map((gender) => (
                          <SelectItem key={gender.id} value={gender.name.toLowerCase()}>
                            {gender.name}
                          </SelectItem>
                        ))}
                        <SelectItem value="nao-informar">Prefiro não informar</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Credenciais de Acesso */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <Lock className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm text-foreground">Credenciais de Acesso</h3>
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <Label htmlFor="senha">Senha *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="senha"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Crie uma senha forte"
                    className={`pl-10 pr-10 h-12 ${errors.senha ? 'border-destructive' : ''}`}
                    value={formData.senha}
                    onChange={(e) => {
                      setFormData({ ...formData, senha: e.target.value });
                      if (errors.senha) validateSenha(e.target.value);
                      if (formData.confirmarSenha) validateConfirmarSenha(formData.confirmarSenha);
                    }}
                    onBlur={(e) => validateSenha(e.target.value)}
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.senha && (
                  <p className="text-sm text-destructive">{errors.senha}</p>
                )}
                
                {/* Indicador de força da senha */}
                {formData.senha && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Força da senha:</span>
                      <span className={`font-medium ${
                        passwordStrength.strength === 'forte' ? 'text-status-success' :
                        passwordStrength.strength === 'média' ? 'text-status-warning' :
                        'text-destructive'
                      }`}>
                        {passwordStrength.strength.charAt(0).toUpperCase() + passwordStrength.strength.slice(1)}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: passwordStrength.width }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirmar Senha */}
              <div className="space-y-2">
                <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmarSenha"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirme sua senha"
                    className={`pl-10 pr-10 h-12 ${errors.confirmarSenha ? 'border-destructive' : formData.confirmarSenha && !errors.confirmarSenha ? 'border-status-success' : ''}`}
                    value={formData.confirmarSenha}
                    onChange={(e) => {
                      setFormData({ ...formData, confirmarSenha: e.target.value });
                      if (errors.confirmarSenha) validateConfirmarSenha(e.target.value);
                    }}
                    onBlur={(e) => validateConfirmarSenha(e.target.value)}
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  {formData.confirmarSenha && !errors.confirmarSenha && formData.confirmarSenha === formData.senha && (
                    <CheckCircle2 className="absolute right-12 top-1/2 -translate-y-1/2 h-5 w-5 text-status-success" />
                  )}
                </div>
                {errors.confirmarSenha && (
                  <p className="text-sm text-destructive">{errors.confirmarSenha}</p>
                )}
              </div>
            </div>

            {/* Perfil de Acesso */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <Briefcase className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm text-foreground">Perfil de Acesso</h3>
              </div>

              {/* Cargo */}
              <div className="space-y-2">
                <Label htmlFor="cargo">Função/Cargo *</Label>
                <Select
                  value={formData.cargo}
                  onValueChange={(value) => {
                    setFormData({ ...formData, cargo: value });
                    if (errors.cargo) validateCargo(value);
                  }}
                  disabled={isLoading}
                >
                  <SelectTrigger id="cargo" className={`h-12 ${errors.cargo ? 'border-destructive' : ''}`}>
                    <SelectValue placeholder="Selecione sua função" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingData ? (
                      <div className="flex items-center justify-center py-2">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span className="text-sm text-muted-foreground">Carregando...</span>
                      </div>
                    ) : (
                      roles.map((role) => (
                        <SelectItem key={role.id} value={role.name.toLowerCase()}>
                          {role.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.cargo && (
                  <p className="text-sm text-destructive">{errors.cargo}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Sua função determina suas permissões no sistema
                </p>
              </div>
            </div>

            {/* Termos de Uso */}
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => {
                    setAcceptedTerms(checked as boolean);
                    if (checked) {
                      setErrors((prev) => ({ ...prev, terms: '' }));
                    }
                  }}
                  className="mt-1"
                />
                <Label
                  htmlFor="terms"
                  className="text-sm font-normal leading-relaxed cursor-pointer"
                >
                  Aceito os{' '}
                  <Link to="/termos" className="text-primary hover:underline">
                    termos de uso
                  </Link>
                  {' '}e{' '}
                  <Link to="/privacidade" className="text-primary hover:underline">
                    política de privacidade
                  </Link>
                </Label>
              </div>
              {errors.terms && (
                <p className="text-sm text-destructive">{errors.terms}</p>
              )}
            </div>

            {/* Botão de Cadastro */}
            <Button
              type="submit"
              className="w-full h-12 text-base"
              disabled={isLoading || !acceptedTerms}
            >
              {isLoading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">ou</span>
            </div>
          </div>

          {/* Link para Login */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Já tem conta?{' '}
              <Link
                to="/login"
                className="text-primary font-medium hover:underline"
              >
                Faça login
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          © 2025 Sistema de Controle de Estoque. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
