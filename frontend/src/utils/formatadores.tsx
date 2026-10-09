import type { DadosProdutos } from "../types/produtos.type";

export function formatarTelefone(valor: string) {
  const numeros = valor.replace(/\D/g, "");

  if (numeros.length === 0) {
    return "";
  } else if (numeros.length <= 2) {
    return `(${numeros}`;
  } else if (numeros.length <= 6) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  } else if (numeros.length <= 10) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
  } else {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
  }
}

export function formatarValor(v: string) {
  const valor = v.replace(",", ".").replace(/[^0-9.]/g, "");

  const partes = v.split(".");
  const valorCorrigido = partes.length > 2 ? partes[0] + "." + partes.slice(1).join("") : valor;

  return valorCorrigido;
}

export const buildFormData = (params: DadosProdutos): FormData => {
  const formData = new FormData();

  formData.append("nomeProduto", params.nomeProduto);
  formData.append("preco", String(params.preco));
  formData.append("codProduto", String(params.codProduto));
  formData.append("quantidadeComprada", String(params.quantidadeComprada));
  formData.append("idCategoria", String(params.idCategoria));
  formData.append("promocao", String(params.promocao));
  formData.append("precoPromocao", String(params.precoPromocao));
  formData.append("quantidadeAtual", String(params.quantidadeAtual));

  if (params.descricao) {
    formData.append("descricao", String(params.descricao));
  }

  if (params.dimensoes) {
    formData.append("dimensoes", String(params.dimensoes));
  }

  (params.imagemProduto as File[]).forEach((file) => {
    formData.append("imagemProduto", file);
  });

  if (params.idProduto) {
    formData.append("idProduto", String(params.idProduto));
  }
  return formData;
};

export const formatarMoney = (value: string | undefined) => {
  if (!value) {
    return value;
  }

  const num = parseFloat(value.replace(",", "."));
  // if (Number.isInteger(num)) return num.toString();
  return num.toFixed(2).replace(".", ",");
};

export const ajustarPrecoPromocao = (preco: string | undefined, precoPromocao: string | undefined) => {
  if (!preco || !precoPromocao) {
    return preco;
  }
  return Math.round(((parseInt(preco) - parseInt(precoPromocao)) / parseInt(preco)) * 100);
};

export const formatarCNPJCPF = (valor: string) => {
  valor = valor.replace(/\D/g, "");
  if (valor.length === 11) {
    return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
  } else if (valor.length === 14) {
    return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5");
  } else {
    return valor;
  }
};

export const formatarDataBr = (valor: string) => {
  const data = new Date(valor);
  return data.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
