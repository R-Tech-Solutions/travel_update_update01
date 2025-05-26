from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Place, PlaceImage
from .serializers import PlaceSerializer
import os  # <-- Add this import at the top
# Create your views here. 

@api_view(['GET'])
def get_places(request):
    Places = Place.objects.all()
    serialized_data = PlaceSerializer(Places, many=True).data
    return Response(serialized_data)

@api_view(['GET'])
def place_detail(request, pk):
    try:
        place = Place.objects.get(pk=pk)
    except Place.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    serializer = PlaceSerializer(place)
    return Response(serializer.data)

@api_view(['POST'])
def create_places(request):
    serializer = PlaceSerializer(data=request.data)
    if serializer.is_valid():
        place = serializer.save()
        images = request.FILES.getlist('sub_images')
        for img in images:
            PlaceImage.objects.create(place=place, image=img)
        return Response(PlaceSerializer(place).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def place_delete(request, pk):
    try:
        place = Place.objects.get(pk=pk)
    except Place.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    place.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['PUT'])
def place_update(request, pk):
    try:
        place = Place.objects.get(pk=pk)
    except Place.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    data = request.data
    serializer = PlaceSerializer(place, data=data, partial=True)
    if serializer.is_valid():
        main_image = request.FILES.get('main_image')
        if main_image:
            # Delete old main image file
            if place.main_image and place.main_image.path and os.path.isfile(place.main_image.path):
                os.remove(place.main_image.path)
            place.main_image = main_image
        elif data.get('main_image_clear') == 'true':
            # Remove main image if requested
            if place.main_image and place.main_image.path and os.path.isfile(place.main_image.path):
                os.remove(place.main_image.path)
            place.main_image = None

        sub_images = request.FILES.getlist('sub_images')
        if sub_images:
            # Delete old sub images and their files
            for img in place.sub_images.all():
                img.delete()
            # Add new sub images
            for img in sub_images:
                PlaceImage.objects.create(place=place, image=img)
        elif data.get('sub_images_clear') == 'true':
            for img in place.sub_images.all():
                img.delete()

        serializer.save()
        return Response(PlaceSerializer(place).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


