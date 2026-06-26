export const FALLBACK_USERS = [
  {
    "usuario": "jefe.local",
    "contrasena": "jumbo123",
    "nombre": "Manuel Guerrero",
    "rol": "jefe_local",
    "localAsignado": "L-01"
  },
  {
    "usuario": "jefe.general",
    "contrasena": "cencosud123",
    "nombre": "Beatriz Silva",
    "rol": "jefe_general",
    "localAsignado": null
  }
];

export const FALLBACK_LOCALES = [
  {"id": "L-01", "nombre": "Jumbo Costanera Center", "comuna": "Providencia"},
  {"id": "L-02", "nombre": "Jumbo Alto Las Condes", "comuna": "Las Condes"},
  {"id": "L-03", "nombre": "Jumbo El Llano", "comuna": "San Miguel"}
];

// Helper to generate coordinates (identical across floors for corresponding Z-XX)
const coords = {
  "Z-01": { x: "470", y: "515", cx: "470", cy: "460", xPill: "410", yPill: "445" },
  "Z-02": { x: "130", y: "360", cx: "130", cy: "230", xPill: "70", yPill: "215" },
  "Z-03": { x: "130", y: "95", cx: "200", cy: "95", xPill: "140", yPill: "80" },
  "Z-04": { x: "385", y: "95", cx: "385", cy: "165", xPill: "325", yPill: "150" },
  "Z-05": { x: "635", y: "95", cx: "570", cy: "95", xPill: "510", yPill: "80" },
  "Z-06": { x: "385", y: "285", cx: "385", cy: "285", xPill: "325", yPill: "270" },
  "Z-07": { x: "635", y: "285", cx: "635", cy: "215", xPill: "575", yPill: "200" },
  "Z-08": { x: "635", y: "455", cx: "635", cy: "395", xPill: "575", yPill: "380" }
};

// Floor 1 definition (Alimentos / Planta Baja)
const getFloor1Zones = (localId, modifiers) => [
  {
    "id": `Z-01-P1-${localId}`,
    "codigo": "Z-01",
    "piso": "1",
    "nombre": "Entrada y Salida Principal",
    "estado": modifiers.Z01_estado,
    "cantidad": modifiers.Z01_cant,
    "aforoMax": 200,
    ...coords["Z-01"],
    "imagen": "https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&q=80&w=600"
  },
  {
    "id": `Z-02-P1-${localId}`,
    "codigo": "Z-02",
    "piso": "1",
    "nombre": "Frutas y Verduras",
    "estado": modifiers.Z02_estado,
    "cantidad": modifiers.Z02_cant,
    "aforoMax": 150,
    ...coords["Z-02"],
    "imagen": "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&q=80&w=600"
  },
  {
    "id": `Z-03-P1-${localId}`,
    "codigo": "Z-03",
    "piso": "1",
    "nombre": "Fiambrería y Carnicería",
    "estado": modifiers.Z03_estado,
    "cantidad": modifiers.Z03_cant,
    "aforoMax": 120,
    ...coords["Z-03"],
    "imagen": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&q=80&w=600"
  },
  {
    "id": `Z-04-P1-${localId}`,
    "codigo": "Z-04",
    "piso": "1",
    "nombre": "Lácteos y Quesos",
    "estado": modifiers.Z04_estado,
    "cantidad": modifiers.Z04_cant,
    "aforoMax": 100,
    ...coords["Z-04"],
    "imagen": "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=600"
  },
  {
    "id": `Z-05-P1-${localId}`,
    "codigo": "Z-05",
    "piso": "1",
    "nombre": "Panadería y Pastelería",
    "estado": modifiers.Z05_estado,
    "cantidad": modifiers.Z05_cant,
    "aforoMax": 100,
    ...coords["Z-05"],
    "imagen": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600"
  },
  {
    "id": `Z-06-P1-${localId}`,
    "codigo": "Z-06",
    "piso": "1",
    "nombre": "Góndola Central (Abarrotes)",
    "estado": modifiers.Z06_estado,
    "cantidad": modifiers.Z06_cant,
    "aforoMax": 150,
    ...coords["Z-06"],
    "imagen": "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=600"
  },
  {
    "id": `Z-07-P1-${localId}`,
    "codigo": "Z-07",
    "piso": "1",
    "nombre": "Licores y Bebidas",
    "estado": modifiers.Z07_estado,
    "cantidad": modifiers.Z07_cant,
    "aforoMax": 80,
    ...coords["Z-07"],
    "imagen": "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=600"
  },
  {
    "id": `Z-08-P1-${localId}`,
    "codigo": "Z-08",
    "piso": "1",
    "nombre": "Línea de Cajas Rápidas",
    "estado": modifiers.Z08_estado,
    "cantidad": modifiers.Z08_cant,
    "aforoMax": 150,
    ...coords["Z-08"],
    "imagen": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600"
  }
];

