import { CryptoService } from './utils/bcrypt.util';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-entry.dto';
import { userRepository } from './user.repositories';
import {
  AlterarSenhaUsuario,
  LoginResponseDto,
} from './dto/login-response.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    private readonly crypto: CryptoService,
    private readonly repository: userRepository,
    private readonly authService: AuthService,
  ) {}

  async login(loginUsuario: LoginUserDto): Promise<{
    message?: string;
    dados?: LoginResponseDto[];
    token?: string;
    success: boolean;
  }> {
    const usuario = await this.repository.findByUsername(loginUsuario.usuario);

    if (
      !usuario ||
      !(await this.crypto.comparePassword(loginUsuario.senha, usuario.senha))
    ) {
      return { message: 'Credenciais inválidas', success: true };
    }

    if (!usuario.userAtivo) {
      return { message: 'Usuário inativo', success: true };
    }

    const { senha, ...usuarioSemSenha } = usuario;

    if (!usuario.primeiroAcesso) {
      return { dados: [{ ...usuarioSemSenha }], success: false };
    }

    const token = this.authService.generateToken({
      sub: usuario.idUsuario,
      email: usuario.usuario,
    });

    return {
      dados: [{ ...usuarioSemSenha }],
      token,
      success: false,
    };
  }

  async findById(idUsuario: number) {
    const usuario = await this.repository.FindUserById(idUsuario);
    if (!usuario || !usuario.userAtivo) {
      throw new UnauthorizedException('Usuário inativo');
    }

    return {
      idUsuario: usuario.idUsuario,
      nome: usuario.nome,
      usuario: usuario.usuario,
      role: usuario.role,
      userAtivo: usuario.userAtivo,
      primeiroAcesso: usuario.primeiroAcesso,
    };
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const existeUser = await this.repository.findByUsername(
        createUserDto.usuario,
      );

      if (existeUser) {
        return { success: false, message: 'Já existe usuário!' };
      }

      const senhaHash = await this.crypto.hashPassword(createUserDto.senha);

      await this.repository.saveUser({
        ...createUserDto,
        senha: senhaHash,
      });

      return { success: true, message: 'Usuário criado com sucesso' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async findAll() {
    return await this.repository.ListaAllUsers();
  }

  async alterarSatatusCheck(idUsuario: number, userAtivo: boolean) {
    try {
      await this.repository.UpdateStatusUsuario(idUsuario, userAtivo);
      const value = userAtivo ? 'Ativado' : 'Desativado';
      return { success: true, message: 'Usuário ' + value + '!' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async resertarAcessoSistema(idUsuario: string) {
    try {
      const senhaHash = await this.crypto.hashPassword(`123456789`);
      await this.repository.UpdateResetarAcessoUsuario(
        parseInt(idUsuario),
        senhaHash,
      );
      return { success: true, message: 'Senha Resetada!' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async deletarUsuarioSistema(idUsuario: string) {
    try {
      await this.repository.DeletarUsuarioSistema(parseInt(idUsuario));
      return { success: true, message: 'Usuário deletado!' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async novaSenhaUsuario(dadosUsuario: AlterarSenhaUsuario) {
    const usuario = await this.repository.BuscarSenhaUsuario(
      dadosUsuario.idUsuario,
    );

    if (!usuario) {
      return {
        message: 'Usuário não encontrado',
        success: false,
      };
    }

    const senhaValida = await this.crypto.comparePassword(
      dadosUsuario.senhaAtual,
      usuario.senha,
    );

    if (!senhaValida) {
      return {
        message: 'Senhas não conferem!',
        success: false,
      };
    }

    try {
      const senhaHash = await this.crypto.hashPassword(dadosUsuario.novaSenha);
      await this.repository.UpdateSenhaUsuario({
        ...dadosUsuario,
        novaSenha: senhaHash,
      });
      return { success: true, message: 'Nova senha foi alterada!' };
    } catch (error) {
      return {
        success: false,
        message: 'Ocorreu um erro e não foi possivel alterar a senha!',
      };
    }
  }
}
