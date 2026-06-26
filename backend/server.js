const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// Copiar la imagen de escaleras subida al directorio público del frontend al iniciar
try {
  const srcImagePath = 'C:\\Users\\joyce\\.gemini\\antigravity\\brain\\816907e0-3012-4b4c-8dd4-d1e7baf4a049\\media__1782458712427.png';
  const destDir = path.join(__dirname, '..', 'public');
  if (fs.existsSync(srcImagePath)) {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(srcImagePath, path.join(destDir, 'escaleras.png'));
    console.log('Servidor copió exitosamente escaleras.png a la carpeta public del frontend');
  }
} catch (err) {
  console.error('Error al copiar imagen de escaleras a la carpeta public:', err);
}

// Ruta para servir la imagen de las escaleras mecánicas directamente
app.get('/images/escaleras.png', (req, res) => {
  const imagePath = 'C:\\Users\\joyce\\.gemini\\antigravity\\brain\\816907e0-3012-4b4c-8dd4-d1e7baf4a049\\media__1782458712427.png';
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    // Redirigir a una imagen de escaleras mecánica de unsplash si no existe el archivo local
    res.redirect('https://images.unsplash.com/photo-1519642918688-7e43b19245d8?auto=format&fit=crop&q=80&w=600');
  }
});

// Helper function to read database
function readDB() {
  try {
    const rawData = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error reading db.json:', error);
    return { users: [], locales: [], zonas: {} };
  }
}

// Helper function to write database
function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to db.json:', error);
  }
}

// Authentication Endpoint
app.post('/api/auth/login', (req, res) => {
  const { usuario, contrasena } = req.body;
  
  if (!usuario || !contrasena) {
    return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
  }

  const db = readDB();
  const user = db.users.find(
    (u) => u.usuario.toLowerCase() === usuario.toLowerCase() && u.contrasena === contrasena
  );

  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  // Generate a mock token
  const token = `mock-jwt-token-for-${user.usuario}`;
  
  res.json({
    usuario: user.usuario,
    nombre: user.nombre,
    rol: user.rol,
    localAsignado: user.localAsignado,
    token
  });
});

// Get locales list (Requires authentication - simple mockup verification)
app.get('/api/locales', (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).json({ error: 'Acceso denegado. Token no provisto.' });
  }

  const db = readDB();
  res.json(db.locales);
});

// Get zones for a specific store
app.get('/api/zonas/:localId', (req, res) => {
  const { localId } = req.params;
  const db = readDB();
  
  const storeZones = db.zonas[localId];
  if (!storeZones) {
    return res.status(404).json({ error: 'Local no encontrado o no contiene zonas' });
  }

  res.json(storeZones);
});

// Add or update a zone for a specific store
app.post('/api/zonas/:localId', (req, res) => {
  const { localId } = req.params;
  const newZone = req.body; // Can be a new zone or updated zone
  
  if (!newZone || !newZone.codigo || !newZone.nombre) {
    return res.status(400).json({ error: 'El código y nombre de la zona son obligatorios' });
  }

  const db = readDB();
  
  if (!db.zonas[localId]) {
    db.zonas[localId] = [];
  }

  const zonesList = db.zonas[localId];
  const targetFloor = newZone.piso || "1";
  const existingZoneIndex = zonesList.findIndex((z) => z.codigo === newZone.codigo && (z.piso || "1") === targetFloor);

  // Determine heatmap status from density value
  const qty = parseInt(newZone.cantidad, 10) || 0;
  let computedStatus = 'frio';
  if (qty >= 140) {
    computedStatus = 'caliente';
  } else if (qty >= 70) {
    computedStatus = 'templado';
  }
  newZone.estado = computedStatus;
  newZone.piso = targetFloor;

  if (existingZoneIndex !== -1) {
    // Update existing zone
    zonesList[existingZoneIndex] = {
      ...zonesList[existingZoneIndex],
      ...newZone
    };
  } else {
    // Add new zone (mock some default SVG coordinates if missing)
    zonesList.push({
      cx: "500",
      cy: "300",
      x: "500",
      y: "300",
      xPill: "440",
      yPill: "285",
      aforoMax: 150,
      ...newZone
    });
  }

  writeDB(db);
  res.json({ message: 'Zona guardada con éxito', zona: newZone });
});

app.listen(PORT, () => {
  console.log(`Jumbo Heatmap Backend running at http://localhost:${PORT}`);
});
