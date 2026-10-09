import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { DadosListaPedido, Pedido } from "../types/infoEmpresaComer.types";

export const gerarPDF = (empresa: DadosListaPedido, pedidos: Pedido[]) => {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(20);
  doc.setFont("helvetica", "normal");
  doc.text("Pedido", 105, 15, { align: "center" });

  // Dados da empresa
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Empresa: ${empresa.empresa || ""}`, 15, 25);
  doc.text(`Fone: ${empresa.fone || ""}`, 15, 30);
  doc.text(`Cidade: ${empresa.cidade || ""}`, 15, 35);
  doc.text(
    `Data: ${new Date(empresa.datahora).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })}`,
    15,
    40,
  );

  doc.text(`E-mail: ${empresa.email || ""}`, 125, 30);
  doc.text(`CNPJ: ${empresa.cnpj || ""}`, 125, 35);
  doc.text(`IE: ${empresa.ie || ""}`, 125, 40);

  // Tabela de produtos
  const tableData = pedidos.map((item, index) => {
    const [nomeProduto, codigoProduto] = item.mercadoria.split(" - ");

    return [
      (index + 1).toString(),
      item.quantidade.toString(),
      codigoProduto || item.codProduto || "",
      nomeProduto || item.mercadoria,
      `R$ ${parseFloat(item.valorUnitario).toFixed(2).replace(".", ",")}`,
      `R$ ${item.valorTotal.toFixed(2).replace(".", ",")}`,
    ];
  });

  // Calcular total
  const total = pedidos.reduce((acc, item) => acc + item.valorTotal, 0);

  let finalY = 45;

  autoTable(doc, {
    startY: 45,
    head: [["Nº", "QTDE", "CÓDIGO", "MERCADORIA", "V. UNITÁRIO", "V. TOTAL"]],
    body: tableData,
    headStyles: {
      fillColor: [192, 192, 192], // Fundo cinza
      textColor: [0, 0, 0], // Texto preto
      lineColor: [0, 0, 0], // Borda preta
      lineWidth: 0.3,
      fontSize: 11,
      halign: "center",
      fontStyle: "normal",
      font: "helvetica",
    },
    bodyStyles: {
      fontSize: 11,
      textColor: [0, 0, 0],
      lineColor: [0, 0, 0],
      lineWidth: 0.3,
      font: "helvetica",
    },
    columnStyles: {
      0: { halign: "center", cellWidth: "auto" },
      1: { halign: "center", cellWidth: "auto" },
      2: { halign: "center", cellWidth: "auto" },
      3: { halign: "left", cellWidth: "auto" },
      4: { halign: "left", cellWidth: "auto" },
      5: { halign: "left", cellWidth: "auto" },
    },
    theme: "grid",
    didDrawPage: (data) => {
      finalY = data.cursor?.y || 65;
    },
  });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Total: R$ ${total.toFixed(2).replace(".", ",")}`, 195, finalY + 7, {
    align: "right",
  });

  window.open(doc.output("bloburl"), "_blank");

  // Salvar o PDF
  // doc.save(`pedido-${empresa.cnpj}.pdf`);
};
