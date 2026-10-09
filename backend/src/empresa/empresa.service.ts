import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { EmpresaRepository } from './empresa.repositories';

@Injectable()
export class EmpresaService {
  constructor(private readonly repEmpresa: EmpresaRepository) {}
  async findAll() {
    return await this.repEmpresa.BuscaDadosEmpresa();
  }

  async update(updateEmpresaDto: UpdateEmpresaDto) {
    try {
      await this.repEmpresa.UpdateDadosEmpresa(updateEmpresaDto);
      return { success: true, message: 'Empresa atualizada com sucesso' };
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Erro ao atualizar empresa',
      });
    }
  }
}
