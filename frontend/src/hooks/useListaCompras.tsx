import toast from "react-hot-toast";
import { Produtos } from "../services/services";
import { ListaCompras } from "../services/services";
import type { listaProdFinalizarCompra } from "../types/listaProdComer.types";

export function useListaCompras() {
  async function BuscaCategoriasAtivas() {
    return await Produtos.listCategoriasAtivas();
  }

  async function ListaProdComercial() {
    return await ListaCompras.listaProdutosComercializacao();
  }

  async function BuscaProdComercializar(idProd: number[]) {
    return await ListaCompras.listaProdutosPreSelecionados(idProd);
  }

  async function FinalizarCompraCliente(listaCompra: listaProdFinalizarCompra[], idUsuario: number) {
    return await ListaCompras.listaDadosFinalizarCompra(listaCompra, idUsuario);
  }

  async function HistoricoPedidosCompra(mes: string) {
    return await ListaCompras.listaDePedidosClientes(mes);
  }

  async function ListaProdutosComprados(idLista: number) {
    return await ListaCompras.buscaListaPedido(idLista);
  }

  async function CancelarPedido(idLista: number) {
    const retorno = await ListaCompras.cancelarPedidoCliente(idLista);
    if (retorno.success) {
      toast.success(retorno.message);
      return false;
    }
    toast.error(retorno.message);
  }

  async function HistoricoPedidosCompraCliente(mes: string, idUsuario: number) {
    return await ListaCompras.listaDePedidosDoCliente(mes, idUsuario);
  }

  return {
    BuscaCategoriasAtivas,
    ListaProdComercial,
    BuscaProdComercializar,
    FinalizarCompraCliente,
    HistoricoPedidosCompra,
    ListaProdutosComprados,
    CancelarPedido,
    HistoricoPedidosCompraCliente,
  };
}
