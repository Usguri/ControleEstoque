import { Module } from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { ProdutosController } from './produtos.controller';
import { ProdutosRepository } from './produtos.repositories';
import { CategoriaModule } from 'src/categoria/categoria.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Imagens, Produto } from './entities/produto.entity';
import { ImagemCacheModule } from 'src/shared/imagem-cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Produto, Imagens]),
    CategoriaModule,
    ImagemCacheModule,
  ],
  controllers: [ProdutosController],
  providers: [ProdutosService, ProdutosRepository],
  exports: [ProdutosRepository],
})
export class ProdutosModule {}
