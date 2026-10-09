import { PartialType } from '@nestjs/swagger';
import { CreateListaCompraDto } from './create-lista-compra.dto';

export class UpdateListaCompraDto extends PartialType(CreateListaCompraDto) {}
