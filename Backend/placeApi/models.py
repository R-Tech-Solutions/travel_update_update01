from django.db import models
from django.contrib.auth.models import User
import os
from cloudinary.models import CloudinaryField
import cloudinary.uploader

def delete_cloudinary_file(cloudinary_field):
    """Helper function to delete a file from Cloudinary"""
    if cloudinary_field:
        try:
            # Extract the public_id from the Cloudinary field
            if hasattr(cloudinary_field, 'public_id'):
                public_id = cloudinary_field.public_id
                # Delete the file from Cloudinary
                result = cloudinary.uploader.destroy(public_id)
                return result.get('result') == 'ok'
        except Exception as e:
            return False
    return False

class Place(models.Model):
    place_type = [
        ('trending', 'Trending Places'),
        ('five_day', '5 Days Package'),
        ('seven_days', '7 Days Package'),
        ('eight_days', '8 Days Package'),
        ('ten_days', '10 Days Package'),
        ('fourteen_days', '14 Days Pakage'),
        ('eighteen_dyas', '18 Days Pakage'),

    ]
    
    title = models.CharField(blank=True, default='')
    subtitle = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    about_place = models.TextField()
    tour_highlights = models.TextField(blank=True, default='')
    include = models.TextField(blank=True, default='')
    exclude = models.TextField(blank=True, default='')
    price_title = models.CharField(blank=True, default='')
    main_image = CloudinaryField(null=True, blank=True, max_length=255)
    place_type = models.CharField(max_length=50, choices=place_type, default='trending')
    package_title = models.CharField(blank=True, default='')

    def __str__(self):
        return self.title

    def delete(self, *args, **kwargs):
        # Delete main image from Cloudinary
        if self.main_image:
            delete_cloudinary_file(self.main_image)
        for sub_image in self.sub_images.all():
            sub_image.delete()
        super().delete(*args, **kwargs)

    def update_main_image(self, new_image):
        """Update main image and delete old one from Cloudinary"""
        if self.main_image:
            delete_cloudinary_file(self.main_image)
        self.main_image = new_image
        self.save()

    def update_sub_images(self, new_images):
        """Update sub images and delete old ones from Cloudinary"""
        # Delete old sub images from Cloudinary
        for img in self.sub_images.all():
            if img.image:
                delete_cloudinary_file(img.image)
            img.delete()
        # Create new sub images
        for img in new_images:
            PlaceImage.objects.create(place=self, image=img)

class PlaceImage(models.Model):
    place = models.ForeignKey(Place, related_name='sub_images', on_delete=models.CASCADE)
    image = CloudinaryField(null=True, blank=True, max_length=255)

    def delete(self, *args, **kwargs):
        # Delete image from Cloudinary
        if self.image:
            delete_cloudinary_file(self.image)
        super().delete(*args, **kwargs)

    def update_image(self, new_image):
        """Update image and delete old one from Cloudinary"""
        if self.image:
            delete_cloudinary_file(self.image)
        self.image = new_image
        self.save()

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
    image = CloudinaryField(null=True, blank=True, max_length=255)

    def delete(self, *args, **kwargs):
        # Delete image from Cloudinary
        if self.image:
            delete_cloudinary_file(self.image)
        super().delete(*args, **kwargs)

    def update_image(self, new_image):
        """Update image and delete old one from Cloudinary"""
        if self.image:
            delete_cloudinary_file(self.image)
        self.image = new_image
        self.save()


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
    image = CloudinaryField(null=True, blank=True, max_length=255)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    def delete(self, *args, **kwargs):
        # Delete image from Cloudinary
        if self.image:
            delete_cloudinary_file(self.image)
        super().delete(*args, **kwargs)

    def update_image(self, new_image):
        """Update image and delete old one from Cloudinary"""
        if self.image:
            delete_cloudinary_file(self.image)
        self.image = new_image
        self.save()

class Service(models.Model):
    service_title = models.CharField(max_length=255)
    service_description = models.TextField()
    image = CloudinaryField(null=True, blank=True, max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.service_title

    def delete(self, *args, **kwargs):
        # Delete image from Cloudinary
        if self.image:
            delete_cloudinary_file(self.image)
        super().delete(*args, **kwargs)

    def update_image(self, new_image):
        """Update image and delete old one from Cloudinary"""
        if self.image:
            delete_cloudinary_file(self.image)
        self.image = new_image
        self.save()

class GalleryPhoto(models.Model):
    image = CloudinaryField(null=True, blank=True, max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Gallery Photo {self.id}"
    
    def delete(self, *args, **kwargs):
        # Delete image from Cloudinary
        if self.image:
            delete_cloudinary_file(self.image)
        super().delete(*args, **kwargs)

    def update_image(self, new_image):
        """Update image and delete old one from Cloudinary"""
        if self.image:
            delete_cloudinary_file(self.image)
        self.image = new_image
        self.save()

class Post(models.Model):
    post_title = models.CharField(max_length=255)
    post_content = models.TextField()
    post_image = CloudinaryField(null=True, blank=True, max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self) -> str:
        return self.post_title
    
    def delete(self, *args, **kwargs):
        # Delete image from Cloudinary
        if self.post_image:
            delete_cloudinary_file(self.post_image)
        super().delete(*args, **kwargs)

    def update_image(self, new_image):
        """Update image and delete old one from Cloudinary"""
        if self.post_image:
            delete_cloudinary_file(self.post_image)
        self.post_image = new_image
        self.save()

class Contact(models.Model):
    contact_number = models.CharField(max_length=20)
    instagram_link = models.URLField(max_length=200)
    facebook_link = models.URLField(max_length=200)
    whatsapp_link = models.URLField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.contact_number


class Front(models.Model):
    company_logo = CloudinaryField(null=True, blank=True, max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Company Logo {self.id}"

    def delete(self, *args, **kwargs):
        # Delete image from Cloudinary
        if self.company_logo:
            delete_cloudinary_file(self.company_logo)
        super().delete(*args, **kwargs)

    def update_logo(self, new_logo):
        """Update company logo and delete old one from Cloudinary"""
        if self.company_logo:
            delete_cloudinary_file(self.company_logo)
        self.company_logo = new_logo
        self.save()



