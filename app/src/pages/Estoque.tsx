import { useState } from 'react';
import { Plus, Minus, Search, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useProducts, useCreateEntry, useCreateExit } from '@/hooks/useApi';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { transformProdutoWithEstoque } from '@/lib/transform';
import { ProdutoComEstoque } from '@/types';

const Estoque = () => {
  // API data fetching
  const { data: products = [], isLoading, error } = useProducts();
  const createEntryMutation = useCreateEntry();
  const createExitMutation = useCreateExit();

  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'entrada' | 'saida'>('entrada');
  const [selectedProduct, setSelectedProduct] = useState<ProdutoComEstoque | null>(null);
  const [quantidade, setQuantidade] = useState('');
  const [observacao, setObservacao] = useState('');

  // Transform API products to frontend format with stock
  const produtosComEstoque = products.map(transformProdutoWithEstoque);
  
  const filteredProducts = produtosComEstoque.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.categoriaNome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.armazemNome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (produto: ProdutoComEstoque, tipo: 'entrada' | 'saida') => {
    setSelectedProduct(produto);
    setModalType(tipo);
    setQuantidade('');
    setObservacao('');
    setModalOpen(true);
  };

  const handleSubmitMovimentacao = () => {
    if (!selectedProduct || !quantidade || parseFloat(quantidade) <= 0) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha a quantidade corretamente.',
        variant: 'destructive',
      });
      return;
    }

    const qtd = parseFloat(quantidade);

    // Validar saída
    if (modalType === 'saida') {
      if (qtd > selectedProduct.quantidadeAtual) {
        toast({
          title: 'Erro',
          description: 'Quantidade de saída maior que estoque disponível.',
          variant: 'destructive',
        });
        return;
      }
    }

    const movementData = {
      produtoId: selectedProduct.id,
      quantidade: qtd,
      data: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
      observacao: observacao || undefined,
    };

    if (modalType === 'entrada') {
      createEntryMutation.mutate(movementData, {
        onSuccess: () => {
          toast({
            title: 'Sucesso',
            description: 'Entrada registrada com sucesso!',
          });
          setModalOpen(false);
        },
        onError: (error: any) => {
          toast({
            title: 'Erro',
            description: error.message || 'Erro ao registrar entrada.',
            variant: 'destructive',
          });
        },
      });
    } else {
      createExitMutation.mutate(movementData, {
        onSuccess: () => {
          toast({
            title: 'Sucesso',
            description: 'Saída registrada com sucesso!',
          });
          setModalOpen(false);
        },
        onError: (error: any) => {
          toast({
            title: 'Erro',
            description: error.message || 'Erro ao registrar saída.',
            variant: 'destructive',
          });
        },
      });
    }
  };

  const produtosCriticos = filteredProducts.filter(p => p.status === 'critical').length;
  const produtosAtencao = filteredProducts.filter(p => p.status === 'warning').length;

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Estoque Atual</h2>
            <p className="text-muted-foreground">Visualização completa do estoque</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-4 bg-muted rounded w-20"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-32"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-muted rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Estoque Atual</h2>
            <p className="text-muted-foreground">Visualização completa do estoque</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-destructive">Erro ao carregar estoque: {(error as any).message}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Estoque Atual</h2>
          <p className="text-muted-foreground">Visualização completa do estoque</p>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Produtos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredProducts.length}</div>
          </CardContent>
        </Card>
        <Card className={produtosCriticos > 0 ? 'border-status-critical' : ''}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Situação Crítica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-status-critical">{produtosCriticos}</div>
          </CardContent>
        </Card>
        <Card className={produtosAtencao > 0 ? 'border-status-warning' : ''}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Requer Atenção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-status-warning">{produtosAtencao}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Produtos em Estoque</CardTitle>
            <div className="w-64">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Status</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead className="text-center">Qtd. Atual</TableHead>
                <TableHead className="text-center">Qtd. Mínima</TableHead>
                <TableHead>Armazém</TableHead>
                <TableHead className="text-right">Custo Unit.</TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Nenhum produto encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map(produto => (
                  <TableRow key={produto.id}>
                    <TableCell>
                      <StatusBadge status={produto.status} />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{produto.nome}</p>
                        {produto.categoriaNome && (
                          <p className="text-sm text-muted-foreground">{produto.categoriaNome}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold text-lg">{produto.quantidadeAtual}</span>
                    </TableCell>
                    <TableCell className="text-center">{produto.quantidadeMinima}</TableCell>
                    <TableCell>{produto.armazemNome || '-'}</TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(produto.custoUnitario)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(produto.valorTotal)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenModal(produto, 'entrada')}
                          className="h-8 w-8 p-0"
                          disabled={createEntryMutation.isPending || createExitMutation.isPending}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenModal(produto, 'saida')}
                          className="h-8 w-8 p-0"
                          disabled={createEntryMutation.isPending || createExitMutation.isPending}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal de Movimentação */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {modalType === 'entrada' ? 'Registrar Entrada' : 'Registrar Saída'}
            </DialogTitle>
            <DialogDescription>
              {selectedProduct?.nome}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 bg-muted rounded-lg space-y-1">
              <p className="text-sm text-muted-foreground">Estoque atual</p>
              <p className="text-2xl font-bold">{selectedProduct?.quantidadeAtual}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade *</Label>
              <Input
                id="quantidade"
                type="number"
                min="0"
                step="0.01"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="observacao">Observação</Label>
              <Textarea
                id="observacao"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Observações adicionais..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              disabled={createEntryMutation.isPending || createExitMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmitMovimentacao}
              disabled={createEntryMutation.isPending || createExitMutation.isPending}
            >
              {createEntryMutation.isPending || createExitMutation.isPending
                ? 'Processando...'
                : modalType === 'entrada'
                  ? 'Confirmar Entrada'
                  : 'Confirmar Saída'
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Estoque;
