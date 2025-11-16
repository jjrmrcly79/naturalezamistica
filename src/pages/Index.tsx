import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Leaf } from "lucide-react";
import brandHero from "@/assets/brand-hero.jpg";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data || []);
      setFilteredProducts(data || []);
      extractCategories(data || []);
    }
    setLoading(false);
  };

  const extractCategories = (products: Product[]) => {
    const allKeywords = products
      .flatMap((p) => p.palabras_clave?.split(",") || [])
      .map((k) => k.trim())
      .filter(Boolean);

    const uniqueCategories = Array.from(new Set(allKeywords)).slice(0, 10);
    setCategories(uniqueCategories);
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredProducts(products);
      setSelectedCategory(null);
      return;
    }

    const searchTerms = query.toLowerCase().split(" ");
    const filtered = products.filter((product) => {
      const searchableText = `
        ${product.producto}
        ${product.descripcion_detallada}
        ${product.beneficios_usos}
        ${product.palabras_clave}
      `.toLowerCase();

      return searchTerms.some((term) => searchableText.includes(term));
    });

    setFilteredProducts(filtered);
    setSelectedCategory(null);
  };

  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setFilteredProducts(products);
    } else {
      setSelectedCategory(category);
      const filtered = products.filter((product) =>
        product.palabras_clave?.toLowerCase().includes(category.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <div className="relative h-[400px] overflow-hidden">
          <img
            src={brandHero}
            alt="Naturaleza Mística - Energía para la vida"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        </div>

        {/* Search Section */}
        <div className="container mx-auto px-4 -mt-20 relative z-10">
          <div className="bg-card rounded-2xl shadow-2xl p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-primary mb-2">
                Encuentra tu producto ideal
              </h2>
              <p className="text-muted-foreground">
                Busca por síntomas, beneficios o nombre del producto
              </p>
            </div>
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                Categorías Populares
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors text-sm py-2 px-4"
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-primary mb-6">
              {selectedCategory
                ? `Productos para: ${selectedCategory}`
                : "Todos los Productos"}
            </h3>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-96 w-full" />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Leaf className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No encontramos productos
                </h3>
                <p className="text-muted-foreground">
                  Intenta con otros términos de búsqueda
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-primary text-primary-foreground py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold mb-2">Naturaleza Mística</h3>
            <p className="text-sm opacity-90">Energía para la vida</p>
            <p className="text-xs opacity-75 mt-4">
              Productos medicinales, artesanales y orgánicos
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
