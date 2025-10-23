import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SimpleSelect from '@/components/ui/simple-select';
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
import { useProducts, useWarehouses, useCreateProduct, useDeleteProduct, useUpdateProduct, useCategories } from '@/hooks/useApi';
import { transformApiProduct } from '@/lib/transform';
import { toast } from '@/hooks/use-toast';

const Produtos = () => {
  // API data fetching
  const { data: products = [], isLoading, error } = useProducts();
  const { data: warehouses = [] } = useWarehouses();
  const { data: categories = [] } = useCategories();

  
  // DADOS DA API COM CAMPOS CORRIGIDOS
  const categoriesData = categories.map(cat => ({
    id: cat.id,
    nome: cat.name // Usar 'name' da API em vez de 'nome'
  }));

  const warehousesData = warehouses.map(armazem => ({
    id: armazem.id,
    nome: armazem.name // Usar 'name' da API
  }));

    const createProductMutation = useCreateProduct();
  const deleteProductMutation = useDeleteProduct();
  const updateProductMutation = useUpdateProduct();

  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form state (remove codigo and quantidadeInicial as they don't exist in backend)
  const [nome, setNome] = useState('');
  const [quantidadeMinima, setQuantidadeMinima] = useState('');
  const [armazemId, setArmazemId] = useState('');
  const [custoUnitario, setCustoUnitario] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoriaId, setCategoriaId] = useState('');

  const resetForm = () => {
    setNome('');
    setQuantidadeMinima('');
    setArmazemId('');
    setCustoUnitario('');
    setDescricao('');
    setCategoriaId('');
    setIsEditMode(false);
    setEditId(null);
  };

  const loadProductForEdit = (produto: any) => {
    setNome(produto.nome);
    setQuantidadeMinima(produto.quantidadeMinima.toString());
    setArmazemId(produto.armazemId);
    setCustoUnitario(produto.custoUnitario.toString());
    setDescricao(produto.descricao);
    setCategoriaId(produto.categoriaId || '');
    setIsEditMode(true);
    setEditId(produto.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || !quantidadeMinima || !armazemId || armazemId === 'none' || !custoUnitario) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    const productData = {
      nome,
      quantidadeMinima: parseFloat(quantidadeMinima),
      armazemId,
      custoUnitario: parseFloat(custoUnitario),
      descricao,
      categoriaId: categoriaId === 'none' ? null : categoriaId,
    };

    if (isEditMode && editId) {
      // Update existing product
      updateProductMutation.mutate({
        id: editId,
        data: productData
      }, {
        onSuccess: () => {
          toast({
            title: 'Sucesso',
            description: 'Produto atualizado com sucesso!',
          });
          resetForm();
          setShowForm(false);
        },
        onError: (error: any) => {
          toast({
            title: 'Erro',
            description: error.message || 'Erro ao atualizar produto.',
            variant: 'destructive',
          });
        },
      });
    } else {
      // Create new product
      createProductMutation.mutate(productData, {
        onSuccess: () => {
          toast({
            title: 'Sucesso',
            description: 'Produto cadastrado com sucesso!',
          });
          resetForm();
          setShowForm(false);
        },
        onError: (error: any) => {
          toast({
            title: 'Erro',
            description: error.message || 'Erro ao cadastrar produto.',
            variant: 'destructive',
          });
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteProductMutation.mutate(id, {
      onSuccess: () => {
        toast({
          title: 'Sucesso',
          description: 'Produto excluído com sucesso!',
        });
        setDeleteId(null);
      },
      onError: (error: any) => {
        toast({
          title: 'Erro',
          description: error.message || 'Erro ao excluir produto.',
          variant: 'destructive',
        });
        setDeleteId(null);
      },
    });
  };

  // Transform API products to frontend format
  const produtos = products.map(transformApiProduct);

  // Prepare options para SimpleSelect
  const categoryOptions = [
    { value: "none", label: "Sem categoria" },
    ...categoriesData.map(categoria => ({
      value: categoria.id,
      label: categoria.nome
    }))
  ];

  const warehouseOptions = [
    { value: "none", label: "Selecione um armazém" },
    ...warehousesData.map(armazem => ({
      value: armazem.id,
      label: armazem.nome
    }))
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Produtos</h2>
            <p className="text-muted-foreground">Gerencie o cadastro de produtos</p>
          </div>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
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
            <h2 className="text-3xl font-bold tracking-tight">Produtos</h2>
            <p className="text-muted-foreground">Gerencie o cadastro de produtos</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-destructive">Erro ao carregar produtos: {(error as any).message}</p>
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
          <h2 className="text-3xl font-bold tracking-tight">Produtos</h2>
          <p className="text-muted-foreground">Gerencie o cadastro de produtos</p>
        </div>
        <Button
          onClick={() => {
            if (!showForm) {
              resetForm(); // Reset form when opening for new product
            }
            setShowForm(!showForm);
          }}
          disabled={createProductMutation.isPending || updateProductMutation.isPending || deleteProductMutation.isPending}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? 'Editar Produto' : 'Cadastrar Novo Produto'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Produto *</Label>
                  <Input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Arroz Integral"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <SimpleSelect
                    id="categoria"
                    value={categoriaId}
                    onValueChange={setCategoriaId}
                    placeholder="Selecione uma categoria (opcional)"
                    options={categoryOptions}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantidadeMinima">Quantidade Mínima *</Label>
                  <Input
                    id="quantidadeMinima"
                    type="number"
                    min="0"
                    step="0.01"
                    value={quantidadeMinima}
                    onChange={(e) => setQuantidadeMinima(e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="armazem">Armazém *</Label>
                  <SimpleSelect
                    id="armazem"
                    value={armazemId}
                    onValueChange={setArmazemId}
                    placeholder="Selecione um armazém"
                    options={warehouseOptions}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custoUnitario">Custo Unitário (R$) *</Label>
                  <Input
                    id="custoUnitario"
                    type="number"
                    min="0"
                    step="0.01"
                    value={custoUnitario}
                    onChange={(e) => setCustoUnitario(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição/Observações</Label>
                <Textarea
                  id="descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Informações adicionais sobre o produto..."
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={createProductMutation.isPending || updateProductMutation.isPending}
                >
                  {(createProductMutation.isPending || updateProductMutation.isPending)
                    ? 'Salvando...'
                    : isEditMode
                      ? 'Atualizar Produto'
                      : 'Salvar Produto'
                  }
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  disabled={createProductMutation.isPending || updateProductMutation.isPending}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

  
      <Card>
        <CardHeader>
          <CardTitle>Produtos Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Armazém</TableHead>
                <TableHead className="text-right">Qtd. Mínima</TableHead>
                <TableHead className="text-right">Custo Unit.</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {produtos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhum produto cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                produtos.map(produto => {
                  const armazem = warehouses.find(a => a.id === produto.armazemId);
                  return (
                    <TableRow key={produto.id}>
                      <TableCell className="font-medium">{produto.nome}</TableCell>
                      <TableCell>{produto.categoriaNome || '-'}</TableCell>
                      <TableCell>{produto.armazemNome || '-'}</TableCell>
                      <TableCell className="text-right">{produto.quantidadeMinima}</TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(produto.custoUnitario)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => loadProductForEdit(produto)}
                            disabled={createProductMutation.isPending || updateProductMutation.isPending}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteId(produto.id)}
                            disabled={deleteProductMutation.isPending}
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
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteProductMutation.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={deleteProductMutation.isPending}
            >
              {deleteProductMutation.isPending ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Produtos;
