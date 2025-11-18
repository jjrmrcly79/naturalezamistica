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
import { Plus, Edit, Trash2, Eye, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Admin() {
  const navigate = useNavigate();
  const { user, loading, isAdmin, signOut } = useAuth();
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
    if (!loading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAdmin) {
        toast.error("No tienes permisos de administrador");
        navigate("/");
      } else {
        fetchProducts();
      }
    }
  }, [user, loading, isAdmin, navigate]);

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
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) {
        toast.error("Error al eliminar producto");
        console.error(error);
      } else {
        toast.success("Producto eliminado");
        fetchProducts();
      }
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

  const handleSignOut = async () => {
    await signOut();
    toast.success("Sesión cerrada");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>

        <div className="grid gap-8">
          {/* Form Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  {editingProduct ? "Editar Producto" : "Nuevo Producto"}
                </span>
                {editingProduct && (
                  <Button onClick={resetForm} variant="outline" size="sm">
                    Cancelar
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="producto">Nombre del Producto*</Label>
                    <Input
                      id="producto"
                      value={formData.producto}
                      onChange={(e) =>
                        setFormData({ ...formData, producto: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="precio">Precio*</Label>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion_detallada">
                    Descripción Detallada
                  </Label>
                  <Textarea
                    id="descripcion_detallada"
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

                <div className="space-y-2">
                  <Label htmlFor="beneficios_usos">Beneficios / Usos</Label>
                  <Textarea
                    id="beneficios_usos"
                    value={formData.beneficios_usos}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        beneficios_usos: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="palabras_clave">
                      Palabras Clave / Síntomas
                    </Label>
                    <Input
                      id="palabras_clave"
                      value={formData.palabras_clave}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          palabras_clave: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="proveedor">Proveedor</Label>
                    <Input
                      id="proveedor"
                      value={formData.proveedor}
                      onChange={(e) =>
                        setFormData({ ...formData, proveedor: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="especificacion">Especificación</Label>
                    <Input
                      id="especificacion"
                      value={formData.especificacion}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          especificacion: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cantidad">Cantidad</Label>
                    <Input
                      id="cantidad"
                      value={formData.cantidad}
                      onChange={(e) =>
                        setFormData({ ...formData, cantidad: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_url">URL de Imagen</Label>
                  <Input
                    id="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, image_url: e.target.value })
                    }
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  {editingProduct ? "Actualizar Producto" : "Crear Producto"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Products List */}
          <Card>
            <CardHeader>
              <CardTitle>Productos ({products.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">{product.producto}</h3>
                      <p className="text-sm text-muted-foreground">
                        ${product.precio} - ID: {product.id}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link to={`/product/${product.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
