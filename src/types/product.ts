export interface Product {
  id: number;
  producto: string;
  descripcion_detallada: string | null;
  beneficios_usos: string | null;
  palabras_clave: string | null;
  proveedor: string | null;
  especificacion: string | null;
  cantidad: string | null;
  precio: number;
  image_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
