import { Injectable } from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto';
import {
  UpdateStatusProduto,
  UpdateStatusPromocao,
} from './dto/update-produto.dto';
import { ProdutosRepository } from './produtos.repositories';
import { DeletarImagensPorID } from './utils/helpers';
import { ImagemCacheService } from 'src/shared/imagem-cache.service';

@Injectable()
export class ProdutosService {
  constructor(
    private readonly repProdutos: ProdutosRepository,
    private imagemCache: ImagemCacheService,
  ) {}

  async Create(
    createProdutoDto: CreateProdutoDto,
    imagens: Express.Multer.File[],
  ) {
    const existeCod = await this.repProdutos.ExisteCodProduto(
      createProdutoDto.codProduto,
      createProdutoDto.idCategoria,
    );

    if (existeCod.length > 0) {
      return {
        success: false,
        message: 'Código do produto já existe.',
      };
    }

    const produto = await this.repProdutos.SalvaProduto(createProdutoDto);
    await this.repProdutos.SalvarImagens(imagens, produto.idProduto);
    this.imagemCache.invalidarCache();

    return {
      success: true,
      message: 'Produto criado com sucesso!',
    };
  }

  async UpdateProduto(
    edicaoProduto: CreateProdutoDto,
    imagens: Express.Multer.File[],
  ) {
    await this.repProdutos.SalvaEdicaoProduto(edicaoProduto);
    await this.repProdutos.SalvarImagens(imagens, edicaoProduto.idProduto);
    this.imagemCache.invalidarCache();

    return {
      success: true,
      message: 'Produto editado com sucesso!',
    };
  }

  GetCategorias() {
    return this.repProdutos.ListCategoriasAtivas();
  }

  ListaTodosProdutos() {
    return this.repProdutos.ListaProdutos();
  }

  async UpStatusProduto(updatestatusproduto: UpdateStatusProduto) {
    try {
      const produto = await this.repProdutos.ExisteIdProduto(
        updatestatusproduto.idProduto,
      );

      if (!produto) {
        return { success: false, message: 'Produto não existe!' };
      }

      await this.repProdutos.UpdateStatusProduto(updatestatusproduto);
      return { success: true, message: 'Status Produto atualizado!' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async UpStatusPromocaoProduto(upstatuspromocao: UpdateStatusPromocao) {
    try {
      const produto = await this.repProdutos.ExisteIdProduto(
        upstatuspromocao.idProduto,
      );

      if (!produto) {
        return { success: false, message: 'Produto não existe!' };
      }

      await this.repProdutos.UpdatePromocaoProduto(upstatuspromocao);
      return { success: true, message: 'Status Promoção atualizada!' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async RemoveProduto(id: number) {
    const produto = await this.repProdutos.ExisteIdProduto(id);

    if (!produto) {
      return { success: false, message: 'Produto não encontrado!' };
    }

    await this.repProdutos.DeleteProduto(id);
    await DeletarImagensPorID(id);
    return { success: true, message: 'Produto deletado!' };
  }

  async BuscarDadosEdicao(idProduto: number): Promise<any> {
    const produto = await this.repProdutos.BuscaProdutoEdicao(idProduto);
    const imagemProduto =
      await this.repProdutos.BuscaImagensSelecionadas(idProduto);

    return {
      ...produto,
      imagemProduto,
    };
  }

  async DeletarImagemSalva(idProduto: number, nomeImagem: string) {
    const fs = await import('fs/promises');
    const path = await import('path');

    const pastaProduto = path.join(
      process.cwd(),
      'uploads',
      `produto_${idProduto}`,
    );
    const caminhoCompleto = path.join(pastaProduto, nomeImagem);

    console.log('Deletando:', caminhoCompleto);

    try {
      await fs.unlink(caminhoCompleto);
      this.imagemCache.invalidarCache();
      return { message: 'Imagem deletada', success: true };
    } catch (error) {
      console.error('Erro ao deletar:', error);
      return { message: 'Imagem não encontrada', success: false };
    }
  }

  async MigrarImagensParaPastas() {
    const fs = await import('fs/promises');
    const path = await import('path');
    const sharp = await import('sharp');

    const pastaUploads = path.join(process.cwd(), 'uploads');
    const arquivos = await fs.readdir(pastaUploads);
    const imagens = arquivos.filter((f) => /\.(webp|jpg|jpeg|png)$/i.test(f));

    let sucesso = 0;
    let erros = 0;

    for (const nomeImagem of imagens) {
      try {
        const match = nomeImagem.match(/^(\d+)/);

        if (!match) {
          console.log(`⚠️  Imagem sem ID: ${nomeImagem}`);
          continue;
        }

        const idProduto = match[1];
        const pastaProduto = path.join(pastaUploads, `produto_${idProduto}`);

        await fs.mkdir(pastaProduto, { recursive: true });

        const existentes = await fs.readdir(pastaProduto);
        const numero = existentes.length + 1;

        const caminhoOriginal = path.join(pastaUploads, nomeImagem);
        const caminhoNovo = path.join(pastaProduto, `${numero}.webp`);

        await sharp
          .default(caminhoOriginal)
          .resize(1000, 1000, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality: 85 })
          .toFile(caminhoNovo);

        await fs.unlink(caminhoOriginal);

        console.log(`✓ ${nomeImagem} -> produto_${idProduto}/${numero}.webp`);
        sucesso++;
      } catch (error) {
        console.error(`❌ Erro ao migrar ${nomeImagem}:`, error.message);
        erros++;
        // Não apaga o arquivo com erro - mantém o original
      }
    }

    console.log(`\n✅ Sucesso: ${sucesso} | ❌ Erros: ${erros}`);
  }
}
