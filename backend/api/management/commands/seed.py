import os
import json
from django.core.management.base import BaseCommand
from api.models import Local, Usuario, Zona

class Command(BaseCommand):
    help = 'Populates the SQLite database with initial data from db.json'

    def handle(self, *args, **options):
        # Encontrar la ruta de db.json
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
        db_path = os.path.join(base_dir, 'db.json')

        self.stdout.write(self.style.WARNING(f'Buscando db.json en: {db_path}'))

        if not os.path.exists(db_path):
            self.stdout.write(self.style.ERROR(f'No se encontró el archivo db.json en la ruta especificada.'))
            return

        with open(db_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # Limpiar datos antiguos
        self.stdout.write(self.style.WARNING('Limpiando base de datos existente...'))
        Zona.objects.all().delete()
        Usuario.objects.all().delete()
        Local.objects.all().delete()

        # 1. Poblar Locales
        self.stdout.write(self.style.MIGRATE_LABEL('Poblando Locales...'))
        locales_map = {}
        for loc_data in data.get('locales', []):
            local = Local.objects.create(
                id=loc_data['id'],
                nombre=loc_data['nombre'],
                comuna=loc_data['comuna']
            )
            locales_map[local.id] = local
            self.stdout.write(f'  Local creado: {local.nombre}')

        # 2. Poblar Usuarios
        self.stdout.write(self.style.MIGRATE_LABEL('Poblando Usuarios...'))
        for user_data in data.get('users', []):
            local_id = user_data.get('localAsignado')
            local_obj = locales_map.get(local_id) if local_id else None
            
            usuario = Usuario.objects.create(
                usuario=user_data['usuario'],
                contrasena=user_data['contrasena'],
                nombre=user_data['nombre'],
                rol=user_data['rol'],
                localAsignado=local_obj
            )
            self.stdout.write(f'  Usuario creado: {usuario.usuario} ({usuario.rol})')

        # 3. Poblar Zonas
        self.stdout.write(self.style.MIGRATE_LABEL('Poblando Zonas...'))
        zonas_dict = data.get('zonas', {})
        for local_id, zonas_list in zonas_dict.items():
            local_obj = locales_map.get(local_id)
            if not local_obj:
                self.stdout.write(self.style.WARNING(f'  Advertencia: Local {local_id} no encontrado para las zonas.'))
                continue
                
            for zone_data in zonas_list:
                # Comprobar si tiene datos de coordenadas
                x = zone_data.get('x', '500')
                y = zone_data.get('y', '300')
                cx = zone_data.get('cx', '500')
                cy = zone_data.get('cy', '300')
                xPill = zone_data.get('xPill', '440')
                yPill = zone_data.get('yPill', '285')

                zona = Zona.objects.create(
                    id=zone_data['id'],
                    codigo=zone_data['codigo'],
                    piso=zone_data.get('piso', '1'),
                    nombre=zone_data['nombre'],
                    estado=zone_data['estado'],
                    cantidad=int(zone_data['cantidad']),
                    aforoMax=int(zone_data.get('aforoMax', 150)),
                    x=x,
                    y=y,
                    cx=cx,
                    cy=cy,
                    xPill=xPill,
                    yPill=yPill,
                    imagen=zone_data.get('imagen', ''),
                    local=local_obj
                )
            self.stdout.write(f'  Se cargaron {len(zonas_list)} zonas para el local {local_id}')

        self.stdout.write(self.style.SUCCESS('¡Base de datos SQLite cargada con éxito!'))
