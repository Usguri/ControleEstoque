import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { Categoria } from './entities/categoria.entity';

@Injectable()
export class CategoriaRepository {
  constructor(
    @InjectRepository(Categoria)
    private readonly Repositorios: Repository<Categoria>,
  ) {}

  async saveUser(createCategoria: CreateCategoriaDto) {
    return await this.Repositorios.save(createCategoria);
  }

  async findAll(): Promise<Categoria[]> {
    return await this.Repositorios.find({
      order: {
        idCategoria: 'ASC',
      },
    });
  }

  async updateNewCategoria(upDataCategoria: UpdateCategoriaDto) {
    return await this.Repositorios.update(
      { idCategoria: upDataCategoria.idCategoria },
      {
        ...(upDataCategoria.categoria && {
          categoria: upDataCategoria.categoria,
        }),
        ...(upDataCategoria.check !== undefined && {
          check: upDataCategoria.check,
        }),
      },
    );
  }

  async existCategoria(idcategoria: number): Promise<Categoria | null> {
    return await this.Repositorios.findOne({
      where: { idCategoria: idcategoria },
    });
  }

  async deleteCategoria(idCategoria: number) {
    return await this.Repositorios.delete({ idCategoria: idCategoria });
  }
}
