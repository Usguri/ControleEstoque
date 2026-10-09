import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('ListasDeCompra')
export class ListaCompra {
  @PrimaryGeneratedColumn()
  idLista: number;

  @Column('text')
  empresa: string;

  @Column('text')
  cidade: string;

  @Column('text')
  ie: string;

  @Column('text')
  fone: string;

  @Column('text')
  email: string;

  @Column('text')
  cnpj: string;

  @CreateDateColumn()
  datahora: Date;

  @Column({ default: false })
  compFinalizada: boolean;

  @Column({ nullable: true })
  idUsuarioCliente: number;

  @Column('jsonb')
  dadosCompra: Array<{
    idProduto: number;
    quantidade: number;
    mercadoria: string;
    codProduto: string;
    valorUnitario: string;
    valorTotal: string;
  }>;
}
