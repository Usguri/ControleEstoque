import { Cliente } from './entities/cliente.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClienteDto } from './dto/create-cliente.dto';

@Injectable()
export class ClienteRepository {
  constructor(
    @InjectRepository(Cliente)
    private readonly Repositorios: Repository<Cliente>,
  ) {}

  async SalvarDadosCliente(dadosCliente: CreateClienteDto) {
    return await this.Repositorios.save(dadosCliente);
  }

  async DadosCliente(idUsuario: number): Promise<Cliente | null> {
    return await this.Repositorios.findOne({
      where: { idUsuario },
    });
  }

  async EditarDadosCliente(dadosCliente: CreateClienteDto) {
    return await this.Repositorios.update(
      { idCliente: dadosCliente.idCliente },
      {
        email: dadosCliente.email,
        telefone: dadosCliente.telefone,
        ie: dadosCliente.ie,
        cidade: dadosCliente.cidade,
        cnpj: dadosCliente.cnpj,
        empresa: dadosCliente.empresa,
      },
    );
  }
}
