import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/cadastro">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Política de Privacidade</h1>
          </div>
        </div>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>Política de Privacidade - Sistema de Controle de Estoque</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">1. Informações Coletadas</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Coletamos apenas as informações necessárias para operar nosso sistema:
              </p>
              <ul className="text-muted-foreground space-y-2 list-disc list-inside">
                <li><strong>Dados Pessoais:</strong> Nome, email, gênero e cargo</li>
                <li><strong>Dados de Acesso:</strong> Informações de login e atividade no sistema</li>
                <li><strong>Dados de Negócio:</strong> Produtos, estoques, armazéns e movimentações</li>
                <li><strong>Dados Técnicos:</strong> Endereço IP, tipo de navegador e dispositivo</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">2. Uso das Informações</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Suas informações são utilizadas para:
              </p>
              <ul className="text-muted-foreground space-y-2 list-disc list-inside">
                <li>Prover e manter o funcionamento do sistema</li>
                <li>Autenticar usuários e controlar acesso</li>
                <li>Gerar relatórios e análises de estoque</li>
                <li>Melhorar nossos serviços e funcionalidades</li>
                <li>Comunicar atualizações importantes</li>
                <li>Garantir a segurança dos dados</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">3. Armazenamento e Segurança</h2>
              <p className="text-muted-foreground leading-relaxed">
                Implementamos medidas robustas de segurança para proteger suas informações:
              </p>
              <ul className="text-muted-foreground space-y-2 list-disc list-inside">
                <li>Criptografia de dados em trânsito e em repouso</li>
                <li>Controle de acesso baseado em papéis</li>
                <li>Backup regular dos dados</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Conformidade com LGPD (Lei Geral de Proteção de Dados)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">4. Compartilhamento de Dados</h2>
              <p className="text-muted-foreground leading-relaxed">
                Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros, exceto:
              </p>
              <ul className="text-muted-foreground space-y-2 list-disc list-inside">
                <li>Quando autorizado expressamente por você</li>
                <li>Para cumprir obrigações legais</li>
                <li>Com fornecedores essenciais para operação do sistema</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">5. Seus Direitos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Você tem direito de:
              </p>
              <ul className="text-muted-foreground space-y-2 list-disc list-inside">
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir informações incorretas</li>
                <li>Solicitar exclusão de seus dados</li>
                <li>Portar seus dados para outro serviço</li>
                <li>Revogar consentimento quando aplicável</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">6. Cookies e Tecnologias Similares</h2>
              <p className="text-muted-foreground leading-relaxed">
                Usamos cookies para melhorar sua experiência, mantê-lo logado e analisar o uso do sistema.
                Você pode gerenciar preferências de cookies nas configurações do navegador.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">7. Retenção de Dados</h2>
              <p className="text-muted-foreground leading-relaxed">
                Mantemos seus dados apenas pelo tempo necessário para fornecer nossos serviços
                e cumprir obrigações legais. Dados de negócio são mantidos enquanto você for cliente.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">8. Alterações nesta Política</h2>
              <p className="text-muted-foreground leading-relaxed">
                Podemos atualizar esta política periodicamente. Notificaremos usuários sobre
                alterações significativas através do sistema ou email.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">9. Contato para Privacidade</h2>
              <p className="text-muted-foreground leading-relaxed">
                Para exercer seus direitos ou tirar dúvidas sobre esta política, entre em contato
                através do canal de suporte do sistema.
              </p>
            </div>

            <div className="pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground text-center">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}