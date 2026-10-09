import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ListaComprasService } from './lista-compras.service';
import { ListaProdutos, DadosCliente } from './dto/lista-produtos-compra.dto';

@Controller('lista-compras')
export class ListaComprasController {
  constructor(private readonly listaComprasService: ListaComprasService) {}

  @Get('listaProdutosComercializar')
  findAll() {
    return this.listaComprasService.BuscaListaProdutos();
  }

  @Post('listaProdutosPreComercializar')
  listaProdComer(@Body() listIds: number[]) {
    return this.listaComprasService.BuscaProdComercializar(listIds);
  }

  @Post('listaPedidosFinalizarCompra')
  listaProdFinalizarCompra(
    @Body()
    body: {
      listComp: ListaProdutos[];
      idUsuario: number;
    },
  ) {
    return this.listaComprasService.FinalizarCompra(
      body.listComp,
      body.idUsuario,
    );
  }

  @Get('historicoDePedidosCompras')
  listaPedidoDeCompra(@Query('mes') mes: number) {
    return this.listaComprasService.BuscaListaComprasAllClientes(mes);
  }

  @Get('listaPedidoEspecifico')
  buscaPedidoEspecifico(@Query('idLista') idLista: number) {
    return this.listaComprasService.BuscaListaComprasEspecifica(idLista);
  }

  @Post('cancelarPedido')
  cancelarPedido(@Body('idLista') idLista: number) {
    return this.listaComprasService.CancelarPedidoCliente(idLista);
  }

  @Get('historicoDePedidosComprasPorCliente')
  listaPedidoDeCompraPporCliente(
    @Query('mes') mes: number,
    @Query('idUsuario') idUsuario: number,
  ) {
    return this.listaComprasService.BuscaListaComprasPorClientes(
      mes,
      idUsuario,
    );
  }
}
