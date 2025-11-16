import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Product } from "@/types/product";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";

export default function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    producto: "",
    descripcion_detallada: "",
    beneficios_usos: "",
    palabras_clave: "",
    proveedor: "",
    especificacion: "",
    cantidad: "",
    precio: "",
    image_url: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      toast.error("Error al cargar productos");
      console.error(error);
    } else {
      setProducts(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      ...formData,
      precio: parseFloat(formData.precio) || 0,
    };

    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingProduct.id);

      if (error) {
        toast.error("Error al actualizar producto");
        console.error(error);
      } else {
        toast.success("Producto actualizado");
        resetForm();
        fetchProducts();
      }
    } else {
      const { error } = await supabase.from("products").insert([productData]);

      if (error) {
        toast.error("Error al crear producto");
        console.error(error);
      } else {
        toast.success("Producto creado");
        resetForm();
        fetchProducts();
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      producto: product.producto,
      descripcion_detallada: product.descripcion_detallada || "",
      beneficios_usos: product.beneficios_usos || "",
      palabras_clave: product.palabras_clave || "",
      proveedor: product.proveedor || "",
      especificacion: product.especificacion || "",
      cantidad: product.cantidad || "",
      precio: product.precio.toString(),
      image_url: product.image_url || "",
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      toast.error("Error al eliminar producto");
      console.error(error);
    } else {
      toast.success("Producto eliminado");
      fetchProducts();
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      producto: "",
      descripcion_detallada: "",
      beneficios_usos: "",
      palabras_clave: "",
      proveedor: "",
      especificacion: "",
      cantidad: "",
      precio: "",
      image_url: "",
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-primary mb-8">Panel de Administración</h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingProduct ? "Editar Producto" : "Nuevo Producto"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="producto">Nombre del Producto *</Label>
                    <Input
                      id="producto"
                      value={formData.producto}
                      onChange={(e) =>
                        setFormData({ ...formData, producto: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="precio">Precio *</Label>
                    <Input
                      id="precio"
                      type="number"
                      step="0.01"
                      value={formData.precio}
                      onChange={(e) =>
                        setFormData({ ...formData, precio: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="descripcion">Descripción Detallada</Label>
                    <Textarea
                      id="descripcion"
                      value={formData.descripcion_detallada}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          descripcion_detallada: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="beneficios">Beneficios / Usos Principales</Label>
                    <Textarea
                      id="beneficios"
                      value={formData.beneficios_usos}
                      onChange={(e) =>
                        setFormData({ ...formData, beneficios_usos: e.target.value })
                      }
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="palabras">
                      Palabras Clave / Síntomas (separadas por comas)
                    </Label>
                    <Textarea
                      id="palabras"
                      value={formData.palabras_clave}
                      onChange={(e) =>
                        setFormData({ ...formData, palabras_clave: e.target.value })
                      }
                      placeholder="Pre-entreno, Fatiga muscular, Energía"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="proveedor">Proveedor</Label>
                      <Input
                        id="proveedor"
                        value={formData.proveedor}
                        onChange={(e) =>
                          setFormData({ ...formData, proveedor: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="cantidad">Cantidad</Label>
                      <Input
                        id="cantidad"
                        value={formData.cantidad}
                        onChange={(e) =>
                          setFormData({ ...formData, cantidad: e.target.value })
                        }
                        placeholder="600g"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="especificacion">Especificación / Ingredientes</Label>
                    <Input
                      id="especificacion"
                      value={formData.especificacion}
                      onChange={(e) =>
                        setFormData({ ...formData, especificacion: e.target.value })
                      }
                      placeholder="Citrulina, Arginina, Carnitina"
                    />
                  </div>

                  <div>
                    <Label htmlFor="image_url">URL de Imagen</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) =>
                        setFormData({ ...formData, image_url: e.target.value })
                      }
                      placeholder="https://..."
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingProduct ? "Actualizar" : "Crear"} Producto
                    </Button>
                    {editingProduct && (
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancelar
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Products List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">Productos Existentes</h2>
              {products.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{product.producto}</h3>
                        <p className="text-sm text-muted-foreground">
                          ${product.precio.toFixed(2)} - {product.cantidad}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                        >
                          <Link to={`/product/${product.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
