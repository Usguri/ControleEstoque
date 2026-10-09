export interface Categoria {
  idCategoria: number;
  categoria: string;
  check: boolean;
}

export interface EditCategoria {
  idCategoria: number;
  categoria?: string;
  check?: boolean;
}
