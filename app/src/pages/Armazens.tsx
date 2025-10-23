import { useState } from 'react';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { useWarehouses, useProducts, useCreateWarehouse, useDeleteWarehouse, useUpdateWarehouse } from '@/hooks/useApi';
import { transformApiWarehouse } from '@/lib/transform';
import { toast } from '@/hooks/use-toast';

const sugestoes = [
  'Estoque Seco',
  'Freezer',
  'Estoque de Balcão',
  'Estoque de Bebidas',
  'Câmara Fria',
  'Depósito',
];

const Armazens = () => {
  console.log('🏢 Armazens page loaded');
  // API data fetching
  const { data: warehouses = [], isLoading, error } = useWarehouses();
  const { data: products = [] } = useProducts();
  const createWarehouseMutation = useCreateWarehouse();
  const deleteWarehouseMutation = useDeleteWarehouse();
  const updateWarehouseMutation = useUpdateWarehouse();

  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');

  const resetForm = () => {
    setNome('');
    setDescricao('');
    setIsEditMode(false);
    setEditId(null);
  };

  const loadWarehouseForEdit = (armazem: any) => {
    setNome(armazem.nome);
    setDescricao(armazem.descricao);
    setIsEditMode(true);
    setEditId(armazem.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha o nome do armazém.',
        variant: 'destructive',
      });
      return;
    }

    const warehouseData = {
      name: nome,
      description: descricao,
    };

    if (isEditMode && editId) {
      // Update existing warehouse
      updateWarehouseMutation.mutate({
        id: editId,
        data: warehouseData
      }, {
        onSuccess: () => {
          toast({
            title: 'Sucesso',
            description: 'Armazém atualizado com sucesso!',
          });
          resetForm();
          setShowForm(false);
        },
        onError: (error: any) => {
          toast({
            title: 'Erro',
            description: error.message || 'Erro ao atualizar armazém.',
            variant: 'destructive',
          });
        },
      });
    } else {
      // Create new warehouse
      createWarehouseMutation.mutate(warehouseData, {
        onSuccess: () => {
          toast({
            title: 'Sucesso',
            description: 'Armazém cadastrado com sucesso!',
          });
          resetForm();
          setShowForm(false);
        },
        onError: (error: any) => {
          toast({
            title: 'Erro',
            description: error.message || 'Erro ao cadastrar armazém.',
            variant: 'destructive',
          });
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteWarehouseMutation.mutate(id, {
      onSuccess: () => {
        toast({
          title: 'Sucesso',
          description: 'Armazém excluído com sucesso!',
        });
        setDeleteId(null);
      },
      onError: (error: any) => {
        toast({
          title: 'Erro',
          description: error.message || 'Erro ao excluir armazém.',
          variant: 'destructive',
        });
        setDeleteId(null);
      },
    });
  };

  // Transform API warehouses to frontend format
  const armazens = warehouses.map(transformApiWarehouse);

  // Calculate warehouse stats based on products
  const getArmazemStats = (armazemId: string) => {
    const produtosArmazem = products.filter(p => p.warehouse_id === armazemId);
    const quantidade = produtosArmazem.length;
    const valorTotal = produtosArmazem.reduce((sum, p) => sum + (p.current_stock * p.unit_cost), 0);
    return { quantidade, valorTotal };
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Armazéns</h2>
            <p className="text-muted-foreground">Gerencie os locais de armazenamento</p>
          </div>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Armazéns</h2>
            <p className="text-muted-foreground">Gerencie os locais de armazenamento</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-destructive">Erro ao carregar armazéns: {(error as any).message}</p>
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
          <h2 className="text-3xl font-bold tracking-tight">Armazéns</h2>
          <p className="text-muted-foreground">Gerencie os locais de armazenamento</p>
        </div>
        <Button
          onClick={() => {
            if (!showForm) {
              resetForm(); // Reset form when opening for new warehouse
            }
            setShowForm(!showForm);
          }}
          disabled={createWarehouseMutation.isPending || updateWarehouseMutation.isPending || deleteWarehouseMutation.isPending}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Armazém
        </Button>
      </div>

      {armazens.length === 0 && !showForm && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum armazém cadastrado</h3>
            <p className="text-muted-foreground text-center mb-4">
              Comece cadastrando os locais onde seus produtos serão armazenados
            </p>
            <Button
              onClick={() => setShowForm(true)}
              disabled={createWarehouseMutation.isPending || deleteWarehouseMutation.isPending}
            >
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Primeiro Armazém
            </Button>
          </CardContent>
        </Card>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? 'Editar Armazém' : 'Cadastrar Novo Armazém'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Armazém *</Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Estoque Seco"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Informações adicionais sobre o armazém..."
                />
              </div>

              <div className="space-y-2">
                <Label>Sugestões</Label>
                <div className="flex flex-wrap gap-2">
                  {sugestoes.map(sugestao => (
                    <Button
                      key={sugestao}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setNome(sugestao)}
                    >
                      {sugestao}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={createWarehouseMutation.isPending || updateWarehouseMutation.isPending}
                >
                  {(createWarehouseMutation.isPending || updateWarehouseMutation.isPending)
                    ? 'Salvando...'
                    : isEditMode
                      ? 'Atualizar Armazém'
                      : 'Adicionar Armazém'
                  }
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  disabled={createWarehouseMutation.isPending || updateWarehouseMutation.isPending}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {armazens.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Armazéns Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Produtos</TableHead>
                  <TableHead className="text-right">Valor Total</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {armazens.map(armazem => {
                  const stats = getArmazemStats(armazem.id);
                  return (
                    <TableRow key={armazem.id}>
                      <TableCell className="font-medium">{armazem.nome}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {armazem.descricao || '-'}
                      </TableCell>
                      <TableCell className="text-right">{stats.quantidade}</TableCell>
                      <TableCell className="text-right font-medium">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(stats.valorTotal)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => loadWarehouseForEdit(armazem)}
                            disabled={createWarehouseMutation.isPending || updateWarehouseMutation.isPending}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteId(armazem.id)}
                            disabled={deleteWarehouseMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este armazém? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteWarehouseMutation.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={deleteWarehouseMutation.isPending}
            >
              {deleteWarehouseMutation.isPending ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Armazens;
