import { api } from '@/services/api';
import {
  ApiResponse,
  ApiProduct,
  ApiWarehouse,
  ApiCategory,
  ApiEntry,
  ApiExit,
  DashboardStats,
  DateRange,
  CreateProductRequest,
  UpdateProductRequest,
  CreateWarehouseRequest,
  CreateEntryRequest,
  CreateExitRequest,
  CreateCategoryRequest
} from '@/types';

// Products API
export const productsApi = {
  // Get all products
  getAll: async (): Promise<ApiResponse<ApiProduct[]>> => {
    return await api.get('/products/read/all');
  },

  // Get product by ID
  getById: async (id: string): Promise<ApiResponse<ApiProduct>> => {
    return await api.get(`/products/read/${id}`);
  },

  // Get products with low stock
  getLowStock: async (): Promise<ApiResponse<ApiProduct[]>> => {
    return await api.get('/products/read/low-stock');
  },

  // Get products by warehouse
  getByWarehouse: async (warehouseId: string): Promise<ApiResponse<ApiProduct[]>> => {
    return await api.get(`/products/read/warehouse/${warehouseId}`);
  },

  // Get products by category
  getByCategory: async (categoryId: string): Promise<ApiResponse<ApiProduct[]>> => {
    return await api.get(`/products/read/category/${categoryId}`);
  },

  // Create new product
  create: async (data: CreateProductRequest): Promise<ApiResponse<ApiProduct>> => {
    return await api.post('/products/create', data);
  },

  // Update product
  update: async (id: string, data: UpdateProductRequest): Promise<ApiResponse<ApiProduct>> => {
    return await api.put(`/products/update/${id}`, data);
  },

  // Delete product (soft delete)
  delete: async (id: string): Promise<ApiResponse> => {
    return await api.delete(`/products/delete/${id}`);
  },
};

// Warehouses API
export const warehousesApi = {
  // Get all warehouses
  getAll: async (): Promise<ApiResponse<ApiWarehouse[]>> => {
    return await api.get('/warehouses/read/all');
  },

  // Get warehouse by ID
  getById: async (id: string): Promise<ApiResponse<ApiWarehouse>> => {
    return await api.get(`/warehouses/read/${id}`);
  },

  // Create new warehouse
  create: async (data: CreateWarehouseRequest): Promise<ApiResponse<ApiWarehouse>> => {
    return await api.post('/warehouses/create', data);
  },

  // Update warehouse
  update: async (id: string, data: Partial<CreateWarehouseRequest>): Promise<ApiResponse<ApiWarehouse>> => {
    return await api.put(`/warehouses/update/${id}`, data);
  },

  // Delete warehouse
  delete: async (id: string): Promise<ApiResponse> => {
    return await api.delete(`/warehouses/delete/${id}`);
  },
};

// Categories API
export const categoriesApi = {
  // Get all categories
  getAll: async (): Promise<ApiResponse<ApiCategory[]>> => {
    return await api.get('/categories/read/all');
  },

  // Get category by ID
  getById: async (id: string): Promise<ApiResponse<ApiCategory>> => {
    return await api.get(`/categories/read/${id}`);
  },

  // Create new category
  create: async (data: CreateCategoryRequest): Promise<ApiResponse<ApiCategory>> => {
    return await api.post('/categories/create', data);
  },

  // Update category
  update: async (id: string, data: Partial<CreateCategoryRequest>): Promise<ApiResponse<ApiCategory>> => {
    return await api.put(`/categories/update/${id}`, data);
  },

  // Delete category
  delete: async (id: string): Promise<ApiResponse> => {
    return await api.delete(`/categories/delete/${id}`);
  },
};

