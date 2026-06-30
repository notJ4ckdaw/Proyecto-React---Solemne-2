from rest_framework import serializers
from .models import Local, Usuario, Zona

class LocalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Local
        fields = ['id', 'nombre', 'comuna']

class UsuarioSerializer(serializers.ModelSerializer):
    localAsignado = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        fields = ['usuario', 'nombre', 'rol', 'localAsignado']

    def get_localAsignado(self, obj):
        return obj.localAsignado.id if obj.localAsignado else None

class ZonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zona
        fields = [
            'id', 'codigo', 'piso', 'nombre', 'estado', 'cantidad', 'aforoMax',
            'x', 'y', 'cx', 'cy', 'xPill', 'yPill', 'imagen'
        ]
