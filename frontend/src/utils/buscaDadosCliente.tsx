export async function buscarEmpresaPorCNPJ(cnpj: string) {
  const cnpjLimpo = cnpj.replace(/\D/g, "");

  try {
    const url = encodeURIComponent(`https://www.receitaws.com.br/v1/cnpj/${cnpjLimpo}`);
    const response = await fetch(`https://api.allorigins.win/get?url=${url}`);

    if (!response.ok) {
      return { erro: true, mensagem: "Serviço indisponível" };
    }

    const result = await response.json();
    const data = JSON.parse(result.contents);

    if (data.status === "ERROR") {
      return { erro: true, mensagem: data.message };
    }

    return data;
  } catch (error) {
    return { erro: true, mensagem: "Falha na consulta de CNPJ" };
  }
}