// Entries API (Stock Entries)
export const entriesApi = {
  // Get all entries
  getAll: async (): Promise<ApiResponse<ApiEntry[]>> => {
    return await api.get('/entries/read/all');
  },

  // Get entries by product
  getByProduct: async (productId: string): Promise<ApiResponse<ApiEntry[]>> => {
    return await api.get(`/entries/read/product/${productId}`);
  },

  // Get entries by warehouse
  getByWarehouse: async (warehouseId: string): Promise<ApiResponse<ApiEntry[]>> => {
    return await api.get(`/entries/read/warehouse/${warehouseId}`);
  },

  // Get entries by date range
  getByDateRange: async (dateRange: DateRange): Promise<ApiResponse<ApiEntry[]>> => {
    return await api.post('/entries/read/date-range', dateRange);
  },

  // Create new entry
  create: async (data: CreateEntryRequest): Promise<ApiResponse<ApiEntry>> => {
    return await api.post('/entries/create', data);
  },

  // Delete entry
  delete: async (id: string): Promise<ApiResponse> => {
    return await api.delete(`/entries/delete/${id}`);
  },
};

// Exits API (Stock Exits)
export const exitsApi = {
  // Get all exits
  getAll: async (): Promise<ApiResponse<ApiExit[]>> => {
    return await api.get('/exits/read/all');
  },

  // Get exits by product
  getByProduct: async (productId: string): Promise<ApiResponse<ApiExit[]>> => {
    return await api.get(`/exits/read/product/${productId}`);
  },

  // Get exits by warehouse
  getByWarehouse: async (warehouseId: string): Promise<ApiResponse<ApiExit[]>> => {
    return await api.get(`/exits/read/warehouse/${warehouseId}`);
  },

  // Get exits by date range
  getByDateRange: async (dateRange: DateRange): Promise<ApiResponse<ApiExit[]>> => {
    return await api.post('/exits/read/date-range', dateRange);
  },

  // Create new exit
  create: async (data: CreateExitRequest): Promise<ApiResponse<ApiExit>> => {
    return await api.post('/exits/create', data);
  },

  // Delete exit
  delete: async (id: string): Promise<ApiResponse> => {
    return await api.delete(`/exits/delete/${id}`);
  },
};

// Users API (for future authentication integration)
export const usersApi = {
  // Login
  login: async (email: string, password: string): Promise<ApiResponse> => {
    return await api.post('/users/login', { email, password });
  },

  // Get current user profile
  getCurrent: async (): Promise<ApiResponse> => {
    return await api.get('/users/me');
  },

  // Get all users
  getAll: async (): Promise<ApiResponse> => {
    return await api.get('/users/read/all');
  },

  // Create new user
  create: async (data: any): Promise<ApiResponse> => {
    return await api.post('/users/create', data);
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse> => {
    return await api.post('/users/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },

  // Update user profile
  update: async (id: string, data: any): Promise<ApiResponse> => {
    return await api.put(`/users/update/${id}`, data);
  },
};

// Roles API
export const rolesApi = {
  // Get all roles
  getAll: async (): Promise<ApiResponse> => {
    return await api.get('/roles/read/all');
  },
};

// Gender API
export const genderApi = {
  // Get all genders
  getAll: async (): Promise<ApiResponse> => {
    return await api.get('/gender/read/all');
  },
};

// Dashboard API (composed from other endpoints)
export const dashboardApi = {
  // Get dashboard statistics
  getStats: async (): Promise<DashboardStats> => {
    // Since there's no dedicated dashboard endpoint, we'll compose it
    const [productsRes, warehousesRes, lowStockRes] = await Promise.all([
      productsApi.getAll(),
      warehousesApi.getAll(),
      productsApi.getLowStock(),
    ]);

    const products = productsRes.data || [];
    const warehouses = warehousesRes.data || [];
    const lowStockProducts = lowStockRes.data || [];

    return {
      totalProducts: products.length,
      totalWarehouses: warehouses.length,
      lowStockProducts: lowStockProducts.length,
      totalValue: products.reduce((sum, p) => sum + (p.current_stock * p.unit_cost), 0),
      recentMovements: 0, // Would need to fetch entries/exits and calculate
    };
  },
};