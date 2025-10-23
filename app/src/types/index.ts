// API Response Types (matching backend)
export interface ApiProduct {
  id: string;
  name: string;
  category_id?: string;
  category_name?: string;
  warehouse_id: string;
  warehouse_name: string;
  min_quantity: number;
  unit_cost: number;
  observation?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  current_stock: number;
}

export interface ApiWarehouse {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiCategory {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiEntry {
  id: string;
  product_id: string;
  product_name?: string;
  quantity: number;
  entry_date: string;
  observation?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiExit {
  id: string;
  product_id: string;
  product_name?: string;
  quantity: number;
  exit_date: string;
  observation?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  gender_id?: string;
  gender_name?: string;
  role_id: string;
  role_name: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiRole {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiGender {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// Frontend Types (for UI components)
export interface Armazem {
  id: string;
  nome: string;
  descricao: string;
  criadoEm: string;
}

export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  quantidadeMinima: number;
  armazemId: string;
  armazemNome: string;
  custoUnitario: number;
  categoriaId?: string;
  categoriaNome?: string;
  criadoEm: string;
}

export interface Movimentacao {
  id: string;
  tipo: 'entrada' | 'saida';
  produtoId: string;
  produtoNome: string;
  quantidade: number;
  data: string;
  observacao?: string;
  criadoEm: string;
}

export interface Categoria {
  id: string;
  nome: string;
  descricao?: string;
  criadoEm: string;
}

export type StatusProduto = 'critical' | 'warning' | 'success';

export interface ProdutoComEstoque extends Produto {
  quantidadeAtual: number;
  valorTotal: number;
  status: StatusProduto;
  armazem?: Armazem;
}

// Form Types (for forms)
export interface ProdutoForm {
  nome: string;
  descricao?: string;
  quantidadeMinima: number;
  armazemId: string;
  custoUnitario: number;
  categoriaId?: string;
}

export interface ArmazemForm {
  nome: string;
  descricao?: string;
}

export interface CategoriaForm {
  nome: string;
  descricao?: string;
}

export interface MovimentacaoForm {
  tipo: 'entrada' | 'saida';
  produtoId: string;
  quantidade: number;
  data: string;
  observacao?: string;
}

// API Request Types
export interface CreateProductRequest {
  name: string;
  warehouse_id: string;
  category_id?: string;
  min_quantity: number;
  unit_cost: number;
  observation?: string;
}

export interface UpdateProductRequest {
  name?: string;
  warehouse_id?: string;
  category_id?: string;
  min_quantity?: number;
  unit_cost?: number;
  observation?: string;
}

export interface CreateWarehouseRequest {
  name: string;
  description?: string;
}

export interface CreateEntryRequest {
  product_id: string;
  quantity: number;
  entry_date: string;
  observation?: string;
}

export interface CreateExitRequest {
  product_id: string;
  quantity: number;
  exit_date: string;
  observation?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  gender_id?: string;
  role_id: string;
}

// Dashboard Stats Types
export interface DashboardStats {
  totalProducts: number;
  totalWarehouses: number;
  lowStockProducts: number;
  mediumStockProducts: number;
  totalValue: number;
  recentMovements: number;
}

// Date Range Filter
export interface DateRange {
  start_date: string;
  end_date: string;
}
