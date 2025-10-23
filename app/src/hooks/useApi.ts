import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { productsApi, warehousesApi, categoriesApi, entriesApi, exitsApi } from '@/services/api/endpoints';
import {
  ApiProduct,
  ApiWarehouse,
  ApiCategory,
  ApiEntry,
  ApiExit,
  CreateProductRequest,
  UpdateProductRequest,
  CreateWarehouseRequest,
  CreateEntryRequest,
  CreateExitRequest,
  CreateCategoryRequest,
  DashboardStats
} from '@/types';
import {
  transformProdutoFormToApi,
  transformArmazemFormToApi,
  transformMovimentacaoFormToEntry,
  transformMovimentacaoFormToExit,
  calculateDashboardStats,
  transformProdutoWithEstoque
} from '@/lib/transform';

// Query keys for cache management
export const queryKeys = {
  products: ['products'] as const,
  warehouses: ['warehouses'] as const,
  categories: ['categories'] as const,
  entries: ['entries'] as const,
  exits: ['exits'] as const,
  dashboard: ['dashboard'] as const,
  product: (id: string) => ['products', id] as const,
  warehouse: (id: string) => ['warehouses', id] as const,
  category: (id: string) => ['categories', id] as const,
  warehouseProducts: (id: string) => ['products', 'warehouse', id] as const,
  categoryProducts: (id: string) => ['products', 'category', id] as const,
  productEntries: (id: string) => ['entries', 'product', id] as const,
  productExits: (id: string) => ['exits', 'product', id] as const,
  warehouseEntries: (id: string) => ['entries', 'warehouse', id] as const,
  warehouseExits: (id: string) => ['exits', 'warehouse', id] as const,
};

// Products Queries
export const useProducts = () => {
  return useQuery({
    queryKey: queryKeys.products,
    queryFn: () => productsApi.getAll(),
    select: (response) => response.data || [],
    staleTime: 0, // Always fetch fresh data
  });
};

export const useLowStockProducts = () => {
  return useQuery({
    queryKey: ['products', 'low-stock'],
    queryFn: () => productsApi.getLowStock(),
    select: (response) => response.data || [],
    staleTime: 0, // Always fetch fresh data
  });
};

export const useProductsNeedingAttention = () => {
  return useQuery({
    queryKey: ['products', 'needing-attention'],
    queryFn: () => productsApi.getAll(),
    select: (response) => {
      const products = response.data || [];
      return products
        .map(transformProdutoWithEstoque)
        .filter(p => p.status === 'critical' || p.status === 'warning')
        .sort((a, b) => {
          if (a.status === 'critical' && b.status !== 'critical') return -1;
          if (a.status !== 'critical' && b.status === 'critical') return 1;
          return 0;
        });
    },
    staleTime: 0, // Always fetch fresh data
  });
};

export const useProduct = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => productsApi.getById(id),
    select: (response) => response.data,
    enabled: enabled && !!id,
    staleTime: 0, // Always fetch fresh data
  });
};

export const useWarehouseProducts = (warehouseId: string) => {
  return useQuery({
    queryKey: queryKeys.warehouseProducts(warehouseId),
    queryFn: () => productsApi.getByWarehouse(warehouseId),
    select: (response) => response.data || [],
    enabled: !!warehouseId,
    staleTime: 0, // Always fetch fresh data
  });
};

export const useCategoryProducts = (categoryId: string) => {
  return useQuery({
    queryKey: queryKeys.categoryProducts(categoryId),
    queryFn: () => productsApi.getByCategory(categoryId),
    select: (response) => response.data || [],
    enabled: !!categoryId,
    staleTime: 0, // Always fetch fresh data
  });
};

// Warehouses Queries
export const useWarehouses = () => {
  return useQuery({
    queryKey: queryKeys.warehouses,
    queryFn: () => warehousesApi.getAll(),
    select: (response) => response.data || [],
    staleTime: 0, // Always fetch fresh data
  });
};

export const useWarehouse = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.warehouse(id),
    queryFn: () => warehousesApi.getById(id),
    select: (response) => response.data,
    enabled: enabled && !!id,
    staleTime: 0, // Always fetch fresh data
  });
};

// Categories Queries
export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => categoriesApi.getAll(),
    select: (response) => response.data || [],
    staleTime: 0, // Always fetch fresh data
  });
};

// Entries/Exits Queries
export const useEntries = () => {
  return useQuery({
    queryKey: queryKeys.entries,
    queryFn: () => entriesApi.getAll(),
    select: (response) => response.data || [],
    staleTime: 0, // Always fetch fresh data
  });
};

