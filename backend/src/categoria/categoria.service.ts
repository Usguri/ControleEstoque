import { Injectable } from '@nestjs/common';
import { CategoriaRepository } from './categoria.repositories';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriaService {
  constructor(private readonly repCategoria: CategoriaRepository) {}

  async createCategoria(createCategoriaDto: CreateCategoriaDto) {
    try {
      await this.repCategoria.saveUser(createCategoriaDto);
      return { success: true, message: 'Categoria criada!' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  findAll() {
    return this.repCategoria.findAll();
  }

  async updateCategoria(updateCategoriaDto: UpdateCategoriaDto) {
    try {
      const categoriaExiste = await this.repCategoria.existCategoria(
        updateCategoriaDto.idCategoria,
      );

      if (!categoriaExiste) {
        return { success: false, message: 'Categoria não encontrada!' };
      }

      await this.repCategoria.updateNewCategoria(updateCategoriaDto);
      return { success: true, message: 'Categoria editada!' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async remove(id: number) {
    const categoriaExiste = await this.repCategoria.existCategoria(id);

    if (!categoriaExiste) {
      return { success: false, message: 'Categoria não encontrada!' };
    }

    await this.repCategoria.deleteCategoria(id);
    return { success: true, message: 'Categoria deletada!' };
  }
}