// Floor 2 definition (Tecnología y Vestuario)
const getFloor2Zones = (localId, modifiers) => [
  {
    "id": `Z-01-P2-${localId}`,
    "codigo": "Z-01",
    "piso": "2",
    "nombre": "Acceso Escaleras Mecánicas",
    "estado": modifiers.Z01_estado,
    "cantidad": modifiers.Z01_cant,
    "aforoMax": 180,
    ...coords["Z-01"],
    "imagen": "http://localhost:3001/images/escaleras.png"
  },
  {
    "id": `Z-02-P2-${localId}`,
    "codigo": "Z-02",
    "piso": "2",
    "nombre": "Electrohogar y Línea Blanca",
    "estado": modifiers.Z02_estado,
    "cantidad": modifiers.Z02_cant,
    "aforoMax": 120,
    ...coords["Z-02"],
    "imagen": "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=600"
  },
  {
    "id": `Z-03-P2-${localId}`,
    "codigo": "Z-03",
    "piso": "2",
    "nombre": "Computación y Telefonía",
    "estado": modifiers.Z03_estado,
    "cantidad": modifiers.Z03_cant,
    "aforoMax": 100,
    ...coords["Z-03"],
    "imagen": "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&q=80&w=600"
  },
  {
    "id": `Z-04-P2-${localId}`,
    "codigo": "Z-04",
    "piso": "2",
    "nombre": "Vestuario Infantil",
    "estado": modifiers.Z04_estado,
    "cantidad": modifiers.Z04_cant,
    "aforoMax": 110,
    ...coords["Z-04"],
    "imagen": "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=600"
  },
  {
    "id": `Z-05-P2-${localId}`,
    "codigo": "Z-05",
    "piso": "2",
    "nombre": "Vestuario Adultos y Calzado",
    "estado": modifiers.Z05_estado,
    "cantidad": modifiers.Z05_cant,
    "aforoMax": 140,
    ...coords["Z-05"],
    "imagen": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=600"
  },
  {
    "id": `Z-06-P2-${localId}`,
    "codigo": "Z-06",
    "piso": "2",
    "nombre": "Juguetería y Rodados",
    "estado": modifiers.Z06_estado,
    "cantidad": modifiers.Z06_cant,
    "aforoMax": 130,
    ...coords["Z-06"],
    "imagen": "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?auto=format&fit=crop&q=80&w=600"
  },
  {
    "id": `Z-07-P2-${localId}`,
    "codigo": "Z-07",
    "piso": "2",
    "nombre": "Librería y Artículos de Oficina",
    "estado": modifiers.Z07_estado,
    "cantidad": modifiers.Z07_cant,
    "aforoMax": 90,
    ...coords["Z-07"],
    "imagen": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600"
  },
  {
    "id": `Z-08-P2-${localId}`,
    "codigo": "Z-08",
    "piso": "2",
    "nombre": "Cajas Piso 2",
    "estado": modifiers.Z08_estado,
    "cantidad": modifiers.Z08_cant,
    "aforoMax": 150,
    ...coords["Z-08"],
    "imagen": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600"
  }
];

