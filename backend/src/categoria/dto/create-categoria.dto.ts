import { IsString, IsOptional, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoriaDto {
  @ApiProperty({
    description: 'Informe uma categoria',
    example: 'Nova categoria',
  })
  @IsString()
  @IsNotEmpty({ message: 'Categoria é obrigatoria' })
  categoria: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  check: boolean;
}
