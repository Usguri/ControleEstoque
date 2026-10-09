import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEmail,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class UpdateEmpresaDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(1)
  idempresa: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  nomeEmpresa?: string;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  fone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  cidade?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  endereco?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  descricao?: string;
}
