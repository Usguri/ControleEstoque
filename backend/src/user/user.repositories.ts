import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import {
  AlterarSenhaUsuario,
  ListaUsuariosDto,
} from './dto/login-response.dto';

@Injectable()
export class userRepository {
  constructor(
    @InjectRepository(User)
    private readonly Repositorios: Repository<User>,
  ) {}

  async saveUser(creatUser: CreateUserDto) {
    return await this.Repositorios.save(creatUser);
  }

  async findByUsername(usuario: string): Promise<User | null> {
    return await this.Repositorios.findOne({
      where: { usuario },
    });
  }

  async ListaAllUsers(): Promise<ListaUsuariosDto[]> {
    return await this.Repositorios.find({
      select: [
        'idUsuario',
        'usuario',
        'nome',
        'userAtivo',
        'role',
        'primeiroAcesso',
      ],
    });
  }

  async UpdateStatusUsuario(idUsuario: number, userAtivo: boolean) {
    return await this.Repositorios.update(
      { idUsuario: idUsuario },
      {
        userAtivo: userAtivo,
      },
    );
  }

  async UpdateResetarAcessoUsuario(idUsuario: number, senhaHash: string) {
    return await this.Repositorios.update(
      { idUsuario: idUsuario },
      {
        primeiroAcesso: false,
        senha: senhaHash,
      },
    );
  }

  async DeletarUsuarioSistema(idUsuario: number) {
    return await this.Repositorios.delete({ idUsuario });
  }

  async BuscarSenhaUsuario(idUsuario: number): Promise<User | null> {
    return await this.Repositorios.findOne({
      where: { idUsuario },
    });
  }

  async UpdateSenhaUsuario(data: AlterarSenhaUsuario) {
    return await this.Repositorios.update(
      { idUsuario: data.idUsuario },
      {
        primeiroAcesso: true,
        senha: data.novaSenha,
      },
    );
  }

  async FindUserById(idUsuario: number): Promise<User | null> {
    return await this.Repositorios.findOne({
      where: { idUsuario },
    });
  }
}
