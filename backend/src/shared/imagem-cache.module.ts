import { Module } from '@nestjs/common';
import { ImagemCacheService } from './imagem-cache.service';

@Module({
  providers: [ImagemCacheService],
  exports: [ImagemCacheService],
})
export class ImagemCacheModule {}
