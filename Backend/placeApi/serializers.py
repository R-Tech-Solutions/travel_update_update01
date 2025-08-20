from rest_framework import serializers
from .models import Place, PlaceImage, ItineraryDay, ItineraryPhoto, Booking, Item, Service, GalleryPhoto, Post, Contact, Front

class PlaceImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaceImage
        fields = ['id', 'image']

class ItineraryPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItineraryPhoto
        fields = ['id', 'image']

class ItineraryDaySerializer(serializers.ModelSerializer):
    photos = ItineraryPhotoSerializer(many=True, read_only=True)

    class Meta:
        model = ItineraryDay
        fields = ['id', 'day', 'sub_iterative_description', 'sub_description', 'photos']

class PlaceSerializer(serializers.ModelSerializer):
    sub_images = PlaceImageSerializer(many=True, read_only=True)
    itinerary_days = ItineraryDaySerializer(many=True, read_only=True)

    class Meta:
        model = Place
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ('user',)
        # children_ages will be included automatically if present in the model

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

class GalleryPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryPhoto
        fields = ['id', 'image', 'uploaded_at']

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'


class FrontSerializer(serializers.ModelSerializer):
    class Meta:
        model = Front
        fields = '__all__'