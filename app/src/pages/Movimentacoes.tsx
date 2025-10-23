import { useState } from 'react';
import { TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useProducts, useEntries, useExits, useCreateEntry, useCreateExit, useDeleteEntry, useDeleteExit } from '@/hooks/useApi';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { mergeMovements, transformProdutoWithEstoque } from '@/lib/transform';

const Movimentacoes = () => {
  // API data fetching
  const { data: products = [], isLoading, error } = useProducts();
  const { data: entries = [] } = useEntries();
  const { data: exits = [] } = useExits();
  const createEntryMutation = useCreateEntry();
  const createExitMutation = useCreateExit();
  const deleteEntryMutation = useDeleteEntry();
  const deleteExitMutation = useDeleteExit();

  const [produtoId, setProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [observacao, setObservacao] = useState('');
  const [deleteId, setDeleteId] = useState<{ id: string; type: 'entry' | 'exit' } | null>(null);

  const handleSubmit = (tipo: 'entrada' | 'saida') => {
    if (!produtoId || !quantidade || parseFloat(quantidade) <= 0) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    const qtd = parseFloat(quantidade);

    // Validar saída
    if (tipo === 'saida') {
      const produto = products.find(p => p.id === produtoId);
      if (produto && qtd > produto.current_stock) {
        toast({
          title: 'Erro',
          description: 'Quantidade de saída maior que estoque disponível.',
          variant: 'destructive',
        });
        return;
      }
    }

    const movementData = {
      produtoId,
      quantidade: qtd,
      data: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
      observacao: observacao || undefined,
    };

    if (tipo === 'entrada') {
      createEntryMutation.mutate(movementData, {
        onSuccess: () => {
          toast({
            title: 'Sucesso',
            description: 'Entrada registrada com sucesso!',
          });
          // Limpar formulário
          setProdutoId('');
          setQuantidade('');
          setObservacao('');
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
          // Limpar formulário
          setProdutoId('');
          setQuantidade('');
          setObservacao('');
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

  const handleDelete = (id: string, type: 'entry' | 'exit') => {
    console.log('🗑️ Movimentacoes.handleDelete - ID:', id, 'Type:', type);

    if (type === 'entry') {
      console.log('🔄 Calling deleteEntryMutation...');
      deleteEntryMutation.mutate(id, {
        onSuccess: () => {
          toast({
            title: 'Sucesso',
            description: 'Entrada excluída com sucesso!',
          });
          setDeleteId(null);
        },
        onError: (error: any) => {
          console.log('❌ deleteEntryMutation Error:', error);
          toast({
            title: 'Erro',
            description: error.message || 'Erro ao excluir entrada.',
            variant: 'destructive',
          });
          setDeleteId(null);
        },
      });
    } else {
      console.log('🔄 Calling deleteExitMutation...');
      deleteExitMutation.mutate(id, {
        onSuccess: () => {
          toast({
            title: 'Sucesso',
            description: 'Saída excluída com sucesso!',
          });
          setDeleteId(null);
        },
        onError: (error: any) => {
          console.log('❌ deleteExitMutation Error:', error);
          toast({
            title: 'Erro',
            description: error.message || 'Erro ao excluir saída.',
            variant: 'destructive',
          });
          setDeleteId(null);
        },
      });
    }
  };

  // Transform API products to frontend format with stock
  const produtosComEstoque = products.map(transformProdutoWithEstoque);

  // Merge and sort movements
  const movimentacoes = mergeMovements(entries, exits);
  const movimentacoesOrdenadas = movimentacoes.sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
  );

  // Debug: Verificar como as movimentações chegaram
  console.log('📊 Movimentacoes Debug - Total:', movimentacoesOrdenadas.length);
  console.log('📊 Movimentacoes Debug - Sample:', movimentacoesOrdenadas.slice(0, 3).map(m => ({
    id: m.id,
    tipo: m.tipo,
    nome: m.produtoNome,
    quantidade: m.quantidade
  })));

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Movimentações</h2>
          <p className="text-muted-foreground">Registre entradas e saídas de produtos</p>
        </div>
        <div className="space-y-6">
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-48"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 bg-muted rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
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
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Movimentações</h2>
          <p className="text-muted-foreground">Registre entradas e saídas de produtos</p>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-destructive">Erro ao carregar dados: {(error as any).message}</p>
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
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Movimentações</h2>
        <p className="text-muted-foreground">Registre entradas e saídas de produtos</p>
      </div>

      <Tabs defaultValue="entrada" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="entrada">Entrada</TabsTrigger>
          <TabsTrigger value="saida">Saída</TabsTrigger>
        </TabsList>

        <TabsContent value="entrada" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-status-success" />
                Registrar Entrada de Produtos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="produto-entrada">Produto *</Label>
                <Select value={produtoId} onValueChange={setProdutoId}>
                  <SelectTrigger id="produto-entrada">
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {produtosComEstoque.map(produto => (
                      <SelectItem key={produto.id} value={produto.id}>
                        {produto.nome} (Estoque atual: {produto.quantidadeAtual})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantidade-entrada">Quantidade *</Label>
                <Input
                  id="quantidade-entrada"
                  type="number"
                  min="0"
                  step="0.01"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacao-entrada">Observação</Label>
                <Textarea
                  id="observacao-entrada"
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  placeholder="Observações adicionais..."
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleSubmit('entrada')}
                  className="flex-1"
                  disabled={createEntryMutation.isPending || createExitMutation.isPending}
                >
                  {createEntryMutation.isPending ? 'Registrando...' : 'Registrar Entrada'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setProdutoId('');
                    setQuantidade('');
                    setObservacao('');
                  }}
                  disabled={createEntryMutation.isPending || createExitMutation.isPending}
                >
                  Limpar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saida" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-status-critical" />
                Registrar Saída de Produtos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="produto-saida">Produto *</Label>
                <Select value={produtoId} onValueChange={setProdutoId}>
                  <SelectTrigger id="produto-saida">
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {produtosComEstoque.map(produto => (
                      <SelectItem key={produto.id} value={produto.id}>
                        {produto.nome} (Estoque atual: {produto.quantidadeAtual})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantidade-saida">Quantidade *</Label>
                <Input
                  id="quantidade-saida"
                  type="number"
                  min="0"
                  step="0.01"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacao-saida">Observação</Label>
                <Textarea
                  id="observacao-saida"
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  placeholder="Observações adicionais..."
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleSubmit('saida')}
                  className="flex-1"
                  disabled={createEntryMutation.isPending || createExitMutation.isPending}
                >
                  {createExitMutation.isPending ? 'Registrando...' : 'Registrar Saída'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setProdutoId('');
                    setQuantidade('');
                    setObservacao('');
                  }}
                  disabled={createEntryMutation.isPending || createExitMutation.isPending}
                >
                  Limpar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Histórico de Movimentações */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Movimentações</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead className="text-right">Quantidade</TableHead>
                <TableHead>Observação</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movimentacoesOrdenadas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhuma movimentação registrada
                  </TableCell>
                </TableRow>
              ) : (
                movimentacoesOrdenadas.map(mov => {
                  const produto = produtosComEstoque.find(p => p.id === mov.produtoId);
                  return (
                    <TableRow key={mov.id}>
                      <TableCell>
                        <Badge
                          variant={mov.tipo === 'entrada' ? 'default' : 'destructive'}
                          className="gap-1"
                        >
                          {mov.tipo === 'entrada' ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {mov.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(mov.data).toLocaleDateString('pt-BR')} às{' '}
                        {new Date(mov.data).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                      <TableCell>{produto?.nome || 'Produto não encontrado'}</TableCell>
                      <TableCell className="text-right font-medium">
                        {mov.tipo === 'entrada' ? '+' : '-'}
                        {mov.quantidade}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {mov.observacao || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              console.log('🗑️ Botão excluir clicado - Movimentação:', {
                                id: mov.id,
                                tipo: mov.tipo,
                                nome: mov.produtoNome,
                                quantidade: mov.quantidade
                              });
                              setDeleteId({ id: mov.id, type: mov.tipo as 'entry' | 'exit' });
                            }}
                            disabled={deleteEntryMutation.isPending || deleteExitMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta movimentação? Esta ação não pode ser desfeita e afetará o saldo atual de estoque.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteEntryMutation.isPending || deleteExitMutation.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                console.log('🔥 AlertDialogAction clicked - deleteId:', deleteId);
                if (deleteId) {
                  handleDelete(deleteId.id, deleteId.type);
                }
              }}
              disabled={deleteEntryMutation.isPending || deleteExitMutation.isPending}
            >
              {(deleteEntryMutation.isPending || deleteExitMutation.isPending)
                ? 'Excluindo...'
                : 'Excluir'
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Movimentacoes;
