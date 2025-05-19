from django.urls import path
from .views import get_places, create_places, place_delete, place_update

urlpatterns = [
    path('places/', get_places, name='get_places'),
    path('places/create/', create_places, name='create_places'),
    path('places/<int:pk>/delete/', place_delete, name='place-delete'),
    path('places/<int:pk>/update/', place_update, name='place-update'),
]