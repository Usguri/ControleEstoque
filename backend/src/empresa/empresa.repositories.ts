import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { Empresa } from './entities/empresa.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EmpresaRepository {
  constructor(
    @InjectRepository(Empresa)
    private readonly Repositorios: Repository<Empresa>,
  ) {}

  async BuscaDadosEmpresa(): Promise<Empresa[]> {
    return await this.Repositorios.find();
  }

  async UpdateDadosEmpresa(updateEmpresaDto: UpdateEmpresaDto) {
    return await this.Repositorios.update(1, updateEmpresaDto);
  }
}
