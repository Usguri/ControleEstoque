export interface DadosProdutos {
  nomeProduto: string;
  statusProduto: boolean;
  preco: string;
  promocao: boolean;
  precoPromocao: string;
  imagemProduto: (string | File | ImagemProduto)[];
  quantidadeComprada: number;
  codProduto: string;
  descricao: string;
  dimensoes: string;
  idCategoria: string;
  quantidadeAtual?: number;
  idProduto?: number;
}

export const produtoVazio: DadosProdutos = {
  nomeProduto: "",
  statusProduto: true,
  preco: "",
  promocao: false,
  precoPromocao: "",
  imagemProduto: [],
  quantidadeComprada: 0,
  codProduto: "",
  descricao: "",
  dimensoes: "",
  idCategoria: "",
  quantidadeAtual: 0,
};

export interface ProdutoListagem {
  idProduto: number;
  codProduto: string;
  idCategoria: number;
  nomeProduto: string;
  preco: string;
  promocao: boolean;
  quantidadeAtual: number;
  quantidadeComprada: number;
  quantidadeVendida: number;
  statusProduto: boolean;
  totalImagens?: string;
  categoria: string;
  dimensoes?: string;
  descricao?: string;
  precoPromocao?: string;
  imagemProduto?: (string | File)[];
}

export interface ListaProdutosComprar {
  idProduto: number;
  quantidade: number;
}

export interface ErrosProduto {
  categoria?: boolean;
  nomeProduto?: boolean;
  codProduto?: boolean;
  preco?: boolean;
}

export interface ImagemProduto {
  caminho: string;
  nome: string;
}
