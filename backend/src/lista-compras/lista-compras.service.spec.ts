import { Test, TestingModule } from '@nestjs/testing';
import { ListaComprasService } from './lista-compras.service';

describe('ListaComprasService', () => {
  let service: ListaComprasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListaComprasService],
    }).compile();

    service = module.get<ListaComprasService>(ListaComprasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
