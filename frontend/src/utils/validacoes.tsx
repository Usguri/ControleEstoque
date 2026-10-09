import type { CriarAcessoSistema } from "../types/acessosSistema.types";
import type { DadosCliente } from "../types/infoEmpresaComer.types";
import type { ErrosProduto } from "../types/produtos.type";
import type { DadosProdutos } from "../types/produtos.type";
import { isStrongPassword, isValidEmail } from "./validators";

export const validarProduto = (produto: DadosProdutos): ErrosProduto => {
  const erros: ErrosProduto = {};

  if (!produto.idCategoria) erros.categoria = true;
  if (!produto.nomeProduto) erros.nomeProduto = true;
  if (!produto.codProduto) erros.codProduto = true;
  if (!produto.preco) erros.preco = true;

  return erros;
};

export const temErros = (erros: ErrosProduto): boolean => {
  return Object.keys(erros).length > 0;
};

export const ValidaDadosEmpresa = (empresa: DadosCliente) => {
  if (!empresa.cidade || !empresa.cnpj || !empresa.email || !empresa.empresa || !empresa.telefone) {
    return false;
  }
  return true;
};

export const ValidaDadosUser = (usuario: CriarAcessoSistema): boolean => {
  if (!usuario.nome || !usuario.usuario) {
    return true;
  }
  return false;
};

export const ValidaAcessoLogin = (email: string, password: string) => {
  if (!isValidEmail(email)) {
    return { success: true, message: "Usuário inválido!" };
  }
  if (!isStrongPassword(password)) {
    return { success: true, message: "Senha deve ter no mínimo 8 caracteres!" };
  }

  return { success: false, message: "ok" };
};

export const ValidarNovaSenha = (senha: string): { valida: boolean; message: string } => {
  if (senha.length < 8) return { valida: false, message: "Mínimo 8 caracteres" };
  if (!/[A-Z]/.test(senha)) return { valida: false, message: "Precisa de letra maiúscula" };
  if (!/[a-z]/.test(senha)) return { valida: false, message: "Precisa de letra minúscula" };
  if (!/[0-9]/.test(senha)) return { valida: false, message: "Precisa de número" };
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(senha))
    return { valida: false, message: "Precisa de caractere especial" };
  return { valida: true, message: "ok" };
};

export const mesesDoAno = [
  { numero: 1, nome: "Janeiro" },
  { numero: 2, nome: "Fevereiro" },
  { numero: 3, nome: "Março" },
  { numero: 4, nome: "Abril" },
  { numero: 5, nome: "Maio" },
  { numero: 6, nome: "Junho" },
  { numero: 7, nome: "Julho" },
  { numero: 8, nome: "Agosto" },
  { numero: 9, nome: "Setembro" },
  { numero: 10, nome: "Outubro" },
  { numero: 11, nome: "Novembro" },
  { numero: 12, nome: "Dezembro" },
];

export const VerificaMesAtual = () => {
  const hoje = new Date();
  const mesNum = hoje.getMonth() + 1;
  return mesNum.toString();
};
