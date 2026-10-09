import toast from "react-hot-toast";
import { Clientes } from "../services/services";
import type { DadosCliente } from "../types/infoEmpresaComer.types";

export function useClientes() {
  async function SalvarDadosCliente(dadosCliente: DadosCliente) {
    const retorno = await Clientes.cadastroDadosCliente(dadosCliente);
    if (retorno.success) {
      toast.success(retorno.message);
      return false;
    }
    toast.error(retorno.message);
  }

  async function BuscarDadosCliente(idUsuario: number) {
    return await Clientes.buscaDadosCliente(idUsuario);
  }

  async function EditarDadosCliente(dadosCliente: DadosCliente) {
    const retorno = await Clientes.editarCadastroCliente(dadosCliente);
    if (retorno.success) {
      toast.success(retorno.message);
      return false;
    }
    toast.error(retorno.message);
  }

  return {
    SalvarDadosCliente,
    BuscarDadosCliente,
    EditarDadosCliente,
  };
}
