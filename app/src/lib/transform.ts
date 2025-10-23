import {
  ApiProduct,
  ApiWarehouse,
  ApiCategory,
  ApiEntry,
  ApiExit,
  Armazem,
  Produto,
  Movimentacao,
  Categoria,
  ProdutoComEstoque,
  CreateProductRequest,
  CreateWarehouseRequest,
  CreateEntryRequest,
  CreateExitRequest,
  CreateCategoryRequest,
  StatusProduto,
  DashboardStats
} from '@/types';

// Date formatting utilities
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toISOString().split('T')[0];
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Currency formatting
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Product transformations
export const transformApiProduct = (apiProduct: ApiProduct): Produto => {
  return {
    id: apiProduct.id,
    nome: apiProduct.name,
    descricao: apiProduct.observation || '',
    quantidadeMinima: apiProduct.min_quantity,
    armazemId: apiProduct.warehouse_id,
    armazemNome: apiProduct.warehouse_name,
    custoUnitario: apiProduct.unit_cost,
    categoriaId: apiProduct.category_id,
    categoriaNome: apiProduct.category_name,
    criadoEm: apiProduct.created_at,
  };
};

export const transformProdutoWithEstoque = (apiProduct: ApiProduct): ProdutoComEstoque => {
  const produto = transformApiProduct(apiProduct);
  const quantidadeAtual = apiProduct.current_stock;
  const valorTotal = quantidadeAtual * apiProduct.unit_cost;
  const status = calculateStatusProduto(quantidadeAtual, apiProduct.min_quantity);

  return {
    ...produto,
    quantidadeAtual,
    valorTotal,
    status,
  };
};

export const transformProdutoFormToApi = (form: any): CreateProductRequest => {
  return {
    name: form.nome,
    warehouse_id: form.armazemId,
    category_id: form.categoriaId,
    min_quantity: form.quantidadeMinima,
    unit_cost: form.custoUnitario,
    observation: form.descricao,
  };
};

// Warehouse transformations
export const transformApiWarehouse = (apiWarehouse: ApiWarehouse): Armazem => {
  return {
    id: apiWarehouse.id,
    nome: apiWarehouse.name,
    descricao: apiWarehouse.description || '',
    criadoEm: apiWarehouse.created_at,
  };
};

export const transformArmazemFormToApi = (form: any): CreateWarehouseRequest => {
  return {
    name: form.name,
    description: form.description,
  };
};

// Category transformations
export const transformApiCategory = (apiCategory: ApiCategory): Categoria => {
  return {
    id: apiCategory.id,
    nome: apiCategory.name,
    descricao: apiCategory.description || '',
    criadoEm: apiCategory.created_at,
  };
};

export const transformCategoriaFormToApi = (form: any): CreateCategoryRequest => {
  return {
    name: form.nome,
    description: form.descricao,
  };
};

// Movement transformations
export const transformApiEntryToMovimentacao = (apiEntry: ApiEntry): Movimentacao => {
  return {
    id: apiEntry.id,
    tipo: 'entrada',
    produtoId: apiEntry.product_id,
    produtoNome: apiEntry.product_name || '',
    quantidade: apiEntry.quantity,
    data: formatDate(apiEntry.entry_date),
    observacao: apiEntry.observation,
    criadoEm: apiEntry.created_at,
  };
};

export const transformApiExitToMovimentacao = (apiExit: ApiExit): Movimentacao => {
  return {
    id: apiExit.id,
    tipo: 'saida',
    produtoId: apiExit.product_id,
    produtoNome: apiExit.product_name || '',
    quantidade: apiExit.quantity,
    data: formatDate(apiExit.exit_date),
    observacao: apiExit.observation,
    criadoEm: apiExit.created_at,
  };
};

export const transformMovimentacaoFormToEntry = (form: any): CreateEntryRequest => {
  return {
    product_id: form.produtoId,
    quantity: form.quantidade,
    entry_date: form.data,
    observation: form.observacao,
  };
};

