import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Terms() {
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
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Termos de Uso</h1>
          </div>
        </div>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>Termos de Serviço - Sistema de Controle de Estoque</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">1. Aceitação dos Termos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Ao acessar e usar o Sistema de Controle de Estoque, você aceita e concorda com estes termos e condições.
                Se você não concorda com estes termos, não deve usar nossos serviços.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">2. Descrição do Serviço</h2>
              <p className="text-muted-foreground leading-relaxed">
                Nosso sistema é uma plataforma de gerenciamento de inventário projetada para ajudar empresas a controlar
                seus produtos, armazéns e movimentações de estoque de forma eficiente e organizada.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">3. Responsabilidades do Usuário</h2>
              <ul className="text-muted-foreground space-y-2 list-disc list-inside">
                <li>Fornecer informações verdadeiras e atualizadas</li>
                <li>Manter a confidencialidade de suas credenciais de acesso</li>
                <li>Usar o sistema apenas para fins legítimos e autorizados</li>
                <li>Não compartilhar dados confidenciais da empresa</li>
                <li>Reportar quaisquer falhas de segurança imediatamente</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">4. Privacidade e Dados</h2>
              <p className="text-muted-foreground leading-relaxed">
                Respeitamos sua privacidade e protegemos seus dados de acordo com nossa Política de Privacidade.
                As informações fornecidas são usadas exclusivamente para operação e melhoria do sistema.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">5. Propriedade Intelectual</h2>
              <p className="text-muted-foreground leading-relaxed">
                Todos os direitos sobre o software, incluindo código, design e funcionalidades, são de propriedade
                exclusiva da empresa e estão protegidos por leis de direitos autorais.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">6. Limitação de Responsabilidade</h2>
              <p className="text-muted-foreground leading-relaxed">
                O sistema é fornecido "como está" e não nos responsabilizamos por perdas ou danos diretos
                ou indiretos resultantes do uso ou incapacidade de uso do serviço.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">7. Modificações dos Termos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor
                imediatamente após a publicação no sistema.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">8. Contato</h2>
              <p className="text-muted-foreground leading-relaxed">
                Para dúvidas sobre estes termos, entre em contato através do canal de suporte do sistema.
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