from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Place, PlaceImage, ItineraryDay, ItineraryPhoto, Booking, Item, Service, GalleryPhoto, Post,Contact
from .serializers import PlaceSerializer, BookingSerializer, ItemSerializer, ServiceSerializer, GalleryPhotoSerializer, PostSerializer,ContactSerializer
import os
import json
from django.core.mail import send_mail
from django.conf import settings
import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


# Set up logging
logger = logging.getLogger(__name__)

@api_view(['GET'])
def get_places(request):
    places = Place.objects.all()
    serialized_data = PlaceSerializer(places, many=True).data
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
        # Handle main images
        images = request.FILES.getlist('sub_images')
        for img in images:
            PlaceImage.objects.create(place=place, image=img)
        # Handle itinerary data
        itinerary_data = request.data.get('itinerary', [])
        if isinstance(itinerary_data, str):
            itinerary_data = json.loads(itinerary_data)
        for day_data in itinerary_data:
            day = ItineraryDay.objects.create(
                place=place,
                day=day_data.get('day'),
                sub_iterative_description=day_data.get('sub_iterative_description', ''),
                sub_description=day_data.get('sub_description', '')
            )
            # Handle photos for this day
            photos = request.FILES.getlist(f'itinerary_photos')
            for photo in photos:
                if photo.name.startswith(f'day{day_data.get("day")}_'):
                    ItineraryPhoto.objects.create(itinerary_day=day, image=photo)
        return Response(PlaceSerializer(place).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def place_delete(request, pk):
    try:
        place = Place.objects.get(pk=pk)
        # Delete all itinerary photos from storage
        for day in place.itinerary_days.all():
            for photo in day.photos.all():
                if photo.image and photo.image.path and os.path.isfile(photo.image.path):
                    os.remove(photo.image.path)
                photo.delete()
            day.delete()
        # Delete main image if exists
        if place.main_image and place.main_image.path and os.path.isfile(place.main_image.path):
            os.remove(place.main_image.path)
        # Delete sub images
        for sub_image in place.sub_images.all():
            if sub_image.image and sub_image.image.path and os.path.isfile(sub_image.image.path):
                os.remove(sub_image.image.path)
            sub_image.delete()
        place.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Place.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
def place_update(request, pk):
    try:
        place = Place.objects.get(pk=pk)
    except Place.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    data = request.data
    serializer = PlaceSerializer(place, data=data, partial=True)
    if serializer.is_valid():
        # Handle main image
        main_image = request.FILES.get('main_image')
        if main_image:
            if place.main_image and place.main_image.path and os.path.isfile(place.main_image.path):
                os.remove(place.main_image.path)
            place.main_image = main_image
        elif data.get('main_image_clear') == 'true':
            if place.main_image and place.main_image.path and os.path.isfile(place.main_image.path):
                os.remove(place.main_image.path)
            place.main_image = None
        # Handle sub images
        sub_images = request.FILES.getlist('sub_images')
        if sub_images:
            for img in place.sub_images.all():
                img.delete()
            for img in sub_images:
                PlaceImage.objects.create(place=place, image=img)
        elif data.get('sub_images_clear') == 'true':
            for img in place.sub_images.all():
                img.delete()
        # Handle itinerary data
        itinerary_data = data.get('itinerary', [])
        if isinstance(itinerary_data, str):
            itinerary_data = json.loads(itinerary_data)
        # Delete existing itinerary data and photos
        for day in place.itinerary_days.all():
            for photo in day.photos.all():
                if photo.image and photo.image.path and os.path.isfile(photo.image.path):
                    os.remove(photo.image.path)
                photo.delete()
            day.delete()
        # Create new itinerary data
        for day_data in itinerary_data:
            day = ItineraryDay.objects.create(
                place=place,
                day=day_data.get('day'),
                sub_iterative_description=day_data.get('sub_iterative_description', ''),
                sub_description=day_data.get('sub_description', '')
            )
            photos = request.FILES.getlist('itinerary_photos')
            for photo in photos:
                if photo.name.startswith(f'day{day_data.get("day")}_'):
                    ItineraryPhoto.objects.create(itinerary_day=day, image=photo)
        serializer.save()
        return Response(PlaceSerializer(place).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_itinerary_photo(request, photo_id):
    try:
        photo = ItineraryPhoto.objects.get(pk=photo_id)
        if photo.image and photo.image.path and os.path.isfile(photo.image.path):
            os.remove(photo.image.path)
        photo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except ItineraryPhoto.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_places_for_booking(request):
    places = Place.objects.all()
    if not places.exists():
        return Response({
            "message": "No places available. Please create a place first.",
            "places": []
        })
    data = [{
        'id': place.id,
        'title': place.title,
        'price': str(place.price),
        'place_type': place.place_type
    } for place in places]
    return Response({
        "message": "Available places for booking",
        "places": data
    })

@api_view(['POST'])
def create_booking(request):
    data = request.data.copy()
    if request.user.is_authenticated:
        data['user'] = request.user.id
    # Check if place exists
    place_id = data.get('place')
    if place_id:
        try:
            place = Place.objects.get(id=place_id)
        except Place.DoesNotExist:
            available_places = list(Place.objects.values_list('id', flat=True))
            return Response({
                "error": f"Place with ID {place_id} does not exist. Please check available places first.",
                "available_places_url": "/bookings/places/",
                "debug_info": {
                    "requested_place_id": place_id,
                    "available_place_ids": available_places,
                    "suggestion": "Use one of the available place IDs from /bookings/places/"
                }
            }, status=status.HTTP_400_BAD_REQUEST)
    # Save children_ages if present
    if 'children_ages' in data:
        if isinstance(data['children_ages'], str):
            try:
                data['children_ages'] = json.loads(data['children_ages'])
            except Exception:
                pass
    serializer = BookingSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_bookings(request):
    bookings = Booking.objects.all()
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_booking(request, pk):
    try:
        booking = Booking.objects.get(pk=pk)
        serializer = BookingSerializer(booking)
        return Response(serializer.data)
    except Booking.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
def update_booking(request, pk):
    try:
        booking = Booking.objects.get(pk=pk)
        data = request.data.copy()
        if 'children_ages' in data:
            if isinstance(data['children_ages'], str):
                try:
                    data['children_ages'] = json.loads(data['children_ages'])
                except Exception:
                    pass
        serializer = BookingSerializer(booking, data=data, partial=True)
        if serializer.is_valid():
            # Check if status is being updated to approved
                subject = 'Your Booking Has Been Approved!'
                message = f"""
                Dear {booking.user_name},

                We are pleased to inform you that your booking for {booking.place.title} has been approved!

                Booking Details:
                - Package: {booking.place.package_title}
                - Arrival Date: {booking.arrival_date}
                - Number of Adults: {booking.adults}
                - Number of Children: {booking.children}
                - Total Price: ${booking.price}

                We look forward to welcoming you!

                Best regards,
                Your Travel Team
                """
                try:
                    logger.info(f"Attempting to send email to {booking.email}")
                    if not settings.EMAIL_HOST_USER or not settings.EMAIL_HOST_PASSWORD:
                        raise ValueError("Email settings are not properly configured")
                    send_mail(
                        subject,
                        message,
                        settings.EMAIL_HOST_USER,
                        [booking.email],
                        fail_silently=False,
                    )
                    logger.info(f"Successfully sent email to {booking.email}")
                except Exception as e:
                    logger.error(f"Failed to send email: {str(e)}")
                    serializer.save()
                    return Response({
                        'message': 'Booking approved but email sending failed',
                        'error': str(e)
                    }, status=status.HTTP_200_OK)
                serializer.save()
                return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Booking.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Unexpected error in update_booking: {str(e)}")
        return Response({
            'error': 'An unexpected error occurred',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
def delete_booking(request, pk):
    try:
        booking = Booking.objects.get(pk=pk)
        booking.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Booking.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

# Item CRUD views
@api_view(['GET'])
def list_items(request):
    items = Item.objects.all()
    serializer = ItemSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_item(request):
    logger.info(f"Request method: {request.method}")
    logger.info(f"Request data: {request.data}")
    
    serializer = ItemSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    logger.error(f"Serializer errors: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_item(request, pk):
    try:
        item = Item.objects.get(pk=pk)
        serializer = ItemSerializer(item)
        return Response(serializer.data)
    except Item.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT', 'POST'])
def update_item(request, pk):
    try:
        item = Item.objects.get(pk=pk)
    except Item.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = ItemSerializer(item, data=request.data, partial=True)
    if serializer.is_valid():
        # Handle image update
        if 'image' in request.FILES:
            # Delete old image if exists
            if item.image and item.image.path and os.path.isfile(item.image.path):
                os.remove(item.image.path)
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_item(request, pk):
    try:
        item = Item.objects.get(pk=pk)
        # Delete image file if exists
        if item.image and item.image.path and os.path.isfile(item.image.path):
            os.remove(item.image.path)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Item.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Service CRUD views
from rest_framework.parsers import MultiPartParser, FormParser

@api_view(['GET'])
def list_services(request):
    try:
        services = Service.objects.all()
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error in list_services: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def create_service(request):
    serializer = ServiceSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    # Add this line to log the errors
    logger.error(f"ServiceSerializer errors: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_service(request, pk):
    try:
        service = Service.objects.get(pk=pk)
        serializer = ServiceSerializer(service)
        return Response(serializer.data)
    except Service.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT', 'POST'])
def update_service(request, pk):
    try:
        service = Service.objects.get(pk=pk)
    except Service.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = ServiceSerializer(service, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_service(request, pk):
    try:
        service = Service.objects.get(pk=pk)
        service.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Service.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Gallery CRUD views

@api_view(['GET'])
def list_gallery_photos(request):
    photos = GalleryPhoto.objects.all().order_by('-uploaded_at')
    serializer = GalleryPhotoSerializer(photos, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_gallery_photo(request):
    serializer = GalleryPhotoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_gallery_photo(request, pk):
    try:
        photo = GalleryPhoto.objects.get(pk=pk)
        if photo.image and photo.image.path and os.path.isfile(photo.image.path):
            os.remove(photo.image.path)
        photo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except GalleryPhoto.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Post CRUD views
@api_view(['GET'])
def list_posts(request):
    posts = Post.objects.all().order_by('-created_at')
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_post(request):
    serializer = PostSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_post(request, pk):
    try:
        post = Post.objects.get(pk=pk)
        serializer = PostSerializer(post)
        return Response(serializer.data)
    except Post.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT', 'POST'])
def update_post(request, pk):
    try:
        post = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = PostSerializer(post, data=request.data, partial=True)
    if serializer.is_valid():
        # Handle image update
        if 'post_image' in request.FILES:
            # Delete old image if exists
            if post.post_image and post.post_image.path and os.path.isfile(post.post_image.path):
                os.remove(post.post_image.path)
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_post(request, pk):
    try:
        post = Post.objects.get(pk=pk)
        # Delete image file if exists
        if post.post_image and post.post_image.path and os.path.isfile(post.post_image.path):
            os.remove(post.post_image.path)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Post.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['GET'])
def list_contacts(request):
    # Fetch the most recent contact entry
    contact = Contact.objects.last()
    if not contact:
        # Return a 404 if no contact info has been saved yet
        return Response({'error': 'No contact information found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Serialize the single contact object
    serializer = ContactSerializer(contact)
    return Response(serializer.data)

@api_view(['POST'])
def create_contact(request):
    # Find the first contact object, or create a new one if it doesn't exist
    contact, created = Contact.objects.get_or_create(pk=1)
    
    # Update the contact object with the new data
    serializer = ContactSerializer(contact, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_contact(request, pk):
    try:
        contact = Contact.objects.get(pk=pk)
    except Contact.DoesNotExist:
        return Response({'error':'Contact not found'},status=status.HTTP_404_NOT_FOUND)
    
    serializer = ContactSerializer(contact)
    return Response(serializer.data)

@api_view(['PUT', 'PATCH', 'POST'])
def update_contact(request,pk):
    try:
        contact = Contact.objects.get(pk=pk)
    except Contact.DoesNotExist:
        return Response({'error':'Contact not found'},status=status.HTTP_404_NOT_FOUND)
    
    serializer = ContactSerializer(contact,data=request.data, partial=(request.method == 'PATCH'))
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_contact(request,pk):
    try:
        contact = Contact.objects.get(pk=pk)
    except Contact.DoesNotExist:
        return Response({'error':'Contact not found'}, status=status.HTTP_404_NOT_FOUND)
    
    contact.delete()
    return Response({'message':'Contact delete successfully'}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def get_latest_social_links(request):
    latest = Contact.objects.order_by('-id').first()
    if latest:
        return Response({
            "facebook_link": latest.facebook_link,
            "whatsapp_link": latest.whatsapp_link,
            "instagram_link": latest.instagram_link,
        })
    else:
        return Response({
            "facebook_link": "",
            "whatsapp_link": "",
            "instagram_link": "",
        })

