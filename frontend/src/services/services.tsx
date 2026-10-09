import api from "./api";
import type { EditCategoria } from "../types/categoria.types";
import type { DadosEmpresa } from "../types/empresa.types";
import type { DadosProdutos } from "../types/produtos.type";
import { buildFormData } from "../utils/formatadores";
import type { listaProdFinalizarCompra } from "../types/listaProdComer.types";
import type { DadosCliente } from "../types/infoEmpresaComer.types";
import type { CriarAcessoSistema, NovaSenha } from "../types/acessosSistema.types";

export const authService = {
  login: async (usuario: string, senha: string) => {
    const response = await api.post("user/login", { usuario, senha });
    return response.data;
  },
  verificaLogin: async () => {
    const response = await api.get("user/verify");
    return response;
  },
  realizaLogout: async () => {
    const response = await api.post("user/logout");
    return response;
  },
};

export const Categorias = {
  buscaCategorias: async () => {
    const response = await api.get("categoria/allCategorias");
    return response.data;
  },
  novaCategoria: async () => {
    const response = await api.post("categoria/novaCategoria", { categoria: "Nova categoria", check: true });
    return response.data;
  },
  editarCategoria: async (categoria: EditCategoria) => {
    const response = await api.put("categoria/editarCategoria", categoria);
    return response.data;
  },
  deletarCategoria: async (idCategoria: number) => {
    const response = await api.delete(`categoria/delCategoria/${idCategoria}`);
    return response.data;
  },
};

export const EmpresaApi = {
  buscaDadosEmpresa: async () => {
    const response = await api.get("empresa/buscaDadosEmpresa");
    return response.data;
  },
  salvaDadosEmpresa: async (dadosempresa: DadosEmpresa) => {
    const response = await api.put("empresa/salvarDadosEmpresa", dadosempresa);
    return response.data;
  },
};

export const Produtos = {
  listCategoriasAtivas: async () => {
    const response = await api.get("produtos/CategoriasAtivas");
    return response.data;
  },
  cadastrarProduto: async (params: DadosProdutos) => {
    const formData = buildFormData(params);
    const response = await api.post("produtos/CadastrarProduto", formData);
    return response.data;
  },
  listaAllProduto: async () => {
    const response = await api.get("produtos/ListaProdutos");
    return response.data;
  },

  atualizarStatusProduto: async (idProduto: number, statusProduto: boolean) => {
    const response = await api.patch("produtos/AtualizarStatusProduto", { idProduto, statusProduto });
    return response.data;
  },

  atualizarStatusPromocaoProduto: async (idProduto: number, promocao: boolean) => {
    const response = await api.patch("produtos/AtualizarStatusProcaoPrto", { idProduto, promocao });
    return response.data;
  },

  deletarProduto: async (idProduto: number) => {
    const response = await api.delete(`produtos/delProduto/${idProduto}`);
    return response.data;
  },

  buscarDadosEditar: async (idProduto: number) => {
    const response = await api.get(`produtos/buscarDadosEditar/${idProduto}`);
    return response.data;
  },

  deletarImagem: async (nomeImagem: string, idProduto: number | undefined) => {
    const response = await api.delete(`produtos/deletarImagem/${idProduto}/${nomeImagem}`);
    return response.data;
  },

  edicaoProduto: async (params: DadosProdutos) => {
    const formData = buildFormData(params);
    const response = await api.put("produtos/edicaoProdutos", formData);
    return response.data;
  },
};

export const ListaCompras = {
  listaProdutosComercializacao: async () => {
    const response = await api.get("lista-compras/listaProdutosComercializar");
    return response.data;
  },
  listaProdutosPreSelecionados: async (idProd: number[]) => {
    const response = await api.post("lista-compras/listaProdutosPreComercializar", idProd);
    return response.data;
  },
  listaDadosFinalizarCompra: async (listaCompra: listaProdFinalizarCompra[], idUsuario: number) => {
    const listComp = [];

    for (let i = 0; i < listaCompra.length; i++) {
      listComp.push({
        idProduto: listaCompra[i].idProduto,
        quantidade: listaCompra[i].quantidade,
        mercadoria: listaCompra[i].nomeProduto,
        codProduto: listaCompra[i].codProduto,
        valorUnitario: listaCompra[i].preco,
        valorTotal: listaCompra[i].preco * listaCompra[i].quantidade,
      });
    }

    const response = await api.post("lista-compras/listaPedidosFinalizarCompra", { listComp, idUsuario });
    return response.data;
  },
  listaDePedidosClientes: async (mes: string) => {
    const responde = await api.get("lista-compras/historicoDePedidosCompras", {
      params: { mes },
    });
    return responde.data;
  },
  buscaListaPedido: async (idLista: number) => {
    const response = await api.get("lista-compras/listaPedidoEspecifico", {
      params: { idLista },
    });
    return response.data;
  },
  cancelarPedidoCliente: async (idLista: number) => {
    const response = await api.post("lista-compras/cancelarPedido", {
      idLista,
    });
    return response.data;
  },
  listaDePedidosDoCliente: async (mes: string, idUsuario: number) => {
    const responde = await api.get("lista-compras/historicoDePedidosComprasPorCliente", {
      params: { mes, idUsuario },
    });
    return responde.data;
  },
};

export const AcessosSistema = {
  novoLoginSistema: async (usuario: CriarAcessoSistema) => {
    const responde = await api.post("user/createUser", usuario);
    return responde.data;
  },
  listaUsuarios: async () => {
    const responde = await api.get("user/listaUsuario");
    return responde.data;
  },
  alterarStatus: async (idUsuario: number, userAtivo: boolean) => {
    const responde = await api.patch("user/alterarStatusCheck", { idUsuario, userAtivo });
    return responde.data;
  },
  resetarAcessoUsuario: async (idUsuario: number) => {
    const responde = await api.patch(`user/resetarAcessoUsuario/${idUsuario}`);
    return responde.data;
  },
  deletarUsuario: async (idUsuario: number) => {
    const responde = await api.delete(`user/deletarAcessoUsuario/${idUsuario}`);
    return responde.data;
  },
  alterarSenhaUsuario: async (dataSenhaUsuario: NovaSenha) => {
    const responde = await api.patch("user/alterarSenhaUsuario", dataSenhaUsuario);
    return responde.data;
  },
};

export const Clientes = {
  cadastroDadosCliente: async (cliente: DadosCliente) => {
    const responde = await api.post("clientes/salvarDadosCliente", cliente);
    return responde.data;
  },
  buscaDadosCliente: async (idUsuario: number) => {
    const responde = await api.get("clientes/buscarDadosCliente", {
      params: { idUsuario },
    });
    return responde.data;
  },
  editarCadastroCliente: async (cliente: DadosCliente) => {
    const responde = await api.patch("clientes/salvarEdicaoDadosCliente", cliente);
    return responde.data;
  },
};
