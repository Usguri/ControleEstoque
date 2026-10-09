import toast from "react-hot-toast";
import { AcessosSistema } from "../services/services";
import type { CriarAcessoSistema, NovaSenha } from "../types/acessosSistema.types";
import { ValidaDadosUser, ValidarNovaSenha } from "../utils/validacoes";

export function useAddAcessos() {
  async function AddNewAcesso(usuario: CriarAcessoSistema) {
    const valida = ValidaDadosUser(usuario);
    if (valida) {
      toast.error("Existem campos em branco!");
      return false;
    }

    const resposta = await AcessosSistema.novoLoginSistema(usuario);
    if (resposta.success) {
      toast.success(resposta.message);
      return false;
    }
    toast.error(resposta.message);
  }

  async function BuscaAllUsuarios() {
    return await AcessosSistema.listaUsuarios();
  }

  async function StatusCheck(idUser: number, value: boolean) {
    const resposta = await AcessosSistema.alterarStatus(idUser, value);
    if (resposta.success) {
      toast.success(resposta.message);
      return false;
    }
    toast.error(resposta.message);
  }

  async function ResetarAcessoSistema(idUsuario: number) {
    const resposta = await AcessosSistema.resetarAcessoUsuario(idUsuario);
    if (resposta.success) {
      toast.success(resposta.message);
      return false;
    }
    toast.error(resposta.message);
  }

  async function DeletarUsuario(idUsuario: number) {
    const resposta = await AcessosSistema.deletarUsuario(idUsuario);
    if (resposta.success) {
      toast.success(resposta.message);
      return true;
    }
    toast.error(resposta.message);
    return false;
  }

  async function AlterarSenhaAcessoUsuario(dataAlterSenha: NovaSenha) {
    const validarSenha = ValidarNovaSenha(dataAlterSenha.novaSenha);

    if (!validarSenha.valida) {
      toast.error(validarSenha.message);
      return false;
    }

    const retorno = await AcessosSistema.alterarSenhaUsuario(dataAlterSenha);

    if (!retorno.success) {
      toast.error(retorno.message);
      return false;
    } else {
      toast.success(retorno.message);
      return true;
    }
  }

  return {
    AddNewAcesso,
    BuscaAllUsuarios,
    StatusCheck,
    ResetarAcessoSistema,
    DeletarUsuario,
    AlterarSenhaAcessoUsuario,
  };
}
