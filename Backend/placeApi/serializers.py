from rest_framework import serializers
from .models import Place

class PlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Place
        fields = '__all__'
        # fields = ['id', 'title', 'subtitle', 'price', 'about_place', 'tour_highlights', 'tour_itinerary', 'include', 'exclude', 'main_image', 'sub_images']