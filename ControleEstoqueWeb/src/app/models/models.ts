export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface Categoria {
  id: number;
  nome: string;
  produtos?: Produto[];
}

export interface Produto {
  id: number;
  categoriaId: number;
  nome: string;
  descricao: string;
  preco: number;
  quantidadeEstoque: number;
  dataCadastro: string; 
  ativo: boolean;
  categoria: Categoria | null;
}
