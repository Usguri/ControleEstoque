import {
  IsString,
  IsOptional,
  IsNotEmpty,
  MinLength,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome de usuário',
    example: 'usuario',
  })
  @IsString()
  @IsNotEmpty({ message: 'Usuário é obrigatório' })
  usuario: string;

  @ApiProperty({
    description: 'Nome completo',
    example: 'João Silva',
  })
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome: string;

  @IsString()
  @IsOptional()
  @MinLength(9, { message: 'Senha deve ter no mínimo 9 caracteres' })
  senha: string = '123456789';

  @IsNumber()
  @IsOptional()
  role: number = 2;

  @IsBoolean()
  @IsOptional()
  user_ativo: boolean = false;

  @IsBoolean()
  @IsOptional()
  primeiro_acesso: boolean = false;
}
