import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Armazem, Produto, Movimentacao, ProdutoComEstoque, StatusProduto } from '@/types';

interface EstoqueContextType {
  armazens: Armazem[];
  produtos: Produto[];
  movimentacoes: Movimentacao[];
  adicionarArmazem: (armazem: Omit<Armazem, 'id' | 'criadoEm'>) => void;
  editarArmazem: (id: string, dados: Partial<Armazem>) => void;
  excluirArmazem: (id: string) => boolean;
  adicionarProduto: (produto: Omit<Produto, 'id' | 'criadoEm'>) => void;
  editarProduto: (id: string, dados: Partial<Produto>) => void;
  excluirProduto: (id: string) => boolean;
  adicionarMovimentacao: (movimentacao: Omit<Movimentacao, 'id' | 'criadoEm'>) => void;
  getProdutosComEstoque: () => ProdutoComEstoque[];
  getEstoqueAtual: (produtoId: string) => number;
  getValorTotalEstoque: () => number;
}

const EstoqueContext = createContext<EstoqueContextType | undefined>(undefined);

export const useEstoque = () => {
  const context = useContext(EstoqueContext);
  if (!context) {
    throw new Error('useEstoque deve ser usado dentro de EstoqueProvider');
  }
  return context;
};

interface EstoqueProviderProps {
  children: ReactNode;
}

