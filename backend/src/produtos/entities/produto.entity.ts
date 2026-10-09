import { Categoria } from '../../categoria/entities/categoria.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';

@Entity('Produtos')
export class Produto {
  @PrimaryGeneratedColumn()
  idProduto: number;

  @Column('text', { nullable: false })
  nomeProduto: string;

  @Column('boolean', { default: true })
  statusProduto: boolean;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  preco: number;

  @Column('boolean', { default: false })
  promocao: boolean;

  @Column('decimal', { precision: 10, scale: 2, nullable: true, default: 0 })
  precoPromocao: number;

  @Column('int', { nullable: false })
  quantidadeComprada: number;

  @Column('int', { nullable: false, default: 0 })
  quantidadeVendida: number;

  @Column('int', { nullable: false })
  quantidadeAtual: number;

  @Column('varchar', { length: 100, nullable: false })
  codProduto: string;

  @Column('text', { nullable: true, default: '' })
  descricao: string;

  @Column('varchar', { length: 255, nullable: true, default: '' })
  dimensoes: string;

  @ManyToOne(() => Categoria)
  @JoinColumn({ name: 'idCategoria' })
  categoria: Categoria;

  @Column('int', { nullable: false })
  idCategoria: number;
}

@Entity('Imagens')
export class Imagens {
  @PrimaryGeneratedColumn()
  idImagem: number;

  @Column('text', { nullable: true })
  imagemProduto: string;

  @ManyToOne(() => Produto)
  @JoinColumn({ name: 'idProduto' })
  produto: Produto;

  @Column('int')
  idProduto: number;
}
