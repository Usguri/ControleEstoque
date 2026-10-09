export interface DadosEmpresa {
  nomeEmpresa: string;
  email: string;
  fone: string;
  cidade: string;
  endereco: string;
  descricao: string;
}

export const EMPRESA_PADRAO: DadosEmpresa = {
  nomeEmpresa: "",
  email: "",
  fone: "",
  cidade: "",
  endereco: "",
  descricao: "",
};
