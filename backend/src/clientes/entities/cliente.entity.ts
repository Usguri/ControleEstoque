import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  idCliente: number;

  @Column({ type: 'varchar', length: 255 })
  empresa: string;

  @Column({ type: 'varchar', length: 18, unique: true })
  cnpj: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  cidade: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  ie?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefone: string;

  @Column({ type: 'int', unique: true })
  idUsuario: number;
}
