from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),        
    path('pos/', views.getPos, name="Get Position"),
    path('pos/<slug:slug>/', views.setHome, name="Set Home"),
]
