import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LoginResponseDto {
  idUsuario: number;
  usuario: string;
  userAtivo: boolean;
  role: number;
  primeiroAcesso: boolean;
}

export class ListaUsuariosDto {
  idUsuario: number;
  usuario: string;
  nome: string;
  userAtivo: boolean;
  role: number;
  primeiroAcesso: boolean;
}

export class AlterarSenhaUsuario {
  @IsNumber()
  idUsuario: number;

  @IsString()
  @IsNotEmpty()
  senhaAtual: string;

  @IsString()
  @IsNotEmpty()
  novaSenha: string;
}
