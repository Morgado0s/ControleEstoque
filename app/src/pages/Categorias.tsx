import { useState } from 'react';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';
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
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory, useProducts } from '@/hooks/useApi';
import { transformApiCategory } from '@/lib/transform';
import { toast } from '@/hooks/use-toast';

const Categorias = () => {
  // API data fetching
  const { data: categories = [], isLoading, error } = useCategories();
  const { data: products = [] } = useProducts();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

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

  const loadCategoryForEdit = (categoria: any) => {
    setNome(categoria.nome);
    setDescricao(categoria.descricao);
    setIsEditMode(true);
    setEditId(categoria.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha o nome da categoria.',
        variant: 'destructive',
      });
      return;
    }

    const categoryData = {
      nome,
      descricao,
    };

    if (isEditMode && editId) {
      // Update existing category
      updateCategoryMutation.mutate({
        id: editId,
        data: categoryData
      }, {
        onSuccess: () => {
          toast({
            title: 'Sucesso',
            description: 'Categoria atualizada com sucesso!',
          });
          resetForm();
          setShowForm(false);
        },
        onError: (error: any) => {
          toast({
            title: 'Erro',
            description: error.message || 'Erro ao atualizar categoria.',
            variant: 'destructive',
          });
        },
      });
    } else {
      // Create new category
      createCategoryMutation.mutate(categoryData, {
        onSuccess: () => {
          toast({
            title: 'Sucesso',
            description: 'Categoria cadastrada com sucesso!',
          });
          resetForm();
          setShowForm(false);
        },
        onError: (error: any) => {
          toast({
            title: 'Erro',
            description: error.message || 'Erro ao cadastrar categoria.',
            variant: 'destructive',
          });
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteCategoryMutation.mutate(id, {
      onSuccess: () => {
        toast({
          title: 'Sucesso',
          description: 'Categoria excluída com sucesso!',
        });
        setDeleteId(null);
      },
      onError: (error: any) => {
        toast({
          title: 'Erro',
          description: error.message || 'Erro ao excluir categoria.',
          variant: 'destructive',
        });
        setDeleteId(null);
      },
    });
  };

  // Transform API categories to frontend format
  const categorias = categories.map(transformApiCategory);

  // Calculate category stats
  const getCategoryStats = (categoriaId: string) => {
    const produtosCategoria = products.filter(p => p.category_id === categoriaId);
    return produtosCategoria.length;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Categorias</h2>
            <p className="text-muted-foreground">Gerencie as categorias de produtos</p>
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
            <h2 className="text-3xl font-bold tracking-tight">Categorias</h2>
            <p className="text-muted-foreground">Gerencie as categorias de produtos</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-destructive">Erro ao carregar categorias: {(error as any).message}</p>
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
          <h2 className="text-3xl font-bold tracking-tight">Categorias</h2>
          <p className="text-muted-foreground">Gerencie as categorias de produtos</p>
        </div>
        <Button
          onClick={() => {
            if (!showForm) {
              resetForm(); // Reset form when opening for new category
            }
            setShowForm(!showForm);
          }}
          disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending || deleteCategoryMutation.isPending}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      {categorias.length === 0 && !showForm && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Tag className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma categoria cadastrada</h3>
            <p className="text-muted-foreground text-center mb-4">
              Comece cadastrando categorias para organizar seus produtos
            </p>
            <Button
              onClick={() => setShowForm(true)}
              disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending || deleteCategoryMutation.isPending}
            >
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Primeira Categoria
            </Button>
          </CardContent>
        </Card>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? 'Editar Categoria' : 'Cadastrar Nova Categoria'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Categoria *</Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Bebidas, Alimentos, Limpeza"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Informações adicionais sobre a categoria..."
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                >
                  {(createCategoryMutation.isPending || updateCategoryMutation.isPending)
                    ? 'Salvando...'
                    : isEditMode
                      ? 'Atualizar Categoria'
                      : 'Adicionar Categoria'
                  }
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {categorias.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Categorias Cadastradas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Produtos</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categorias.map(categoria => {
                  const stats = getCategoryStats(categoria.id);
                  return (
                    <TableRow key={categoria.id}>
                      <TableCell className="font-medium">{categoria.nome}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {categoria.descricao || '-'}
                      </TableCell>
                      <TableCell className="text-right">{stats}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => loadCategoryForEdit(categoria)}
                            disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteId(categoria.id)}
                            disabled={deleteCategoryMutation.isPending || stats > 0}
                            title={stats > 0 ? "Não é possível excluir categorias com produtos associados" : "Excluir categoria"}
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
              Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteCategoryMutation.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={deleteCategoryMutation.isPending}
            >
              {deleteCategoryMutation.isPending ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Categorias;