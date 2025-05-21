from rest_framework import serializers
from .models import Place, PlaceImage

class PlaceImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaceImage
        fields = ['id', 'image']

class PlaceSerializer(serializers.ModelSerializer):
    sub_images = PlaceImageSerializer(many=True, read_only=True)

    class Meta:
        model = Place
        fields = '__all__'