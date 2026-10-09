import { Injectable } from '@nestjs/common';
import { ListaComprasRepository } from './lista-compras.repositories';
import { DadosCliente, ListaProdutos } from './dto/lista-produtos-compra.dto';
import { MailService } from 'src/mail/mail.service';
import { ClienteRepository } from 'src/clientes/clientes.repositorios';
import { ImagemCacheService } from 'src/shared/imagem-cache.service';

@Injectable()
export class ListaComprasService {
  constructor(
    private readonly repListaComp: ListaComprasRepository,
    private readonly mailService: MailService,
    private readonly repCliente: ClienteRepository,
    private imagemCache: ImagemCacheService,
  ) {}

  async BuscaListaProdutos() {
    await this.imagemCache.carregarTodasImagensEmCache();

    const produtos = await this.repListaComp.ListaAllProdutos();
    const produtosComImagens = produtos.map((p) => ({
      ...p,
      imagemProduto: this.imagemCache.getImagensProduto(p.idProduto),
    }));

    return produtosComImagens;
  }

  async BuscaProdComercializar(listIds: number[]) {
    const lista = await this.repListaComp.BuscaProdutosPreSel(listIds);
    const produtosComImagens = await Promise.all(
      lista.map(async (p) => {
        const imagens = await this.repListaComp.BuscaImagensSelecionadas(
          p.idProduto,
        );
        const imagemProduto = imagens && imagens.length > 0 ? imagens[0] : null;
        return { ...p, imagemProduto };
      }),
    );

    return produtosComImagens;
  }

  async FinalizarCompra(listaprodutos: ListaProdutos[], idUsuario: number) {
    const cliente = await this.repCliente.DadosCliente(idUsuario);

    if (!cliente) {
      return {
        message: 'Favor preencha os seus dados no perfil de cliente!',
        success: false,
        cod: 202,
      };
    }

    const finalComp = await this.repListaComp.SalvarNovoPedidoCompra(
      cliente as DadosCliente,
      listaprodutos,
    );

    if (!finalComp) {
      throw new Error('Falha ao salvar pedido de compra');
    }

    await Promise.all(
      listaprodutos.map((e) =>
        this.repListaComp.AtualizarQuantProduto(e.idProduto, e.quantidade),
      ),
    );

    const emailEnviado = await this.mailService.enviarPedido(
      cliente,
      listaprodutos,
    );

    return emailEnviado;
  }

  async BuscaListaComprasAllClientes(mes: number) {
    return await this.repListaComp.ListaPedidosCompraAllClientes(mes);
  }

  async BuscaListaComprasEspecifica(idLista: number) {
    return await this.repListaComp.FindPedidoEspecifico(idLista);
  }

  async BuscaListaComprasPorClientes(mes: number, idUsuario: number) {
    return await this.repListaComp.ListaPedidosCompraPorCadaCliente(
      mes,
      idUsuario,
    );
  }

  async CancelarPedidoCliente(
    idLista: number,
  ): Promise<{ message: string; success: boolean }> {
    const pedido = await this.repListaComp.FindPedidoEspecifico(idLista);

    if (!pedido?.dadosCompra) {
      return { message: 'Pedido não encontrado', success: false };
    }

    for (const element of pedido.dadosCompra) {
      await this.repListaComp.DevolverPedidosAoEstoque(
        element.idProduto,
        element.quantidade,
      );
    }

    await this.repListaComp.AtualizarStatusPedido(idLista);

    return { message: 'Pedido foi cancelado', success: true };
  }
}