// Floor 3 definition (Hogar, Aire Libre y Deportes)
const getFloor3Zones = (localId, modifiers) => [
  {
    "id": `Z-01-P3-${localId}`,
    "codigo": "Z-01",
    "piso": "3",
    "nombre": "Terraza, Jardín y Aire Libre",
    "estado": modifiers.Z01_estado,
    "cantidad": modifiers.Z01_cant,
    "aforoMax": 150,
    ...coords["Z-01"],
    "imagen": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600"
  },
  {
    "id": `Z-02-P3-${localId}`,
    "codigo": "Z-02",
    "piso": "3",
    "nombre": "Muebles y Decoración",
    "estado": modifiers.Z02_estado,
    "cantidad": modifiers.Z02_cant,
    "aforoMax": 100,
    ...coords["Z-02"],
    "imagen": "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=600"
  },
  {
    "id": `Z-03-P3-${localId}`,
    "codigo": "Z-03",
    "piso": "3",
    "nombre": "Menaje Cocina y Mesa",
    "estado": modifiers.Z03_estado,
    "cantidad": modifiers.Z03_cant,
    "aforoMax": 110,
    ...coords["Z-03"],
    "imagen": "https://images.unsplash.com/photo-1545048702-79362596cdc9?auto=format&fit=crop&q=80&w=600"
  },
  {
    "id": `Z-04-P3-${localId}`,
    "codigo": "Z-04",
    "piso": "3",
    "nombre": "Dormitorio y Blancos",
    "estado": modifiers.Z04_estado,
    "cantidad": modifiers.Z04_cant,
    "aforoMax": 100,
    ...coords["Z-04"],
    "imagen": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=600"
  },
  {
    "id": `Z-05-P3-${localId}`,
    "codigo": "Z-05",
    "piso": "3",
    "nombre": "Baño y Organización",
    "estado": modifiers.Z05_estado,
    "cantidad": modifiers.Z05_cant,
    "aforoMax": 90,
    ...coords["Z-05"],
    "imagen": "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=600"
  },
  {
    "id": `Z-06-P3-${localId}`,
    "codigo": "Z-06",
    "piso": "3",
    "nombre": "Deportes y Automotriz",
    "estado": modifiers.Z06_estado,
    "cantidad": modifiers.Z06_cant,
    "aforoMax": 120,
    ...coords["Z-06"],
    "imagen": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600"
  },
  {
    "id": `Z-07-P3-${localId}`,
    "codigo": "Z-07",
    "piso": "3",
    "nombre": "Ferretería y Herramientas",
    "estado": modifiers.Z07_estado,
    "cantidad": modifiers.Z07_cant,
    "aforoMax": 100,
    ...coords["Z-07"],
    "imagen": "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=600"
  },
  {
    "id": `Z-08-P3-${localId}`,
    "codigo": "Z-08",
    "piso": "3",
    "nombre": "Cajas Piso 3",
    "estado": modifiers.Z08_estado,
    "cantidad": modifiers.Z08_cant,
    "aforoMax": 150,
    ...coords["Z-08"],
    "imagen": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600"
  }
];

