export interface AcessosSistema {
  idUsuario: number;
  nome: string;
  primeiroAcesso: boolean;
  role: number;
  usuario: string;
  userAtivo: boolean;
}

export interface CriarAcessoSistema {
  usuario: string;
  nome: string;
  role: number;
}

export const dadosNovoUsuario: CriarAcessoSistema = {
  usuario: "",
  nome: "",
  role: 2,
};

export interface NovaSenha {
  idUsuario: number;
  senhaAtual: string;
  novaSenha: string;
}

export const CriarSenha: NovaSenha = {
  idUsuario: 0,
  senhaAtual: "",
  novaSenha: "",
};
