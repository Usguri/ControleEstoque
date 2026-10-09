import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('Empresa')
export class Empresa {
  @PrimaryColumn({ default: 1 })
  idempresa: number;

  @Column({ type: 'text', nullable: true })
  nomeEmpresa: string;

  @Column({ type: 'text', nullable: true })
  email: string;

  @Column({ nullable: true })
  fone: string;

  @Column({ type: 'text', nullable: true })
  cidade: string;

  @Column({ type: 'text', nullable: true })
  endereco: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;
}
