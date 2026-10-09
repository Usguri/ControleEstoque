import { Injectable } from '@nestjs/common';

@Injectable()
export class ImagemCacheService {
  private cacheImagens = new Map<number, string[]>();
  private ultimaAtualizacao: number = 0;
  private readonly CACHE_TEMPO = 5 * 60 * 1000;

  public invalidarCache() {
    this.ultimaAtualizacao = 0;
  }

  public getImagensProduto(idProduto: number): string[] {
    return this.cacheImagens.get(idProduto) || [];
  }

  async carregarTodasImagensEmCache() {
    const agora = Date.now();

    if (agora - this.ultimaAtualizacao < this.CACHE_TEMPO) {
      return;
    }

    const fs = await import('fs/promises');
    const path = await import('path');
    const uploadDir = path.join(process.cwd(), 'uploads');

    try {
      const pastas = await fs.readdir(uploadDir, { withFileTypes: true });
      const pastasProdutos = pastas.filter(
        (dirent) => dirent.isDirectory() && dirent.name.startsWith('produto_'),
      );

      this.cacheImagens.clear();

      await Promise.all(
        pastasProdutos.map(async (pasta) => {
          const match = pasta.name.match(/^produto_(\d+)$/);
          if (!match) return;

          const idProduto = parseInt(match[1]);
          const caminhoPasta = path.join(uploadDir, pasta.name);

          const arquivos = await fs.readdir(caminhoPasta);
          const imagens = arquivos.filter((f) =>
            /\.(webp|jpg|jpeg|png)$/i.test(f),
          );

          imagens.sort((a, b) => {
            const numA = parseInt(a.match(/^(\d+)/)?.[1] || '0');
            const numB = parseInt(b.match(/^(\d+)/)?.[1] || '0');
            return numA - numB;
          });

          this.cacheImagens.set(
            idProduto,
            imagens.map((img) => `uploads/${pasta.name}/${img}`),
          );
        }),
      );

      this.ultimaAtualizacao = agora;
    } catch (error) {
      console.error('Erro ao carregar imagens:', error);
    }
  }
}
