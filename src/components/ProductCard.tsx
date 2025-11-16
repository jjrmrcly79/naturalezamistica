import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Leaf } from "lucide-react";
import { Product } from "@/types/product";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product);
    toast.success("Producto agregado al carrito");
  };

  const keywords = product.palabras_clave?.split(",").slice(0, 3) || [];

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-accent">
      <Link to={`/product/${product.id}`}>
        <CardHeader className="p-0">
          <div className="relative h-48 bg-gradient-to-br from-secondary to-muted overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.producto}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Leaf className="h-20 w-20 text-primary/30" />
              </div>
            )}
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                ${product.precio.toFixed(2)}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Link>

      <CardContent className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg text-primary mb-2 line-clamp-2 group-hover:text-accent transition-colors">
            {product.producto}
          </h3>
        </Link>
        
        {product.beneficios_usos && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {product.beneficios_usos}
          </p>
        )}

        <div className="flex flex-wrap gap-1">
          {keywords.map((keyword, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {keyword.trim()}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          className="w-full bg-primary hover:bg-primary/90"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Agregar al Carrito
        </Button>
      </CardFooter>
    </Card>
  );
};
