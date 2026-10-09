import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Controller('categoria')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Post('novaCategoria')
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriaService.createCategoria(createCategoriaDto);
  }

  @Get('allCategorias')
  findAll() {
    return this.categoriaService.findAll();
  }

  @Put('editarCategoria')
  EditCategoria(@Body() updatecategoria: UpdateCategoriaDto) {
    return this.categoriaService.updateCategoria(updatecategoria);
  }

  @Delete('delCategoria/:idCategoria')
  deletarCategoria(@Param('idCategoria') id: number) {
    return this.categoriaService.remove(id);
  }
}
