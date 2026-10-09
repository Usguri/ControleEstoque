import { Controller, Post, Body, Query, Get, Patch } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post('salvarDadosCliente')
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.createDadosCliente(createClienteDto);
  }

  @Get('buscarDadosCliente')
  findDadosCliente(@Query('idUsuario') idUsuario: number) {
    return this.clientesService.buscaDadosCliente(idUsuario);
  }

  @Patch('salvarEdicaoDadosCliente')
  editar(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.editarDadosCliente(createClienteDto);
  }
}
