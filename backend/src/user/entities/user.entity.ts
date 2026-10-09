import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('Login')
@Index('idx_usuario', ['usuario'])
export class User {
  @PrimaryGeneratedColumn()
  idUsuario: number;

  @Column({ type: 'varchar', length: 255 })
  usuario: string;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @Column({ type: 'varchar', length: 255 })
  senha: string;

  @Column({ type: 'boolean', default: false })
  userAtivo: boolean;

  @Column({ type: 'int', default: 0 })
  role: number;

  @Column({ type: 'boolean', default: false })
  primeiroAcesso: boolean;
}
