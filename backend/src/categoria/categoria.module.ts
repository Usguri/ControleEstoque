import { Module } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CategoriaController } from './categoria.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { CategoriaRepository } from './categoria.repositories';

@Module({
  imports: [TypeOrmModule.forFeature([Categoria])],
  controllers: [CategoriaController],
  providers: [CategoriaService, CategoriaRepository],
  exports: [TypeOrmModule],
})
export class CategoriaModule {}
