import { Injectable } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { ClienteRepository } from './clientes.repositorios';

@Injectable()
export class ClientesService {
  constructor(private readonly repCliente: ClienteRepository) {}

  async createDadosCliente(createClienteDto: CreateClienteDto) {
    try {
      await this.repCliente.SalvarDadosCliente(createClienteDto);
      return {
        success: true,
        message: 'Cliente cadastrado com sucesso',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao cadastrar cliente, pode haver dados duplicados!',
        error: error.message,
      };
    }
  }
  async buscaDadosCliente(idUsuario: number) {
    return await this.repCliente.DadosCliente(idUsuario);
  }

  async editarDadosCliente(createClienteDto: CreateClienteDto) {
    try {
      await this.repCliente.SalvarDadosCliente(createClienteDto);
      return {
        success: true,
        message: 'Cliente editado com sucesso',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao editar cliente, pode haver dados duplicados!',
        error: error.message,
      };
    }
  }
}
