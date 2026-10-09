export class ListaProdutos {
  idProduto: number;
  quantidade: number;
  mercadoria: string;
  codProduto: string;
  valorUnitario: string;
  valorTotal: string;
}

export class DadosCliente {
  cidade: string;
  cnpj: string;
  email: string;
  empresa: string;
  ie: string;
  telefone: string;
  idUsuario: number;
}

export class DadosListaPedido {
  cidade: string;
  cnpj: string;
  email: string;
  empresa: string;
  ie: string;
  fone: string;
  datahora: Date;
  compFinalizada: boolean;
}
