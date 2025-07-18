from django.db import models
from django.contrib.auth.models import User
import os

class Place(models.Model):
    place_type = [
        ('trending', 'Trending Places'),
        ('five_day', '5 Days Package'),
        ('ten_day', '10 Days Package'),
        ('fifteen_day', '15 Days Package'),
        ('twenty_day', '20 Days Package'),
        ('twentyfive_day', '25 Days Package'),

    ]
    
    title = models.CharField(max_length=50)
    subtitle = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    about_place = models.TextField()
    tour_highlights = models.CharField(max_length=200)
    include = models.CharField(max_length=200)
    exclude = models.CharField(max_length=200)
    price_title = models.CharField(max_length=100, null=False, blank=True, default="")
    main_image = models.ImageField(upload_to='places/main_images/', null=True, blank=True, max_length=255)
    place_type = models.CharField(max_length=50, choices=place_type, default='trending')
    package_title = models.CharField(max_length=200, null=False, blank=True, default="")

    def __str__(self):
        return self.title

    def delete(self, *args, **kwargs):
        if self.main_image and self.main_image.path and os.path.isfile(self.main_image.path):
            os.remove(self.main_image.path)
        for sub_image in self.sub_images.all():
            sub_image.delete()
        super().delete(*args, **kwargs)

class PlaceImage(models.Model):
    place = models.ForeignKey(Place, related_name='sub_images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='places/sub_images/', null=True, blank=True, max_length=255)

    def delete(self, *args, **kwargs):
        if self.image and self.image.path and os.path.isfile(self.image.path):
            os.remove(self.image.path)
        super().delete(*args, **kwargs)

class ItineraryDay(models.Model):
    place = models.ForeignKey(Place, related_name='itinerary_days', on_delete=models.CASCADE)
    day = models.PositiveIntegerField()
    sub_iterative_description = models.CharField(max_length=200, blank=True, default='')
    sub_description = models.TextField(blank=True, default='')

    class Meta:
        ordering = ['day']

    def __str__(self):
        return f"Day {self.day} - {self.place.title}"

class ItineraryPhoto(models.Model):
    itinerary_day = models.ForeignKey(ItineraryDay, related_name='photos', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='places/itinerary_photos/', null=True, blank=True, max_length=255)

    def delete(self, *args, **kwargs):
        if self.image and self.image.path and os.path.isfile(self.image.path):
            os.remove(self.image.path)
        super().delete(*args, **kwargs)


# new booking model

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    user_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    place = models.ForeignKey(Place, on_delete=models.CASCADE, related_name='bookings')
    arrival_date = models.DateField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    adults = models.PositiveIntegerField(default=1)
    children = models.PositiveIntegerField(default=0)
    children_ages = models.JSONField(blank=True, null=True, default=list)
    description = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'pending'),
            ('approved', 'approved'),
            ('cancelled', 'Cancelled')
        ],
        default='pending'
    )
    def __str__(self):
        return f"Booking by {self.user_name} for {self.place.title} on {self.arrival_date}"

    class Meta:
        ordering = ['arrival_date']


class Item(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='items/images/', null=True, blank=True, max_length=255)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Service(models.Model):
    service_title = models.CharField(max_length=255)
    service_description = models.TextField()
    image_url = models.ImageField(upload_to='services/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.service_title

class GalleryPhoto(models.Model):
    image = models.ImageField(upload_to='gallery/photos/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Gallery Photo {self.id}"
    
class Post(models.Model):
    post_title = models.CharField(max_length=255)
    post_content = models.TextField()
    post_image = models.ImageField(upload_to='post_images/')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.post_title
    
class Contact(models.Model):
    contact_number = models.CharField(max_length=20)
    instagram_link = models.URLField(max_length=200)
    facebook_link = models.URLField(max_length=200)
    whatsapp_link = models.URLField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.contact_number