export const FALLBACK_ZONAS = {
  "L-01": [
    // Piso 1: Jumbo Costanera Center (Generalmente muy concurrido)
    ...getFloor1Zones("L-01", {
      Z01_estado: "caliente", Z01_cant: 185,
      Z02_estado: "caliente", Z02_cant: 162,
      Z03_estado: "caliente", Z03_cant: 145,
      Z04_estado: "frio", Z04_cant: 42,
      Z05_estado: "templado", Z05_cant: 115,
      Z06_estado: "templado", Z06_cant: 98,
      Z07_estado: "frio", Z07_cant: 55,
      Z08_estado: "caliente", Z08_cant: 178
    }),
    // Piso 2: Jumbo Costanera Center (Tráfico moderado)
    ...getFloor2Zones("L-01", {
      Z01_estado: "caliente", Z01_cant: 152,
      Z02_estado: "templado", Z02_cant: 88,
      Z03_estado: "caliente", Z03_cant: 141,
      Z04_estado: "frio", Z04_cant: 35,
      Z05_estado: "templado", Z05_cant: 92,
      Z06_estado: "frio", Z06_cant: 64,
      Z07_estado: "frio", Z07_cant: 28,
      Z08_estado: "templado", Z08_cant: 105
    }),
    // Piso 3: Jumbo Costanera Center (Hogar y aire libre)
    ...getFloor3Zones("L-01", {
      Z01_estado: "templado", Z01_cant: 80,
      Z02_estado: "frio", Z02_cant: 55,
      Z03_estado: "frio", Z03_cant: 62,
      Z04_estado: "frio", Z04_cant: 39,
      Z05_estado: "frio", Z05_cant: 45,
      Z06_estado: "templado", Z06_cant: 110,
      Z07_estado: "templado", Z07_cant: 78,
      Z08_estado: "frio", Z08_cant: 50
    })
  ],
  "L-02": [
    // Piso 1: Jumbo Alto Las Condes
    ...getFloor1Zones("L-02", {
      Z01_estado: "templado", Z01_cant: 110,
      Z02_estado: "frio", Z02_cant: 65,
      Z03_estado: "templado", Z03_cant: 90,
      Z04_estado: "caliente", Z04_cant: 155,
      Z05_estado: "caliente", Z05_cant: 142,
      Z06_estado: "frio", Z06_cant: 35,
      Z07_estado: "templado", Z07_cant: 82,
      Z08_estado: "templado", Z08_cant: 120
    }),
    // Piso 2: Jumbo Alto Las Condes (Alto tráfico en moda y vestuario)
    ...getFloor2Zones("L-02", {
      Z01_estado: "caliente", Z01_cant: 172,
      Z02_estado: "frio", Z02_cant: 48,
      Z03_estado: "templado", Z03_cant: 82,
      Z04_estado: "caliente", Z04_cant: 158,
      Z05_estado: "caliente", Z05_cant: 169,
      Z06_estado: "templado", Z06_cant: 112,
      Z07_estado: "frio", Z07_cant: 60,
      Z08_estado: "caliente", Z08_cant: 144
    }),
    // Piso 3: Jumbo Alto Las Condes
    ...getFloor3Zones("L-02", {
      Z01_estado: "frio", Z01_cant: 52,
      Z02_estado: "templado", Z02_cant: 78,
      Z03_estado: "frio", Z03_cant: 50,
      Z04_estado: "frio", Z04_cant: 61,
      Z05_estado: "frio", Z05_cant: 38,
      Z06_estado: "frio", Z06_cant: 59,
      Z07_estado: "frio", Z07_cant: 42,
      Z08_estado: "frio", Z08_cant: 67
    })
  ],
  "L-03": [
    // Piso 1: Jumbo El Llano
    ...getFloor1Zones("L-03", {
      Z01_estado: "frio", Z01_cant: 50,
      Z02_estado: "templado", Z02_cant: 88,
      Z03_estado: "frio", Z03_cant: 45,
      Z04_estado: "templado", Z04_cant: 72,
      Z05_estado: "frio", Z05_cant: 59,
      Z06_estado: "caliente", Z06_cant: 168,
      Z07_estado: "caliente", Z07_cant: 145,
      Z08_estado: "frio", Z08_cant: 38
    }),
    // Piso 2: Jumbo El Llano
    ...getFloor2Zones("L-03", {
      Z01_estado: "frio", Z01_cant: 40,
      Z02_estado: "frio", Z02_cant: 35,
      Z03_estado: "frio", Z03_cant: 55,
      Z04_estado: "frio", Z04_cant: 62,
      Z05_estado: "frio", Z05_cant: 50,
      Z06_estado: "frio", Z06_cant: 48,
      Z07_estado: "frio", Z07_cant: 30,
      Z08_estado: "frio", Z08_cant: 45
    }),
    // Piso 3: Jumbo El Llano
    ...getFloor3Zones("L-03", {
      Z01_estado: "caliente", Z01_cant: 160,
      Z02_estado: "caliente", Z02_cant: 148,
      Z03_estado: "templado", Z03_cant: 95,
      Z04_estado: "templado", Z04_cant: 105,
      Z05_estado: "templado", Z05_cant: 84,
      Z06_estado: "frio", Z06_cant: 62,
      Z07_estado: "caliente", Z07_cant: 140,
      Z08_estado: "caliente", Z08_cant: 155
    })
  ]
};
