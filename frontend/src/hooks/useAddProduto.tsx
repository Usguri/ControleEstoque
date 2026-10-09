import toast from "react-hot-toast";
import { Produtos } from "../services/services";
import { type DadosProdutos } from "../types/produtos.type";

export function useAddProdutos() {
  async function SalvarNovoProduto(params: DadosProdutos) {
    const produtoParaEnviar = {
      ...params,
      quantidadeAtual: params.quantidadeComprada,
    };
    const retorno = await Produtos.cadastrarProduto(produtoParaEnviar);
    if (!retorno.success) {
      toast.error(retorno.message, { duration: 3000 });
      return false;
    }
    toast.success(retorno.message, { duration: 3000 });
  }

  async function ListCategoriasAtivas() {
    return Produtos.listCategoriasAtivas();
  }

  async function ListaAllProdutos() {
    return await Produtos.listaAllProduto();
  }

  async function AlterarStatusProduto(idproduto: number, check: boolean) {
    const retorno = await Produtos.atualizarStatusProduto(idproduto, check);
    if (!retorno.success) {
      toast.error(retorno.message);
      return false;
    }
    toast.success(retorno.message);
  }

  async function AlterarStatusPromocaoProduto(idproduto: number, check: boolean) {
    const retorno = await Produtos.atualizarStatusPromocaoProduto(idproduto, check);
    if (!retorno.success) {
      toast.error(retorno.message);
      return false;
    }
    toast.success(retorno.message);
  }

  async function DeletarProduto(idproduto: number) {
    const retorno = await Produtos.deletarProduto(idproduto);
    if (!retorno.success) {
      toast.error(retorno.message);
      return false;
    }
    toast.success(retorno.message);
  }

  async function BuscarProdutoEditar(idProduto: number) {
    return await Produtos.buscarDadosEditar(idProduto);
  }

  async function ExcluirImagemPasta(nomeArquivo: string, idProduto: number | undefined) {
    const retorno = await Produtos.deletarImagem(nomeArquivo, idProduto);
    if (!retorno.success) {
      toast.error(retorno.message);
      return false;
    }
    toast.success(retorno.message);
  }

  async function SalvarEdicaoProduto(params: DadosProdutos) {
    const retorno = await Produtos.edicaoProduto(params);
    if (!retorno.success) {
      toast.error(retorno.message);
      return false;
    }
    toast.success(retorno.message);
  }

  return {
    SalvarNovoProduto,
    ListCategoriasAtivas,
    ListaAllProdutos,
    AlterarStatusProduto,
    AlterarStatusPromocaoProduto,
    DeletarProduto,
    BuscarProdutoEditar,
    SalvarEdicaoProduto,
    ExcluirImagemPasta,
  };
}
