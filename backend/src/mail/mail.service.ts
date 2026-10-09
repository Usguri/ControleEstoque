import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';
import { promisify } from 'util';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async enviarPedido(empresa: any, pedidos: any[]) {
    try {
      const pdfPath = await this.gerarPDF(empresa, pedidos);

      const info = await this.mailerService.sendMail({
        to: empresa.email,
        cc: 'princesa.acessorios2024@gmail.com',
        subject: 'Pedido confirmado',
        html: `<h1>Pedido confirmado</h1><p>Segue em anexo o pedido.</p>`,
        attachments: [
          {
            filename: 'pedido.pdf',
            path: pdfPath,
          },
        ],
      });

      await unlink(pdfPath);

      return {
        message: `O pedido foi enviado para ${info.accepted[0]}`,
        success: true,
        cod: 200,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Erro ao enviar e-mail',
        smtpError: error?.response || error?.message,
        code: error?.code,
        success: false,
        cod: 201,
      });
    }
  }
  async gerarPDF(empresa: any, pedidos: any[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 15, size: 'A4' });
      const pdfPath = `./temp-pedido-${Date.now()}.pdf`;
      const stream = createWriteStream(pdfPath);

      doc.pipe(stream);
      doc.font('Helvetica');

      doc.fontSize(20).text('Pedido', 10, 30, { align: 'center' });
      doc.moveDown();

      doc.fontSize(11);
      doc.text(`Empresa: ${empresa.empresa || ''}`, 35, 60);
      doc.text(`Fone: ${empresa.telefone || ''}`, 35, 75);
      doc.text(`Cidade: ${empresa.cidade || ''}`, 35, 90);
      doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 35, 105);
      doc.text(`E-mail: ${empresa.email || ''}`, 320, 75);
      doc.text(`CNPJ: ${empresa.cnpj || ''}`, 320, 90);
      doc.text(`IE: ${empresa.ie || ''}`, 320, 105);

      // Cabeçalho da tabela
      const tableTop = 125;
      const col1X = 35;
      const col2X = 60;
      const col3X = 105;
      const col4X = 200;
      const col5X = 405;
      const col6X = 495;
      const tableWidth = 525;
      const rowHeight = 20;

      // Fundo cinza do cabeçalho
      doc
        .rect(col1X, tableTop, tableWidth, rowHeight)
        .fillAndStroke('#CCCCCC', '#000000');

      doc.fillColor('#000000').fontSize(10);
      doc.text('Nº', col1X + 5, tableTop + 6, {
        width: col2X - col1X - 10,
        align: 'center',
      });
      doc.text('QTDE', col2X + 5, tableTop + 6, {
        width: col3X - col2X - 10,
        align: 'center',
      });
      doc.text('CÓDIGO', col3X + 5, tableTop + 6, {
        width: col4X - col3X - 10,
        align: 'center',
      });
      doc.text('MERCADORIA', col4X + 5, tableTop + 6, {
        width: col5X - col4X - 10,
        align: 'center',
      });
      doc.text('V. UNITÁRIO', col5X + 5, tableTop + 6, {
        width: col6X - col5X - 10,
        align: 'center',
      });
      doc.text('V. TOTAL', col6X + 5, tableTop + 6, {
        width: col1X + tableWidth - col6X - 10,
        align: 'center',
      });

      // Linhas verticais do cabeçalho
      [col2X, col3X, col4X, col5X, col6X].forEach((x) => {
        doc
          .moveTo(x, tableTop)
          .lineTo(x, tableTop + rowHeight)
          .stroke();
      });

      // Itens
      let y = tableTop + rowHeight;
      let total = 0;

      pedidos.forEach((item, index) => {
        // Fundo cinza na coluna Nº
        doc
          .rect(col1X, y, col2X - col1X, rowHeight)
          .fillAndStroke('#dedede', '#000000');

        // Restante da linha
        doc.rect(col2X, y, tableWidth - (col2X - col1X), rowHeight).stroke();

        [col2X, col3X, col4X, col5X, col6X].forEach((x) => {
          doc
            .moveTo(x, y)
            .lineTo(x, y + rowHeight)
            .stroke();
        });

        doc.fillColor('#000000').fontSize(9);
        doc.text((index + 1).toString(), col1X + 5, y + 6, {
          width: col2X - col1X - 10,
          align: 'center',
        });

        doc.fontSize(10);
        doc.text(item.quantidade.toString(), col2X + 5, y + 6, {
          width: col3X - col2X - 10,
          align: 'center',
        });
        doc.text(item.codProduto || '', col3X + 5, y + 6, {
          width: col4X - col3X - 10,
          align: 'center',
        });
        doc.text(item.mercadoria, col4X + 5, y + 6, {
          width: col5X - col4X - 10,
        });
        doc.text(
          `R$ ${parseFloat(item.valorUnitario).toFixed(2).replace('.', ',')}`,
          col5X + 5,
          y + 6,
          { width: col6X - col5X - 10, align: 'right' },
        );
        doc.text(
          `R$ ${item.valorTotal.toFixed(2).replace('.', ',')}`,
          col6X + 5,
          y + 6,
          { width: col1X + tableWidth - col6X - 10, align: 'right' },
        );

        total += item.valorTotal;
        y += rowHeight;
      });

      // Total
      y += 10;
      doc.fontSize(11).fillColor('#000000');
      doc.text(`Total: R$ ${total.toFixed(2).replace('.', ',')}`, col1X, y, {
        align: 'right',
        width: tableWidth,
      });

      doc.end();

      stream.on('finish', () => resolve(pdfPath));
      stream.on('error', reject);
    });
  }

  // async gerarPDF(empresa: any, pedidos: any[]): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     const doc = new PDFDocument({ margin: 15, size: 'A4' });
  //     const pdfPath = `./temp-pedido-${Date.now()}.pdf`;
  //     const stream = createWriteStream(pdfPath);

  //     doc.pipe(stream);
  //     doc.font('Helvetica');

  //     doc.fontSize(20).text('Pedido', 10, 30, { align: 'center' });
  //     doc.moveDown();

  //     doc.fontSize(11);
  //     doc.text(`Empresa: ${empresa.empresa || ''}`, 35, 60);
  //     doc.text(`Fone: ${empresa.telefone || ''}`, 35, 75);
  //     doc.text(`Cidade: ${empresa.cidade || ''}`, 35, 90);
  //     doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 35, 105);
  //     doc.text(`E-mail: ${empresa.email || ''}`, 320, 75);
  //     doc.text(`CNPJ: ${empresa.cnpj || ''}`, 320, 90);
  //     doc.text(`IE: ${empresa.ie || ''}`, 320, 105);

  //     // Cabeçalho da tabela com fundo cinza
  //     const tableTop = 125;
  //     const col1X = 35;
  //     const col2X = 75;
  //     const col3X = 125;
  //     const col4X = 200;
  //     const col5X = 380;
  //     const col6X = 470;
  //     const tableWidth = 520;
  //     const rowHeight = 20;

  //     // Cabeçalho da tabela com fundo cinza
  //     doc
  //       .rect(col1X, tableTop, tableWidth, rowHeight)
  //       .fillAndStroke('#CCCCCC', '#000000');

  //     doc.fillColor('#000000').fontSize(11);
  //     doc.text('Nº', col1X, tableTop + 6, {
  //       width: col2X - col1X,
  //       align: 'center',
  //     });
  //     doc.text('QTDE', col2X, tableTop + 6, {
  //       width: col3X - col2X,
  //       align: 'center',
  //     });
  //     doc.text('CÓDIGO', col3X, tableTop + 6, {
  //       width: col4X - col3X,
  //       align: 'center',
  //     });
  //     doc.text('MERCADORIA', col4X, tableTop + 6, {
  //       width: col5X - col4X,
  //       align: 'center',
  //     });
  //     doc.text('V. UNITÁRIO', col5X, tableTop + 6, {
  //       width: col6X - col5X,
  //       align: 'center',
  //     });
  //     doc.text('V. TOTAL', col6X, tableTop + 6, {
  //       width: col1X + tableWidth - col6X,
  //       align: 'center',
  //     });

  //     // Desenhar linhas verticais do cabeçalho
  //     doc
  //       .moveTo(col2X, tableTop)
  //       .lineTo(col2X, tableTop + rowHeight)
  //       .stroke();
  //     doc
  //       .moveTo(col3X, tableTop)
  //       .lineTo(col3X, tableTop + rowHeight)
  //       .stroke();
  //     doc
  //       .moveTo(col4X, tableTop)
  //       .lineTo(col4X, tableTop + rowHeight)
  //       .stroke();
  //     doc
  //       .moveTo(col5X, tableTop)
  //       .lineTo(col5X, tableTop + rowHeight)
  //       .stroke();
  //     doc
  //       .moveTo(col6X, tableTop)
  //       .lineTo(col6X, tableTop + rowHeight)
  //       .stroke();

  //     // Itens do pedido
  //     let y = tableTop + rowHeight;
  //     let total = 0;

  //     pedidos.forEach((item, index) => {
  //       // Retângulo da linha
  //       doc.rect(col1X, y, tableWidth, rowHeight).stroke();

  //       // Linhas verticais divisórias
  //       doc
  //         .moveTo(col2X, y)
  //         .lineTo(col2X, y + rowHeight)
  //         .stroke();
  //       doc
  //         .moveTo(col3X, y)
  //         .lineTo(col3X, y + rowHeight)
  //         .stroke();
  //       doc
  //         .moveTo(col4X, y)
  //         .lineTo(col4X, y + rowHeight)
  //         .stroke();
  //       doc
  //         .moveTo(col5X, y)
  //         .lineTo(col5X, y + rowHeight)
  //         .stroke();
  //       doc
  //         .moveTo(col6X, y)
  //         .lineTo(col6X, y + rowHeight)
  //         .stroke();

  //       doc.text((index + 1).toString(), col1X + 17, y + 6);
  //       doc.text(item.quantidade.toString(), col2X, y + 6, {
  //         width: col3X - col2X,
  //         align: 'center',
  //       });
  //       doc.text(item.codProduto || '', col3X, y + 6, {
  //         width: col4X - col3X,
  //         align: 'center',
  //       });
  //       doc.text(item.mercadoria, col4X + 5, y + 6, {
  //         width: col5X - col4X - 10,
  //       });
  //       doc.text(
  //         `R$ ${parseFloat(item.valorUnitario).toFixed(2).replace('.', ',')}`,
  //         col5X + 5,
  //         y + 6,
  //       );
  //       doc.text(
  //         `R$ ${item.valorTotal.toFixed(2).replace('.', ',')}`,
  //         col6X + 5,
  //         y + 6,
  //       );

  //       total += item.valorTotal;
  //       y += rowHeight;
  //     });

  //     // Total abaixo da tabela (fora dela)
  //     y += 10;
  //     doc.fontSize(11).fillColor('#000000');
  //     doc.text(`Total: R$ ${total.toFixed(2).replace('.', ',')}`, col1X, y, {
  //       align: 'right',
  //       width: tableWidth,
  //     });

  //     doc.end();

  //     stream.on('finish', () => resolve(pdfPath));
  //     stream.on('error', reject);
  //   });
  // }
}
