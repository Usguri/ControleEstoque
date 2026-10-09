import { Module } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { EmpresaController } from './empresa.controller';
import { EmpresaRepository } from './empresa.repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empresa } from './entities/empresa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Empresa])],
  controllers: [EmpresaController],
  providers: [EmpresaService, EmpresaRepository],
})
export class EmpresaModule {}
