export interface DadosCliente {
  empresa: string;
  cnpj: string;
  email: string;
  cidade: string;
  ie: string;
  telefone: string;
  idUsuario?: number;
  idCliente?: number;
  // codProd: string;
}

export const dadosClienteVazio: DadosCliente = {
  empresa: "",
  telefone: "",
  cidade: "",
  email: "",
  ie: "",
  cnpj: "",
  // codProd: "",
};

export interface DadosListaPedido {
  idlista: number;
  cidade: string;
  cnpj: string;
  email: string;
  empresa: string;
  ie: string;
  fone: string;
  datahora: string;
  compfinalizada: boolean;
}

export interface Pedido {
  quantidade: number;
  codProduto: string;
  mercadoria: string;
  valorUnitario: string;
  valorTotal: number;
}
