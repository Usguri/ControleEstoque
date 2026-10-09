import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateCategoriaDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: 'Categoria é obrigatoria' })
  idCategoria: number;

  @ApiProperty({
    description: 'Informe uma categoria',
    example: 'Nova categoria',
  })
  @IsString()
  @IsOptional()
  categoria?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  check?: boolean;
}
