import { Test, TestingModule } from '@nestjs/testing';
import { ListaComprasController } from './lista-compras.controller';
import { ListaComprasService } from './lista-compras.service';

describe('ListaComprasController', () => {
  let controller: ListaComprasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListaComprasController],
      providers: [ListaComprasService],
    }).compile();

    controller = module.get<ListaComprasController>(ListaComprasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