export const useExits = () => {
  return useQuery({
    queryKey: queryKeys.exits,
    queryFn: () => exitsApi.getAll(),
    select: (response) => response.data || [],
    staleTime: 0, // Always fetch fresh data
  });
};

export const useProductEntries = (productId: string) => {
  return useQuery({
    queryKey: queryKeys.productEntries(productId),
    queryFn: () => entriesApi.getByProduct(productId),
    select: (response) => response.data || [],
    enabled: !!productId,
    staleTime: 0, // Always fetch fresh data
  });
};

export const useProductExits = (productId: string) => {
  return useQuery({
    queryKey: queryKeys.productExits(productId),
    queryFn: () => exitsApi.getByProduct(productId),
    select: (response) => response.data || [],
    enabled: !!productId,
    staleTime: 0, // Always fetch fresh data
  });
};

// Dashboard Query
export const useDashboardStats = () => {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: async () => {
      // Compose dashboard stats from multiple API calls
      const [productsRes, warehousesRes, entriesRes, exitsRes] = await Promise.all([
        productsApi.getAll(),
        warehousesApi.getAll(),
        entriesApi.getAll(),
        exitsApi.getAll(),
      ]);

      const products = productsRes.data || [];
      const warehouses = warehousesRes.data || [];
      const entries = entriesRes.data || [];
      const exits = exitsRes.data || [];

      // Use the centralized calculation function
      return calculateDashboardStats(products, warehouses, entries, exits);
    },
    staleTime: 0, // Always fetch fresh data
  });
};

// Mutations
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: any) => {
      const apiData = transformProdutoFormToApi(formData);
      return productsApi.create(apiData);
    },
    onSuccess: () => {
      // Invalidate products queries to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => {
      const apiData = transformProdutoFormToApi(data);
      return productsApi.update(id, apiData);
    },
    onSuccess: (_, { id }) => {
      // Invalidate specific product and products list
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      queryClient.invalidateQueries({ queryKey: queryKeys.product(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
};

export const useCreateWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: any) => {
      const apiData = transformArmazemFormToApi(formData);
      return warehousesApi.create(apiData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.warehouses });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
};

export const useUpdateWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => {
      const apiData = transformArmazemFormToApi(data);
      return warehousesApi.update(id, apiData);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.warehouses });
      queryClient.invalidateQueries({ queryKey: queryKeys.warehouse(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
};

export const useDeleteWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => warehousesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.warehouses });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
};

export const useCreateEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: any) => {
      const apiData = transformMovimentacaoFormToEntry(formData);
      return entriesApi.create(apiData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.entries });
      queryClient.invalidateQueries({ queryKey: queryKeys.products }); // Product stock might change
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
};

export const useCreateExit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: any) => {
      const apiData = transformMovimentacaoFormToExit(formData);
      return exitsApi.create(apiData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.exits });
      queryClient.invalidateQueries({ queryKey: queryKeys.products }); // Product stock might change
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
};

// Categories Mutations
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: any) => {
      const apiData = {
        name: formData.nome,
        description: formData.descricao,
      };
      return categoriesApi.create(apiData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => {
      const apiData = {
        name: data.nome,
        description: data.descricao,
      };
      return categoriesApi.update(id, apiData);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      queryClient.invalidateQueries({ queryKey: queryKeys.category(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
};

// Utility function to prefetch data
export const prefetchProduct = async (queryClient: QueryClient, id: string) => {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => productsApi.getById(id),
    // Use default staleTime (0) for consistency
  });
};

export const prefetchWarehouse = async (queryClient: QueryClient, id: string) => {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.warehouse(id),
    queryFn: () => warehousesApi.getById(id),
    // Use default staleTime (0) for consistency
  });
};

// Delete mutations for movements
export const useDeleteEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      console.log('🗑️ useDeleteEntry - ID:', id);
      return entriesApi.delete(id);
    },
    onSuccess: (response) => {
      console.log('✅ useDeleteEntry - Success:', response);
      queryClient.invalidateQueries({ queryKey: queryKeys.entries });
      queryClient.invalidateQueries({ queryKey: queryKeys.products }); // Stock might change
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
    onError: (error) => {
      console.log('❌ useDeleteEntry - Error:', error);
    },
  });
};

export const useDeleteExit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      console.log('🗑️ useDeleteExit - ID:', id);
      return exitsApi.delete(id);
    },
    onSuccess: (response) => {
      console.log('✅ useDeleteExit - Success:', response);
      queryClient.invalidateQueries({ queryKey: queryKeys.exits });
      queryClient.invalidateQueries({ queryKey: queryKeys.products }); // Stock might change
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
    onError: (error) => {
      console.log('❌ useDeleteExit - Error:', error);
    },
  });
};