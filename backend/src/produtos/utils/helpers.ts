export function processImages(imagens: (string | Express.Multer.File)[] = []) {
  if (!imagens || !imagens.length) return [];

  return imagens.map((img) => {
    if (typeof img === 'string') {
      return img;
    }

    const base64 = convertToBase64(img);
    return addDataUrlPrefix(base64, img.mimetype);
  });
}

export function convertToBase64(file: Express.Multer.File): string {
  return file.buffer.toString('base64');
}

export function addDataUrlPrefix(
  base64: string,
  mimeType: string = 'image/jpeg',
): string {
  return `data:${mimeType};base64,${base64}`;
}

export async function DeletarImagensPorID(numeroProduto: number) {
  const fs = await import('fs/promises');
  const path = await import('path');
  const uploadDir = path.join(process.cwd(), 'uploads');

  const arquivos = await fs.readdir(uploadDir);
  const deletar = arquivos
    .filter((f) => f.startsWith(`${numeroProduto}_`))
    .map((f) => fs.unlink(path.join(uploadDir, f)));

  await Promise.allSettled(deletar);
}
