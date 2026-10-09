import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Produto } from 'src/produtos/entities/produto.entity';
import { Repository } from 'typeorm';
import { ProdutoListaDTO } from './dto/retorno-lista-compra.dto';
import {
  DadosCliente,
  DadosListaPedido,
  ListaProdutos,
} from './dto/lista-produtos-compra.dto';
import { ListaCompra } from './entities/lista-compra.entity';

@Injectable()
export class ListaComprasRepository {
  constructor(
    @InjectRepository(Produto)
    private readonly RepProduto: Repository<Produto>,
    @InjectRepository(ListaCompra)
    private readonly RepListaComp: Repository<ListaCompra>,
  ) {}

  async ListaAllProdutos(): Promise<ProdutoListaDTO[]> {
    return await this.RepProduto.createQueryBuilder('p')
      .leftJoin('Categoria', 'c', 'c.idCategoria = p.idCategoria')
      .where('p.statusProduto = true')
      .andWhere('p."quantidadeAtual" > 0')
      .select([
        'p.idProduto as "idProduto"',
        'p.codProduto as "codProduto"',
        'p.idCategoria as "idCategoria"',
        'p.nomeProduto as "nomeProduto"',
        'p.preco as "preco"',
        'p.promocao as "promocao"',
        'p.quantidadeAtual as "quantidadeAtual"',
        'p.quantidadeComprada as "quantidadeComprada"',
        'p.quantidadeVendida as "quantidadeVendida"',
        'p.statusProduto as "statusProduto"',
        'p.descricao as "descricao"',
        'p.dimensoes as "dimensoes"',
        'p.precoPromocao as "precoPromocao"',
        'c.categoria as "categoria"',
      ])
      .orderBy('p.idProduto', 'ASC')
      .getRawMany();
  }

  async BuscaImagensSelecionadas(idProduto: number): Promise<string[]> {
    const fs = await import('fs/promises');
    const path = await import('path');

    const uploadDir = path.join(process.cwd(), 'uploads');
    const arquivos = await fs.readdir(uploadDir);
    const imagensFiltradas = arquivos.filter((arquivo) =>
      arquivo.startsWith(`${idProduto}_`),
    );

    const comDatas = await Promise.all(
      imagensFiltradas.map(async (nome) => {
        const stats = await fs.stat(path.join(uploadDir, nome));
        return { nome, mtime: stats.mtime };
      }),
    );

    comDatas.sort((a, b) => a.mtime.getTime() - b.mtime.getTime());

    return comDatas.map(({ nome }) => `uploads/${nome}`);
  }

  async BuscaProdutosPreSel(listIds: number[]) {
    return await this.RepProduto.createQueryBuilder('p')
      .where('p.idProduto IN (:...listIds)', { listIds })
      .select([
        'p.idProduto',
        'p.nomeProduto',
        'p.preco',
        'p.codProduto',
        'p.descricao',
      ])
      .getMany();
  }

  async SalvarNovoPedidoCompra(
    dadoscliente: DadosCliente,
    listaprodutos: ListaProdutos[],
  ) {
    const novaListaCompra = this.RepListaComp.create({
      empresa: dadoscliente.empresa,
      cidade: dadoscliente.cidade,
      ie: dadoscliente.ie,
      fone: dadoscliente.telefone,
      email: dadoscliente.email,
      cnpj: dadoscliente.cnpj,
      idUsuarioCliente: dadoscliente.idUsuario,
      datahora: new Date(
        new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }),
      ),
      dadosCompra: listaprodutos,
    });

    return await this.RepListaComp.save(novaListaCompra);
  }

  async AtualizarQuantProduto(idprod: number, quantidade: number) {
    return await this.RepProduto.createQueryBuilder()
      .update()
      .set({
        quantidadeVendida: () => 'quantidadeVendida + :quantidade',
        quantidadeAtual: () => 'quantidadeAtual - :quantidade',
      })
      .where('idProduto = :idProduto', { idProduto: idprod, quantidade })
      .execute();
  }

  async ListaPedidosCompraAllClientes(
    mes: number,
  ): Promise<DadosListaPedido[]> {
    return await this.RepListaComp.createQueryBuilder('lista')
      .select([
        'lista.idLista as idLista',
        'lista.cidade as cidade',
        'lista.cnpj as cnpj',
        'lista.email as email',
        'lista.empresa as empresa',
        'lista.ie as ie',
        'lista.fone as fone',
        'lista.datahora as datahora',
        'lista.compFinalizada as compfinalizada',
      ])
      .where('EXTRACT(MONTH FROM lista.datahora) = :mes', { mes })
      .orderBy('lista.idLista', 'DESC')
      .getRawMany();
  }

  async FindPedidoEspecifico(idLista: number) {
    return await this.RepListaComp.findOne({
      where: { idLista },
      select: ['dadosCompra'],
    });
  }

  async DevolverPedidosAoEstoque(
    idProduto: number,
    quantidade: number,
  ): Promise<void> {
    await this.RepProduto.createQueryBuilder()
      .update(Produto)
      .set({
        quantidadeVendida: () => `quantidadeVendida - ${quantidade}`,
        quantidadeAtual: () => `quantidadeAtual + ${quantidade}`,
      })
      .where('idProduto = :idProduto', { idProduto })
      .execute();
  }

  async AtualizarStatusPedido(idLista: number) {
    return await this.RepListaComp.createQueryBuilder()
      .update(ListaCompra)
      .set({
        compFinalizada: true,
      })
      .where('idLista = :idLista', { idLista })
      .execute();
  }

  async ListaPedidosCompraPorCadaCliente(
    mes: number,
    idUsuarioCliente: number,
  ): Promise<DadosListaPedido[]> {
    return await this.RepListaComp.createQueryBuilder('lista')
      .select([
        'lista.idLista as idLista',
        'lista.cidade as cidade',
        'lista.cnpj as cnpj',
        'lista.email as email',
        'lista.empresa as empresa',
        'lista.ie as ie',
        'lista.fone as fone',
        'lista.datahora as datahora',
        'lista.compFinalizada as compfinalizada',
      ])
      .where('EXTRACT(MONTH FROM lista.datahora) = :mes', { mes })
      .andWhere('lista.idUsuarioCliente = :idUsuarioCliente', {
        idUsuarioCliente,
      })
      .orderBy('lista.idLista', 'DESC')
      .getRawMany();
  }
}
