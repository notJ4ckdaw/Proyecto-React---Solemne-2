import os
from django.shortcuts import get_object_or_404, redirect
from django.http import FileResponse, Http404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Local, Usuario, Zona
from .serializers import LocalSerializer, UsuarioSerializer, ZonaSerializer

@api_view(['POST'])
def login_view(req):
    usuario = req.data.get('usuario')
    contrasena = req.data.get('contrasena')

    if not usuario or not contrasena:
        return Response({'error': 'Usuario y contraseña son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = Usuario.objects.get(usuario__iexact=usuario, contrasena=contrasena)
    except Usuario.DoesNotExist:
        return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)

    token = f"mock-jwt-token-for-{user.usuario}"
    
    return Response({
        'usuario': user.usuario,
        'nombre': user.nombre,
        'rol': user.rol,
        'localAsignado': user.localAsignado.id if user.localAsignado else None,
        'token': token
    })

@api_view(['GET'])
def locales_list(req):
    token = req.headers.get('Authorization') or req.META.get('HTTP_AUTHORIZATION')
    if not token:
        return Response({'error': 'Acceso denegado. Token no provisto.'}, status=status.HTTP_403_FORBIDDEN)

    locales = Local.objects.all()
    serializer = LocalSerializer(locales, many=True)
    return Response(serializer.data)

@api_view(['GET', 'POST'])
def zonas_list_or_create(req, localId):
    try:
        local = Local.objects.get(id=localId)
    except Local.DoesNotExist:
        return Response({'error': 'Local no encontrado o no contiene zonas'}, status=status.HTTP_404_NOT_FOUND)

    if req.method == 'GET':
        zonas = Zona.objects.filter(local=local)
        serializer = ZonaSerializer(zonas, many=True)
        return Response(serializer.data)

    elif req.method == 'POST':
        new_zone_data = req.data
        codigo = new_zone_data.get('codigo')
        nombre = new_zone_data.get('nombre')
        piso = new_zone_data.get('piso', '1')

        if not codigo or not nombre:
            return Response({'error': 'El código y nombre de la zona son obligatorios'}, status=status.HTTP_400_BAD_REQUEST)

        # Determinar estado en base a la cantidad
        cantidad = int(new_zone_data.get('cantidad', 0))
        if cantidad >= 140:
            estado = 'caliente'
        elif cantidad >= 70:
            estado = 'templado'
        else:
            estado = 'frio'

        # Buscar por clave compuesta (codigo + piso + local)
        try:
            zona = Zona.objects.get(codigo=codigo, piso=piso, local=local)
            # Actualizar zona existente
            zona.nombre = nombre
            zona.cantidad = cantidad
            zona.estado = estado
            if 'imagen' in new_zone_data:
                zona.imagen = new_zone_data.get('imagen')
            zona.save()
        except Zona.DoesNotExist:
            # Crear nueva zona (con coordenadas por defecto si no se especifican)
            zona_id = f"{codigo}-P{piso}-{localId}"
            zona = Zona.objects.create(
                id=zona_id,
                codigo=codigo,
                piso=piso,
                nombre=nombre,
                estado=estado,
                cantidad=cantidad,
                aforoMax=int(new_zone_data.get('aforoMax', 150)),
                x=new_zone_data.get('x', '500'),
                y=new_zone_data.get('y', '300'),
                cx=new_zone_data.get('cx', '500'),
                cy=new_zone_data.get('cy', '300'),
                xPill=new_zone_data.get('xPill', '440'),
                yPill=new_zone_data.get('yPill', '285'),
                imagen=new_zone_data.get('imagen', ''),
                local=local
            )

        serializer = ZonaSerializer(zona)
        return Response({'message': 'Zona guardada con éxito', 'zona': serializer.data})

def serve_escaleras_image(req):
    image_path = 'C:\\Users\\joyce\\.gemini\\antigravity\\brain\\816907e0-3012-4b4c-8dd4-d1e7baf4a049\\media__1782458712427.png'
    if os.path.exists(image_path):
        return FileResponse(open(image_path, 'rb'), content_type='image/png')
    else:
        # Redirigir a una imagen de escaleras mecánica de unsplash si no existe el archivo local
        return redirect('https://images.unsplash.com/photo-1519642918688-7e43b19245d8?auto=format&fit=crop&q=80&w=600')
