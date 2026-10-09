import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
  IsNumber,
} from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  empresa: string;

  @IsString()
  @IsNotEmpty()
  @Length(14, 18)
  cnpj: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  cidade: string;

  @IsString()
  @IsOptional()
  ie?: string;

  @IsString()
  @IsOptional()
  telefone: string;

  @IsNumber()
  @IsOptional()
  idUsuario: number;

  @IsNumber()
  @IsOptional()
  idCliente?: number;
}
