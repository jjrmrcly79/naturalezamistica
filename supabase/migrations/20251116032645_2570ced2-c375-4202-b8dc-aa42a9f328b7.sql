-- Create products table for Naturaleza Mística
CREATE TABLE IF NOT EXISTS public.products (
  id BIGSERIAL PRIMARY KEY,
  producto TEXT NOT NULL,
  descripcion_detallada TEXT,
  beneficios_usos TEXT,
  palabras_clave TEXT,
  proveedor TEXT,
  especificacion TEXT,
  cantidad TEXT,
  precio DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read products (public store)
CREATE POLICY "Anyone can view products"
  ON public.products
  FOR SELECT
  USING (true);

-- Only authenticated users can insert products (for admin)
CREATE POLICY "Authenticated users can insert products"
  ON public.products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can update products (for admin)
CREATE POLICY "Authenticated users can update products"
  ON public.products
  FOR UPDATE
  TO authenticated
  USING (true);

-- Only authenticated users can delete products (for admin)
CREATE POLICY "Authenticated users can delete products"
  ON public.products
  FOR DELETE
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_products_timestamp
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_products_updated_at();

-- Create index for search optimization
CREATE INDEX IF NOT EXISTS idx_products_search 
  ON public.products USING gin(
    to_tsvector('spanish', 
      COALESCE(producto, '') || ' ' || 
      COALESCE(descripcion_detallada, '') || ' ' || 
      COALESCE(beneficios_usos, '') || ' ' || 
      COALESCE(palabras_clave, '')
    )
  );

-- Insert sample product (the example provided)
INSERT INTO public.products (
  id,
  producto,
  descripcion_detallada,
  beneficios_usos,
  palabras_clave,
  proveedor,
  especificacion,
  cantidad,
  precio
) VALUES (
  10001,
  'Óxido Nítrico (Prowinner)',
  'Suplemento en polvo (pre-entreno) con Arginina, Citrulina y Carnitina. Actúa como precursor del óxido nítrico, un vasodilatador.',
  'Mejora el flujo sanguíneo y la oxigenación muscular. Aumenta la energía, el rendimiento deportivo y la "bomba" muscular.',
  'Quiero rendir más en el gym, Pre-entreno, Fatiga muscular, Mala circulación, Bomba para ejercicio, Vasodilatador',
  'Prowinner',
  'Citrulina, Arginina, Carnitina',
  '600g',
  300.00
);