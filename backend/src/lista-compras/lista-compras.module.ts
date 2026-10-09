import { Module } from '@nestjs/common';
import { ListaComprasService } from './lista-compras.service';
import { ListaComprasController } from './lista-compras.controller';
import { ListaComprasRepository } from './lista-compras.repositories';
import { CategoriaModule } from 'src/categoria/categoria.module';
import { ProdutosModule } from 'src/produtos/produtos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produto } from 'src/produtos/entities/produto.entity';
import { ListaCompra } from './entities/lista-compra.entity';
import { MailModule } from 'src/mail/mail.module';
import { ClientesModule } from 'src/clientes/clientes.module';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { ImagemCacheModule } from 'src/shared/imagem-cache.module';

@Module({
  imports: [
    CategoriaModule,
    ProdutosModule,
    MailModule,
    ClientesModule,
    TypeOrmModule.forFeature([Produto, ListaCompra, Cliente]),
    ImagemCacheModule,
  ],
  controllers: [ListaComprasController],
  providers: [ListaComprasService, ListaComprasRepository],
  exports: [ListaComprasRepository, ListaComprasService],
})
export class ListaComprasModule {}
