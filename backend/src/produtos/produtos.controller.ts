import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Put,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProdutosService } from './produtos.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import {
  UpdateStatusProduto,
  UpdateStatusPromocao,
} from './dto/update-produto.dto';

@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  @Get('CategoriasAtivas')
  getCategoriasAtivas() {
    return this.produtosService.GetCategorias();
  }

  @Post('CadastrarProduto')
  @UseInterceptors(FilesInterceptor('imagemProduto'))
  createNovoProduto(
    @UploadedFiles() imagens: Express.Multer.File[],
    @Body() createprodtudo: CreateProdutoDto,
  ) {
    return this.produtosService.Create(createprodtudo, imagens);
  }

  @Put('edicaoProdutos')
  @UseInterceptors(FilesInterceptor('imagemProduto'))
  edicaoProduto(
    @UploadedFiles() imagens: Express.Multer.File[],
    @Body() edicaoProduto: CreateProdutoDto,
  ) {
    return this.produtosService.UpdateProduto(edicaoProduto, imagens);
  }

  @Get('ListaProdutos')
  listaAllProdutos() {
    return this.produtosService.ListaTodosProdutos();
  }

  @Patch('AtualizarStatusProduto')
  atualizaStatusProduto(@Body() updatestatusproduto: UpdateStatusProduto) {
    return this.produtosService.UpStatusProduto(updatestatusproduto);
  }

  @Patch('AtualizarStatusProcaoPrto')
  atualizaStatusPromocaoProduto(
    @Body() updatestatuspromocao: UpdateStatusPromocao,
  ) {
    return this.produtosService.UpStatusPromocaoProduto(updatestatuspromocao);
  }

  @Delete('delProduto/:idProduto')
  remove(@Param('idProduto') id: number) {
    return this.produtosService.RemoveProduto(id);
  }

  @Get('buscarDadosEditar/:idProduto')
  buscarDados(@Param('idProduto') idProduto: number) {
    return this.produtosService.BuscarDadosEdicao(idProduto);
  }

  @Delete('deletarImagem/:idProduto/:nomeImagem')
  deletarImagemPasta(
    @Param('idProduto') idProduto: number,
    @Param('nomeImagem') nomeImagem: string,
  ) {
    return this.produtosService.DeletarImagemSalva(idProduto, nomeImagem);
  }

  @Get('migrar-imagens')
  async migrarImagens() {
    await this.produtosService.MigrarImagensParaPastas();
    return { message: 'Migração concluída!' };
  }
}
