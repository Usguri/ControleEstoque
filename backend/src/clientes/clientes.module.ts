import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { Cliente } from './entities/cliente.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteRepository } from './clientes.repositorios';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente])],
  controllers: [ClientesController],
  providers: [ClientesService, ClienteRepository],
  exports: [ClienteRepository],
})
export class ClientesModule {}
