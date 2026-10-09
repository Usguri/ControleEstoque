import toast from "react-hot-toast";
import { Categorias } from "../services/services";

export function useCategoria() {
  async function BuscaCategorias() {
    const data = await Categorias.buscaCategorias();
    return data;
  }

  async function AdicionarNovaCategoria() {
    const retorno = await Categorias.novaCategoria();

    if (retorno.success) {
      toast.success(retorno.message);
    }
  }

  async function EditarTextCategoria(idcategoria: number, textcategoria: string) {
    const newtextcategoria = {
      idCategoria: idcategoria,
      categoria: textcategoria,
    };
    const retorno = await Categorias.editarCategoria(newtextcategoria);
    if (!retorno.success) {
      return false;
    }
    toast.success(retorno.message);
  }

  async function EditarCheckCategoria(idcategoria: number, check: boolean) {
    const newtextcategoria = {
      idCategoria: idcategoria,
      check: check,
    };
    const retorno = await Categorias.editarCategoria(newtextcategoria);
    if (!retorno.success) {
      return false;
    }
    toast.success(retorno.message);
  }

  async function ExcluirCategoria(idCategoria: number) {
    const retorno = await Categorias.deletarCategoria(idCategoria);
    if (!retorno.success) {
      return false;
    }
    toast.success(retorno.message);
  }

  return {
    BuscaCategorias,
    AdicionarNovaCategoria,
    EditarTextCategoria,
    EditarCheckCategoria,
    ExcluirCategoria,
  };
}
