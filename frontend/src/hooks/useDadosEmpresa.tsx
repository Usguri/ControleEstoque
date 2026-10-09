import toast from "react-hot-toast";
import { EmpresaApi } from "../services/services";
import type { DadosEmpresa } from "../types/empresa.types";

export function useDadosEmpresa() {
  async function BuscaDadosDaEmpresa() {
    const data = await EmpresaApi.buscaDadosEmpresa();
    return data;
  }

  async function SalvarDadosEmpresa(dadosEmpresa: DadosEmpresa) {
    const retorno = await EmpresaApi.salvaDadosEmpresa(dadosEmpresa);
    if (retorno.success) {
      toast.success(retorno.message);
    }
  }

  return {
    BuscaDadosDaEmpresa,
    SalvarDadosEmpresa,
  };
}
