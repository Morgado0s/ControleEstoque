import { Package, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardStats, useProductsNeedingAttention, useEntries, useExits } from '@/hooks/useApi';
import { StatusBadge } from '@/components/ui/status-badge';
import { transformApiEntryToMovimentacao, transformApiExitToMovimentacao } from '@/lib/transform';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  // API data fetching with loading states
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: productsNeedingAttention = [], isLoading: attentionLoading } = useProductsNeedingAttention();
  const { data: entries = [] } = useEntries();
  const { data: exits = [] } = useExits();

  // Transform and merge movements for recent movements display
  const entryMovements = entries.map(transformApiEntryToMovimentacao);
  const exitMovements = exits.map(transformApiExitToMovimentacao);
  const ultimasMovimentacoes = [...entryMovements, ...exitMovements]
    .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime())
    .slice(0, 10);

  // Loading state
  if (statsLoading || attentionLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Visão geral do seu estoque</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-20"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16 mb-2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Visão geral do seu estoque</p>
      </div>

      {/* Cards de métricas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Produtos"
          value={stats?.totalProducts || 0}
          icon={<Package className="h-6 w-6" />}
        />
        <StatCard
          title="Produtos Críticos"
          value={stats?.lowStockProducts || 0}
          icon={<AlertTriangle className="h-6 w-6" />}
          className={(stats?.lowStockProducts || 0) > 0 ? 'border-status-critical' : ''}
        />
        <StatCard
          title="Produtos em Atenção"
          value={stats?.mediumStockProducts || 0}
          icon={<AlertTriangle className="h-6 w-6" />}
          className={(stats?.mediumStockProducts || 0) > 0 ? 'border-status-warning' : ''}
        />
        <StatCard
          title="Valor Total"
          value={new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(stats?.totalValue || 0)}
          icon={<TrendingUp className="h-6 w-6" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Produtos que precisam de atenção */}
        <Card>
          <CardHeader>
            <CardTitle>Produtos que Precisam de Atenção</CardTitle>
          </CardHeader>
          <CardContent>
            {productsNeedingAttention.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Todos os produtos estão com estoque OK!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {productsNeedingAttention
                  .slice(0, 5)
                  .map(produto => (
                    <div key={produto.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <StatusBadge status={produto.status} />
                        <div>
                          <p className="font-medium">{produto.nome}</p>
                          <p className="text-sm text-muted-foreground">
                            Atual: {produto.quantidadeAtual} | Mínimo: {produto.quantidadeMinima}
                          </p>
                        </div>
                      </div>
                      <Link to="/estoque">
                        <Button variant="outline" size="sm">Ver</Button>
                      </Link>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Últimas movimentações */}
        <Card>
          <CardHeader>
            <CardTitle>Últimas Movimentações</CardTitle>
          </CardHeader>
          <CardContent>
            {ultimasMovimentacoes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Nenhuma movimentação registrada ainda</p>
              </div>
            ) : (
              <div className="space-y-3">
                {ultimasMovimentacoes.map(mov => (
                  <div key={mov.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {mov.tipo === 'entrada' ? (
                        <TrendingUp className="h-5 w-5 text-status-success" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-status-critical" />
                      )}
                      <div>
                        <p className="font-medium">{mov.produtoNome || 'Produto não encontrado'}</p>
                        <p className="text-sm text-muted-foreground">
                          {mov.tipo === 'entrada' ? '+' : '-'}{mov.quantidade} un. • {new Date(mov.data).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
