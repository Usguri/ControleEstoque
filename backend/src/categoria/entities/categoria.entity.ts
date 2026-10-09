import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Categoria')
export class Categoria {
  @PrimaryGeneratedColumn()
  idCategoria: number;

  @Column('text')
  categoria: string;

  @Column({ default: true })
  check: boolean;
}
