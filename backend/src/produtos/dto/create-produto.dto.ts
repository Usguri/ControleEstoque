import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProdutoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Nome produto é obrigatoria' })
  nomeProduto: string;

  @ApiProperty()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsNotEmpty({ message: 'Preço é obrigatoria' })
  preco: number;

  @ApiProperty()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsOptional()
  promocao: boolean;

  @ApiProperty()
  @Transform(({ value }) => (value ? parseFloat(value) : 0))
  @IsNumber()
  @IsOptional()
  precoPromocao?: number;

  @ApiProperty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsNotEmpty({ message: 'Quantidade é obrigatoria' })
  quantidadeComprada: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Cod.Produto é obrigatoria' })
  codProduto: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  dimensoes?: string;

  @ApiProperty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsNotEmpty({ message: 'Id categoria é obrigatoria' })
  idCategoria: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  idProduto?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  imagemProduto?: any;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  quantidadeAtual: number;
}
