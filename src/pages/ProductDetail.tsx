import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, ArrowLeft, Leaf, Package, Building2, Info } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", parseInt(id))
        .maybeSingle();

      if (error) {
        console.error("Error fetching product:", error);
        toast.error("Error al cargar el producto");
      } else if (data) {
        setProduct(data);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
      toast.success("Producto agregado al carrito");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full" />
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Producto no encontrado</h2>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a la tienda
            </Link>
          </Button>
        </div>
      </>
    );
  }

  const keywords = product.palabras_clave?.split(",") || [];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a la tienda
            </Link>
          </Button>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Image */}
            <Card>
              <CardContent className="p-6">
                <div className="relative aspect-square bg-gradient-to-br from-secondary to-muted rounded-lg overflow-hidden">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.producto}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Leaf className="h-32 w-32 text-primary/30" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-primary mb-2">{product.producto}</h1>
                <p className="text-3xl font-bold text-accent">${product.precio.toFixed(2)}</p>
              </div>

              {product.descripcion_detallada && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-2 mb-2">
                      <Info className="h-5 w-5 text-primary mt-1" />
                      <h3 className="font-semibold text-lg">Descripción</h3>
                    </div>
                    <p className="text-muted-foreground">{product.descripcion_detallada}</p>
                  </CardContent>
                </Card>
              )}

              {product.beneficios_usos && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-2 mb-2">
                      <Leaf className="h-5 w-5 text-accent mt-1" />
                      <h3 className="font-semibold text-lg">Beneficios y Usos</h3>
                    </div>
                    <p className="text-muted-foreground">{product.beneficios_usos}</p>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-2 gap-4">
                {product.especificacion && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="h-4 w-4 text-primary" />
                        <p className="text-sm font-medium">Ingredientes</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{product.especificacion}</p>
                    </CardContent>
                  </Card>
                )}

                {product.cantidad && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="h-4 w-4 text-primary" />
                        <p className="text-sm font-medium">Cantidad</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{product.cantidad}</p>
                    </CardContent>
                  </Card>
                )}

                {product.proveedor && (
                  <Card className="col-span-2">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="h-4 w-4 text-primary" />
                        <p className="text-sm font-medium">Proveedor</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{product.proveedor}</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {keywords.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Para qué sirve:</h3>
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-sm py-1">
                        {keyword.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={handleAddToCart}
                size="lg"
                className="w-full text-lg h-14"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Agregar al Carrito
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
