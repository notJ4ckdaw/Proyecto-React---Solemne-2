from django.db import models

class Local(models.Model):
    id = models.CharField(max_length=10, primary_key=True)  # L-01, L-02, L-03
    nombre = models.CharField(max_length=100)
    comuna = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.nombre} ({self.comuna})"

class Usuario(models.Model):
    usuario = models.CharField(max_length=50, primary_key=True)  # jefe.local, jefe.general
    contrasena = models.CharField(max_length=50)
    nombre = models.CharField(max_length=100)
    rol = models.CharField(max_length=50)  # jefe_local, jefe_general
    localAsignado = models.ForeignKey(Local, null=True, blank=True, on_delete=models.SET_NULL, related_name='usuarios')

    def __str__(self):
        return f"{self.nombre} ({self.rol})"

class Zona(models.Model):
    id = models.CharField(max_length=50, primary_key=True)  # Clave única generada: Z-01-P1-L-01
    codigo = models.CharField(max_length=10)  # Z-01, Z-02...
    piso = models.CharField(max_length=5, default="1")  # 1, 2, 3
    nombre = models.CharField(max_length=100)
    estado = models.CharField(max_length=20, default="frio")  # caliente, templado, frio
    cantidad = models.IntegerField(default=0)
    aforoMax = models.IntegerField(default=150)
    
    # Coordenadas SVG
    x = models.CharField(max_length=10)
    y = models.CharField(max_length=10)
    cx = models.CharField(max_length=10)
    cy = models.CharField(max_length=10)
    xPill = models.CharField(max_length=10)
    yPill = models.CharField(max_length=10)
    
    # Imagen representativa
    imagen = models.TextField(blank=True, null=True)
    
    # Relación con el local
    local = models.ForeignKey(Local, on_delete=models.CASCADE, related_name='zonas')

    class Meta:
        unique_together = ('codigo', 'piso', 'local')

    def __str__(self):
        return f"{self.local.id} - Piso {self.piso} - {self.codigo} ({self.nombre})"
