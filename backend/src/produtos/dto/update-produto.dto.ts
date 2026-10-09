import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProdutoDto } from './create-produto.dto';
import { IsBoolean, IsNumber } from 'class-validator';

export class UpdateProdutoDto extends PartialType(CreateProdutoDto) {}

export class UpdateStatusProduto {
  @ApiProperty()
  @IsNumber()
  idProduto: number;

  @ApiProperty()
  @IsBoolean()
  statusProduto: boolean;
}

export class UpdateStatusPromocao {
  @ApiProperty()
  @IsNumber()
  idProduto: number;

  @ApiProperty()
  @IsBoolean()
  promocao: boolean;
}
