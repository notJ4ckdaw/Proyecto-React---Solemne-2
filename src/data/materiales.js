// ==========================================
// BASE DE DATOS ESTÁTICA (ZONAS DEL SUPERMERCADO)
// ==========================================
// Cumple con RF-05: Datos almacenados en archivo estático.
// Atributos de cada zona (mapeados de "materiales"):
// - id (único)
// - nombre (Nombre de la zona/departamento)
// - codigo (Código identificador)
// - estado (Nivel de tráfico: 'caliente' [alto], 'templado' [medio], 'frio' [bajo])
// - cantidad (Flujo promedio de personas por hora)
// - imagen (URL de imagen representativa)

export const inicialMateriales = [
  {
    id: 1,
    nombre: "Entrada/Salida",
    codigo: "Z-01",
    estado: "caliente",
    cantidad: 250,
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    nombre: "Frutas y Verduras",
    codigo: "Z-02",
    estado: "caliente",
    cantidad: 180,
    imagen: "https://images.unsplash.com/photo-1610348725531-843dff14cc9f?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    nombre: "Carnicería",
    codigo: "Z-03",
    estado: "templado",
    cantidad: 95,
    imagen: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    nombre: "Lácteos",
    codigo: "Z-04",
    estado: "frio",
    cantidad: 42,
    imagen: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 5,
    nombre: "Panadería",
    codigo: "Z-05",
    estado: "templado",
    cantidad: 110,
    imagen: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 6,
    nombre: "Zona de Cajas",
    codigo: "Z-06",
    estado: "caliente",
    cantidad: 220,
    imagen: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&auto=format&fit=crop&q=80"
  }
];
