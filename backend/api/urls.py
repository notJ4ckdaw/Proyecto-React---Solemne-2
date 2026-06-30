from django.urls import path
from . import views

urlpatterns = [
    path('api/auth/login', views.login_view, name='login'),
    path('api/locales', views.locales_list, name='locales'),
    path('api/zonas/<str:localId>', views.zonas_list_or_create, name='zonas'),
    path('images/escaleras.png', views.serve_escaleras_image, name='escaleras_image'),
]