export const EstoqueProvider: React.FC<EstoqueProviderProps> = ({ children }) => {
  const [armazens, setArmazens] = useState<Armazem[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);

  // Carregar dados do localStorage ou criar dados de exemplo
  useEffect(() => {
    const armazensData = localStorage.getItem('armazens');
    const produtosData = localStorage.getItem('produtos');
    const movimentacoesData = localStorage.getItem('movimentacoes');

    if (armazensData && produtosData && movimentacoesData) {
      setArmazens(JSON.parse(armazensData));
      setProdutos(JSON.parse(produtosData));
      setMovimentacoes(JSON.parse(movimentacoesData));
    } else {
      // Criar dados de exemplo
      const armazensExemplo: Armazem[] = [
        {
          id: crypto.randomUUID(),
          nome: 'Estoque Seco',
          descricao: 'Produtos não perecíveis em temperatura ambiente',
          criadoEm: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          nome: 'Câmara Fria',
          descricao: 'Produtos refrigerados e congelados',
          criadoEm: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          nome: 'Estoque de Bebidas',
          descricao: 'Bebidas e líquidos',
          criadoEm: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          nome: 'Estoque de Balcão',
          descricao: 'Produtos de venda rápida',
          criadoEm: new Date().toISOString(),
        },
      ];

      const produtosExemplo: Produto[] = [
        // Estoque Seco
        {
          id: crypto.randomUUID(),
          nome: 'Arroz Integral 1kg',
          codigo: 'ARR-001',
          quantidadeMinima: 20,
          armazemId: armazensExemplo[0].id,
          custoUnitario: 8.50,
          quantidadeInicial: 45,
          descricao: 'Arroz integral tipo 1',
          criadoEm: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          nome: 'Feijão Preto 1kg',
          codigo: 'FEI-001',
          quantidadeMinima: 30,
          armazemId: armazensExemplo[0].id,
          custoUnitario: 7.20,
          quantidadeInicial: 12,
          descricao: 'Feijão preto tipo 1',
          criadoEm: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          nome: 'Macarrão Espaguete 500g',
          codigo: 'MAC-001',
          quantidadeMinima: 25,
          armazemId: armazensExemplo[0].id,
          custoUnitario: 4.30,
          quantidadeInicial: 28,
          descricao: 'Macarrão de sêmola',
          criadoEm: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          nome: 'Óleo de Soja 900ml',
          codigo: 'OLE-001',
          quantidadeMinima: 15,
          armazemId: armazensExemplo[0].id,
          custoUnitario: 6.80,
          quantidadeInicial: 35,
          descricao: 'Óleo de soja refinado',
          criadoEm: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          nome: 'Açúcar Cristal 1kg',
          codigo: 'ACU-001',
          quantidadeMinima: 20,
          armazemId: armazensExemplo[0].id,
          custoUnitario: 3.90,
          quantidadeInicial: 50,
          descricao: 'Açúcar cristal',
          criadoEm: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          nome: 'Café Torrado 500g',
          codigo: 'CAF-001',
          quantidadeMinima: 10,
          armazemId: armazensExemplo[0].id,
          custoUnitario: 12.50,
          quantidadeInicial: 8,
          descricao: 'Café torrado e moído',
          criadoEm: new Date().toISOString(),
        },
        // Câmara Fria
        {
          id: crypto.randomUUID(),
          nome: 'Leite Integral 1L',
          codigo: 'LEI-001',
          quantidadeMinima: 40,
          armazemId: armazensExemplo[1].id,
          custoUnitario: 4.50,
          quantidadeInicial: 55,
          descricao: 'Leite integral UHT',
          criadoEm: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          nome: 'Queijo Mussarela 500g',
          codigo: 'QUE-001',
          quantidadeMinima: 15,
          armazemId: armazensExemplo[1].id,
          custoUnitario: 22.90,
          quantidadeInicial: 18,
          descricao: 'Queijo mussarela fatiado',
          criadoEm: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          nome: 'Presunto Cozido 200g',
          codigo: 'PRE-001',
          quantidadeMinima: 12,
          armazemId: armazensExemplo[1].id,
          custoUnitario: 8.90,
          quantidadeInicial: 9,
          descricao: 'Presunto cozido fatiado',
          criadoEm: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          nome: 'Manteiga com Sal 200g',
          codigo: 'MAN-001',
          quantidadeMinima: 20,
          armazemId: armazensExemplo[1].id,
          custoUnitario: 9.80,
          quantidadeInicial: 25,
          descricao: 'Manteiga com sal',
          criadoEm: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          nome: 'Iogurte Natural 170g',
          codigo: 'IOG-001',
          quantidadeMinima: 30,
          armazemId: armazensExemplo[1].id,
          custoUnitario: 2.50,
          quantidadeInicial: 42,
          descricao: 'Iogurte natural integral',
          criadoEm: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          nome: 'Sorvete 2L',
          codigo: 'SOR-001',
          quantidadeMinima: 8,
          armazemId: armazensExemplo[1].id,
          custoUnitario: 18.90,
          quantidadeInicial: 6,
          descricao: 'Sorvete sabores variados',
          criadoEm: new Date().toISOString(),
        },
        // Estoque de Bebidas
        {
          id: crypto.randomUUID(),
          nome: 'Refrigerante Cola 2L',
          codigo: 'REF-001',
          quantidadeMinima: 25,
          armazemId: armazensExemplo[2].id,
          custoUnitario: 5.90,
          quantidadeInicial: 48,
          descricao: 'Refrigerante sabor cola',
          criadoEm: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          nome: 'Água Mineral 1.5L',
          codigo: 'AGU-001',
          quantidadeMinima: 50,
          armazemId: armazensExemplo[2].id,
          custoUnitario: 1.80,
          quantidadeInicial: 65,
          descricao: 'Água mineral sem gás',
          criadoEm: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          nome: 'Suco de Laranja 1L',
          codigo: 'SUC-001',
          quantidadeMinima: 20,
          armazemId: armazensExemplo[2].id,
          custoUnitario: 6.50,
          quantidadeInicial: 15,
          descricao: 'Suco integral de laranja',
          criadoEm: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          nome: 'Cerveja Lata 350ml',
          codigo: 'CER-001',
          quantidadeMinima: 60,
          armazemId: armazensExemplo[2].id,
          custoUnitario: 2.80,
          quantidadeInicial: 72,
          descricao: 'Cerveja pilsen lata',
          criadoEm: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          nome: 'Energético 250ml',
          codigo: 'ENE-001',
          quantidadeMinima: 15,
          armazemId: armazensExemplo[2].id,
          custoUnitario: 7.20,
          quantidadeInicial: 22,
          descricao: 'Bebida energética',
          criadoEm: new Date().toISOString(),
        },
        // Estoque de Balcão
        {
          id: crypto.randomUUID(),
          nome: 'Chocolate ao Leite 90g',
          codigo: 'CHO-001',
          quantidadeMinima: 30,
          armazemId: armazensExemplo[3].id,
          custoUnitario: 4.50,
          quantidadeInicial: 38,
          descricao: 'Chocolate ao leite',
          criadoEm: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          nome: 'Biscoito Recheado 140g',
          codigo: 'BIS-001',
          quantidadeMinima: 25,
          armazemId: armazensExemplo[3].id,
          custoUnitario: 3.20,
          quantidadeInicial: 32,
          descricao: 'Biscoito recheado sabores',
          criadoEm: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          nome: 'Salgadinho 80g',
          codigo: 'SAL-001',
          quantidadeMinima: 20,
          armazemId: armazensExemplo[3].id,
          custoUnitario: 4.80,
          quantidadeInicial: 28,
          descricao: 'Salgadinho de milho',
          criadoEm: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          nome: 'Bala Mastigável 100g',
          codigo: 'BAL-001',
          quantidadeMinima: 15,
          armazemId: armazensExemplo[3].id,
          custoUnitario: 2.90,
          quantidadeInicial: 11,
          descricao: 'Bala mastigável frutas',
          criadoEm: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          nome: 'Chiclete 5 unidades',
          codigo: 'CHI-001',
          quantidadeMinima: 40,
          armazemId: armazensExemplo[3].id,
          custoUnitario: 1.50,
          quantidadeInicial: 52,
          descricao: 'Chiclete hortelã',
          criadoEm: new Date().toISOString(),
        },
      ];

      const movimentacoesExemplo: Movimentacao[] = produtosExemplo.map(produto => ({
        id: crypto.randomUUID(),
        tipo: 'entrada' as const,
        produtoId: produto.id,
        quantidade: produto.quantidadeInicial,
        data: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        observacao: 'Estoque inicial',
        criadoEm: new Date().toISOString(),
      }));

      // Adicionar algumas movimentações extras para simular atividade
      const movimentacoesExtras: Movimentacao[] = [
        // Saídas
        {
          id: crypto.randomUUID(),
          tipo: 'saida',
          produtoId: produtosExemplo[1].id, // Feijão
          quantidade: 18,
          data: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          observacao: 'Venda varejo',
          criadoEm: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          tipo: 'saida',
          produtoId: produtosExemplo[5].id, // Café
          quantidade: 2,
          data: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          observacao: 'Consumo interno',
          criadoEm: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          tipo: 'saida',
          produtoId: produtosExemplo[8].id, // Presunto
          quantidade: 3,
          data: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          observacao: 'Venda',
          criadoEm: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          tipo: 'saida',
          produtoId: produtosExemplo[11].id, // Sorvete
          quantidade: 2,
          data: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          observacao: 'Venda',
          criadoEm: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          tipo: 'saida',
          produtoId: produtosExemplo[18].id, // Bala
          quantidade: 4,
          data: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          observacao: 'Venda varejo',
          criadoEm: new Date().toISOString(),
        },
        // Entradas
        {
          id: crypto.randomUUID(),
          tipo: 'entrada',
          produtoId: produtosExemplo[13].id, // Suco
          quantidade: 10,
          data: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          observacao: 'Reposição de estoque',
          criadoEm: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          tipo: 'entrada',
          produtoId: produtosExemplo[14].id, // Cerveja
          quantidade: 24,
          data: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          observacao: 'Compra semanal',
          criadoEm: new Date().toISOString(),
        },
      ];

      setArmazens(armazensExemplo);
      setProdutos(produtosExemplo);
      setMovimentacoes([...movimentacoesExemplo, ...movimentacoesExtras]);
    }
  }, []);

  // Salvar armazéns
  useEffect(() => {
    localStorage.setItem('armazens', JSON.stringify(armazens));
  }, [armazens]);

  // Salvar produtos
  useEffect(() => {
    localStorage.setItem('produtos', JSON.stringify(produtos));
  }, [produtos]);

  // Salvar movimentações
  useEffect(() => {
    localStorage.setItem('movimentacoes', JSON.stringify(movimentacoes));
  }, [movimentacoes]);

  const adicionarArmazem = (armazem: Omit<Armazem, 'id' | 'criadoEm'>) => {
    const novoArmazem: Armazem = {
      ...armazem,
      id: crypto.randomUUID(),
      criadoEm: new Date().toISOString(),
    };
    setArmazens([...armazens, novoArmazem]);
  };

  const editarArmazem = (id: string, dados: Partial<Armazem>) => {
    setArmazens(armazens.map(a => (a.id === id ? { ...a, ...dados } : a)));
  };

  const excluirArmazem = (id: string): boolean => {
    const temProdutos = produtos.some(p => p.armazemId === id);
    if (temProdutos) return false;
    setArmazens(armazens.filter(a => a.id !== id));
    return true;
  };

  const adicionarProduto = (produto: Omit<Produto, 'id' | 'criadoEm'>) => {
    const novoProduto: Produto = {
      ...produto,
      id: crypto.randomUUID(),
      criadoEm: new Date().toISOString(),
    };
    setProdutos([...produtos, novoProduto]);

    // Se tem quantidade inicial, criar movimentação de entrada
    if (produto.quantidadeInicial > 0) {
      adicionarMovimentacao({
        tipo: 'entrada',
        produtoId: novoProduto.id,
        quantidade: produto.quantidadeInicial,
        data: new Date().toISOString(),
        observacao: 'Estoque inicial',
      });
    }
  };

  const editarProduto = (id: string, dados: Partial<Produto>) => {
    setProdutos(produtos.map(p => (p.id === id ? { ...p, ...dados } : p)));
  };

  const excluirProduto = (id: string): boolean => {
    const temMovimentacoes = movimentacoes.some(m => m.produtoId === id);
    if (temMovimentacoes) return false;
    setProdutos(produtos.filter(p => p.id !== id));
    return true;
  };

  const adicionarMovimentacao = (movimentacao: Omit<Movimentacao, 'id' | 'criadoEm'>) => {
    const novaMovimentacao: Movimentacao = {
      ...movimentacao,
      id: crypto.randomUUID(),
      criadoEm: new Date().toISOString(),
    };
    setMovimentacoes([...movimentacoes, novaMovimentacao]);
  };

  const getEstoqueAtual = (produtoId: string): number => {
    const produto = produtos.find(p => p.id === produtoId);
    if (!produto) return 0;

    const movimentacoesProduto = movimentacoes.filter(m => m.produtoId === produtoId);
    const totalEntradas = movimentacoesProduto
      .filter(m => m.tipo === 'entrada')
      .reduce((sum, m) => sum + m.quantidade, 0);
    const totalSaidas = movimentacoesProduto
      .filter(m => m.tipo === 'saida')
      .reduce((sum, m) => sum + m.quantidade, 0);

    return totalEntradas - totalSaidas;
  };

  const getStatusProduto = (quantidadeAtual: number, quantidadeMinima: number): StatusProduto => {
    if (quantidadeAtual < quantidadeMinima) return 'critical';
    if (quantidadeAtual < quantidadeMinima * 1.2) return 'warning';
    return 'success';
  };

  const getProdutosComEstoque = (): ProdutoComEstoque[] => {
    return produtos.map(produto => {
      const quantidadeAtual = getEstoqueAtual(produto.id);
      const valorTotal = quantidadeAtual * produto.custoUnitario;
      const status = getStatusProduto(quantidadeAtual, produto.quantidadeMinima);
      const armazem = armazens.find(a => a.id === produto.armazemId);

      return {
        ...produto,
        quantidadeAtual,
        valorTotal,
        status,
        armazem,
      };
    });
  };

  const getValorTotalEstoque = (): number => {
    return getProdutosComEstoque().reduce((total, produto) => total + produto.valorTotal, 0);
  };

  return (
    <EstoqueContext.Provider
      value={{
        armazens,
        produtos,
        movimentacoes,
        adicionarArmazem,
        editarArmazem,
        excluirArmazem,
        adicionarProduto,
        editarProduto,
        excluirProduto,
        adicionarMovimentacao,
        getProdutosComEstoque,
        getEstoqueAtual,
        getValorTotalEstoque,
      }}
    >
      {children}
    </EstoqueContext.Provider>
  );
};
