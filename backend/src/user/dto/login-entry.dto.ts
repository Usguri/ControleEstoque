import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'Nome de usuário',
    example: 'usuario',
  })
  @IsString()
  @IsNotEmpty({ message: 'Usuário é obrigatório' })
  usuario: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: '********',
  })
  @IsString()
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  senha: string;
}
