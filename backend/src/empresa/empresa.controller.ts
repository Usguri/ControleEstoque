import { Controller, Get, Body, Put } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

@Controller('empresa')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @Get('buscaDadosEmpresa')
  findAll() {
    return this.empresaService.findAll();
  }

  @Put('salvarDadosEmpresa')
  update(@Body() updateEmpresaDto: UpdateEmpresaDto) {
    return this.empresaService.update(updateEmpresaDto);
  }
}