export const transformMovimentacaoFormToExit = (form: any): CreateExitRequest => {
  return {
    product_id: form.produtoId,
    quantity: form.quantidade,
    exit_date: form.data,
    observation: form.observacao,
  };
};

// Stock status calculation
export const calculateStatusProduto = (currentStock: number, minQuantity: number): StatusProduto => {
  if (currentStock < minQuantity) {
    return 'critical';
  } else if (currentStock < minQuantity * 1.2) {
    return 'warning';
  } else {
    return 'success';
  }
};

// Dashboard stats calculation
export const calculateDashboardStats = (
  products: ApiProduct[],
  warehouses: ApiWarehouse[],
  entries: ApiEntry[],
  exits: ApiExit[]
): DashboardStats => {
  const totalProducts = products.length;
  const totalWarehouses = warehouses.length;
  const lowStockProducts = products.filter(p => p.current_stock < p.min_quantity).length;
  const mediumStockProducts = products.filter(p =>
    p.current_stock >= p.min_quantity && p.current_stock < p.min_quantity * 1.2
  ).length;
  const totalValue = products.reduce((sum, p) => sum + (p.current_stock * p.unit_cost), 0);
  const recentMovements = [...entries, ...exits].filter(m => {
    const movementDate = new Date(m.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return movementDate >= weekAgo;
  }).length;

  return {
    totalProducts,
    totalWarehouses,
    lowStockProducts,
    mediumStockProducts,
    totalValue,
    recentMovements,
  };
};

// Merge entries and exits into unified movements list
export const mergeMovements = (
  entries: ApiEntry[],
  exits: ApiExit[]
): Movimentacao[] => {
  const entryMovements = entries.map(transformApiEntryToMovimentacao);
  const exitMovements = exits.map(transformApiExitToMovimentacao);

  // Combine and sort by date (newest first)
  return [...entryMovements, ...exitMovements]
    .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());
};

// Filter movements by date range
export const filterMovementsByDateRange = (
  movements: Movimentacao[],
  startDate: string,
  endDate: string
): Movimentacao[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999); // Include entire end date

  return movements.filter(movement => {
    const movementDate = new Date(movement.data);
    return movementDate >= start && movementDate <= end;
  });
};

// Filter products by warehouse
export const filterProductsByWarehouse = (
  products: ApiProduct[],
  warehouseId: string
): ApiProduct[] => {
  return products.filter(product => product.warehouse_id === warehouseId);
};

// Filter products by category
export const filterProductsByCategory = (
  products: ApiProduct[],
  categoryId: string
): ApiProduct[] => {
  return products.filter(product => product.category_id === categoryId);
};

// Generate example data (maintains compatibility with existing frontend)
export const generateExampleData = () => {
  // This can be removed once API integration is complete
  return {
    warehouses: [],
    products: [],
    categories: [],
    entries: [],
    exits: [],
  };
};

// Validation utilities
export const validateProductForm = (form: any): string[] => {
  const errors: string[] = [];

  if (!form.nome?.trim()) errors.push('Nome é obrigatório');
  if (!form.armazemId) errors.push('Armazém é obrigatório');
  if (!form.quantidadeMinima || form.quantidadeMinima <= 0) {
    errors.push('Quantidade mínima deve ser maior que zero');
  }
  if (!form.custoUnitario || form.custoUnitario <= 0) {
    errors.push('Custo unitário deve ser maior que zero');
  }

  return errors;
};

export const validateWarehouseForm = (form: any): string[] => {
  const errors: string[] = [];

  if (!form.nome?.trim()) errors.push('Nome é obrigatório');

  return errors;
};

export const validateMovimentacaoForm = (form: any): string[] => {
  const errors: string[] = [];

  if (!form.produtoId) errors.push('Produto é obrigatório');
  if (!form.quantidade || form.quantidade <= 0) {
    errors.push('Quantidade deve ser maior que zero');
  }
  if (!form.data) errors.push('Data é obrigatória');

  return errors;
};