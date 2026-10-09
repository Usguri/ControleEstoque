import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-entry.dto';
import {
  AlterarSenhaUsuario,
  LoginResponseDto,
} from './dto/login-response.dto';
import { Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const dataRetorno = await this.userService.login(loginDto);

    if (
      dataRetorno.dados?.length &&
      dataRetorno.dados?.length > 0 &&
      dataRetorno.dados[0].userAtivo
    ) {
      response.cookie('token', dataRetorno.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 2 * 60 * 60 * 1000,
        path: '/',
      });
      const { token, ...dadosSemToken } = dataRetorno;
      return dadosSemToken;
    }

    return dataRetorno;
  }

  @Get('verify')
  @UseGuards(AuthGuard)
  async verificaLogin(@Req() request: Request) {
    const idUsuario = request['user'].sub;

    // Busca os dados atualizados do usuário no banco
    return await this.userService.findById(idUsuario);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token');
    return { success: true, message: 'Logout realizado' };
  }

  @Post('createUser')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get('listaUsuario')
  findAll() {
    return this.userService.findAll();
  }

  @Patch('alterarStatusCheck')
  async alterarStatus(@Body() body: { idUsuario: number; userAtivo: boolean }) {
    return await this.userService.alterarSatatusCheck(
      body.idUsuario,
      body.userAtivo,
    );
  }

  @Patch('resetarAcessoUsuario/:idUsuario')
  async resetarAcessoUser(@Param('idUsuario') idUsuario: string) {
    return await this.userService.resertarAcessoSistema(idUsuario);
  }

  @Delete('deletarAcessoUsuario/:idUsuario')
  remove(@Param('idUsuario') idUsuario: string) {
    return this.userService.deletarUsuarioSistema(idUsuario);
  }

  @Patch('alterarSenhaUsuario')
  async criarNovaSenhaUsuario(@Body() dataDadosSenha: AlterarSenhaUsuario) {
    return await this.userService.novaSenhaUsuario(dataDadosSenha);
  }
}
