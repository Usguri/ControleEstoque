import { UpdateCategoriaDto } from './../categoria/dto/update-categoria.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from 'src/categoria/entities/categoria.entity';
import { Produto, Imagens } from './entities/produto.entity';
import { CreateProdutoDto } from './dto/create-produto.dto';
import {
  UpdateStatusProduto,
  UpdateStatusPromocao,
} from './dto/update-produto.dto';
import { ImagemComDados } from './dto/retorno-produto.dts';

@Injectable()
export class ProdutosRepository {
  invalidarCache() {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Categoria)
    private readonly RepCategorias: Repository<Categoria>,
    @InjectRepository(Produto)
    private readonly RepProduto: Repository<Produto>,
    @InjectRepository(Imagens)
    private readonly RepImagens: Repository<Imagens>,
  ) {}

  async ListCategoriasAtivas(): Promise<Categoria[]> {
    return await this.RepCategorias.find({
      where: { check: true },
      order: { idCategoria: 'ASC' },
    });
  }

  async ExisteCodProduto(codProd: string, idCategoria: number) {
    return await this.RepProduto.find({
      where: { codProduto: codProd, idCategoria: idCategoria },
    });
  }

  async SalvaProduto(createProduto: CreateProdutoDto) {
    return this.RepProduto.save(createProduto);
  }

  async SalvaEdicaoProduto(edicaoProduto: CreateProdutoDto) {
    return await this.RepProduto.update(
      { idProduto: edicaoProduto.idProduto },
      {
        nomeProduto: edicaoProduto.nomeProduto,
        preco: edicaoProduto.preco,
        promocao: edicaoProduto.promocao,
        precoPromocao: edicaoProduto.precoPromocao,
        quantidadeAtual: edicaoProduto.quantidadeAtual,
        codProduto: edicaoProduto.codProduto,
        descricao: edicaoProduto.descricao,
        dimensoes: edicaoProduto.dimensoes,
        idCategoria: edicaoProduto.idCategoria,
      },
    );
  }

  async SalvarImagens(
    imagens: Express.Multer.File[],
    idProduto: number | undefined,
  ) {
    if (!idProduto || !imagens || imagens.length === 0) return;

    const fs = await import('fs/promises');
    const path = await import('path');
    const sharp = await import('sharp');

    const pastaProduto = path.join(
      process.cwd(),
      'uploads',
      `produto_${idProduto}`,
    );

    await fs.mkdir(pastaProduto, { recursive: true });

    let arquivosExistentes: string[] = [];
    try {
      arquivosExistentes = await fs.readdir(pastaProduto);
    } catch {}

    const imagensExistentes = arquivosExistentes.filter((f) =>
      /\.(webp|jpg|jpeg|png)$/i.test(f),
    );

    let numeroInicial = imagensExistentes.length + 1;

    for (const imagem of imagens) {
      const nomeArquivo = `${numeroInicial}.webp`;
      const caminhoCompleto = path.join(pastaProduto, nomeArquivo);

      const metadata = await sharp.default(imagem.buffer).metadata();
      const orientacaoOriginal =
        metadata.height > metadata.width ? 'VERTICAL' : 'HORIZONTAL';
      console.log(
        `📸 Original: ${metadata.width}x${metadata.height} (${orientacaoOriginal})`,
      );

      await sharp
        .default(imagem.buffer)
        .resize(1000, 1000, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 85 })
        .toFile(caminhoCompleto);

      const saved = await sharp.default(caminhoCompleto).metadata();
      const orientacaoSalva =
        saved.height > saved.width ? 'VERTICAL' : 'HORIZONTAL';
      console.log(
        `💾 Salvo: ${saved.width}x${saved.height} (${orientacaoSalva})\n`,
      );

      numeroInicial++;
    }
  }

  // async SalvarImagens(
  //   imagens: Express.Multer.File[],
  //   idProduto: number | undefined,
  // ) {
  //   if (!idProduto || !imagens || imagens.length === 0) return;

  //   const fs = await import('fs/promises');
  //   const path = await import('path');
  //   const sharp = await import('sharp');

  //   const pastaProduto = path.join(
  //     process.cwd(),
  //     'uploads',
  //     `produto_${idProduto}`,
  //   );

  //   await fs.mkdir(pastaProduto, { recursive: true });

  //   let arquivosExistentes: string[] = [];
  //   try {
  //     arquivosExistentes = await fs.readdir(pastaProduto);
  //   } catch {
  //     // Pasta não existe ainda, ok
  //   }

  //   const imagensExistentes = arquivosExistentes.filter((f) =>
  //     /\.(webp|jpg|jpeg|png)$/i.test(f),
  //   );

  //   let numeroInicial = imagensExistentes.length + 1;

  //   // Salva cada imagem
  //   for (const imagem of imagens) {
  //     const nomeArquivo = `${numeroInicial}.webp`;
  //     const caminhoCompleto = path.join(pastaProduto, nomeArquivo);

  //     const metadata = await sharp.default(imagem.buffer).metadata();
  //     console.log('EXIF orientation:', metadata.orientation);

  //     await sharp
  //       .default(imagem.buffer)
  //       .rotate()
  //       .resize(1000, 1000, {
  //         fit: 'inside',
  //         withoutEnlargement: true,
  //       })
  //       .webp({ quality: 85 })
  //       .toFile(caminhoCompleto);

  //     numeroInicial++;
  //   }
  // }

  async ListaProdutos(): Promise<Produto[]> {
    return await this.RepProduto.createQueryBuilder('p')
      .leftJoin('Imagens', 'i', 'i.idProduto = p.idProduto')
      .leftJoin('Categoria', 'c', 'c.idCategoria = p.idCategoria')
      .select([
        'p.idProduto as "idProduto"',
        'p.codProduto as "codProduto"',
        'p.nomeProduto as "nomeProduto"',
        'p.preco as "preco"',
        'p.promocao as "promocao"',
        'p.quantidadeComprada as "quantidadeComprada"',
        'p.idCategoria as "idCategoria"',
        'p.statusProduto as "statusProduto"',
        'p.quantidadeAtual as "quantidadeAtual"',
        'p.quantidadeVendida as "quantidadeVendida"',
        'c.categoria as "categoria"',
      ])
      .addSelect('COUNT(i.idImagem)', 'totalImagens')
      .groupBy('p.idProduto')
      .addGroupBy('p.nomeProduto')
      .addGroupBy('p.preco')
      .addGroupBy('p.promocao')
      .addGroupBy('p.quantidadeComprada')
      .addGroupBy('p.idCategoria')
      .addGroupBy('p.statusProduto')
      .addGroupBy('p.quantidadeAtual')
      .addGroupBy('p.quantidadeVendida')
      .addGroupBy('c.categoria')
      .getRawMany();
  }

  async ExisteIdProduto(idproduto: number): Promise<Produto[]> {
    return await this.RepProduto.find({
      where: {
        idProduto: idproduto,
      },
    });
  }

  async UpdateStatusProduto(updatestatusproduto: UpdateStatusProduto) {
    return await this.RepProduto.update(
      { idProduto: updatestatusproduto.idProduto },
      {
        statusProduto: updatestatusproduto.statusProduto,
      },
    );
  }

  async UpdatePromocaoProduto(upstatuspromo: UpdateStatusPromocao) {
    return await this.RepProduto.update(
      { idProduto: upstatuspromo.idProduto },
      {
        promocao: upstatuspromo.promocao,
      },
    );
  }

  async DeleteProduto(idProduto: number) {
    return await this.RepProduto.manager.transaction(async (manager) => {
      await manager.delete(Imagens, { idProduto });
      return await manager.delete(Produto, { idProduto });
    });
  }

  async BuscaProdutoEdicao(idProduto: number): Promise<any> {
    return await this.RepProduto.createQueryBuilder('p')
      .where('p.idProduto = :id', { id: idProduto })
      .getOne();
  }

  async DeletarAllImagens(idProduto: number | undefined): Promise<void> {
    await this.RepImagens.delete({ idProduto });
  }

  async BuscaImagensSelecionadas(idProduto: number): Promise<ImagemComDados[]> {
    const fs = await import('fs/promises');
    const path = await import('path');

    const pastaProduto = path.join(
      process.cwd(),
      'uploads',
      `produto_${idProduto}`,
    );

    try {
      await fs.access(pastaProduto);
    } catch {
      return [];
    }

    const arquivos = await fs.readdir(pastaProduto);
    const imagens = arquivos.filter((f) => /\.(webp|jpg|jpeg|png)$/i.test(f));

    imagens.sort((a, b) => {
      const numA = parseInt(a.match(/^(\d+)/)?.[1] || '0');
      const numB = parseInt(b.match(/^(\d+)/)?.[1] || '0');
      return numA - numB;
    });

    return imagens.map((nome) => ({
      nome,
      caminho: `uploads/produto_${idProduto}/${nome}`,
    }));
  }
}
