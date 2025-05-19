from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Place
from .serializers import PlaceSerializer
# Create your views here. 

@api_view(['GET'])
def get_places(request):
    Places = Place.objects.all()
    serialized_data = PlaceSerializer(Places, many=True).data
    return Response(serialized_data)

@api_view(['POST'])
def create_places(request):
    data = request.data
    serializer = PlaceSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
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
    serializer = PlaceSerializer(place, data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
    
        