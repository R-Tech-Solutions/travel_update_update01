from django.db import models
import os

class Place(models.Model):
    
    place_type = [
        ('trending', 'Trending Places'),
        ('adventure', 'Adventure Places'),
        ('honeymoon', 'Honeymoon Places'),
        ('beach', 'Beach Places'),
        ('historical', 'Historical Places'),

    ]
    title = models.CharField(max_length=50)
    subtitle = models.CharField(max_length=200)
    price = models.DecimalField (max_digits=10, decimal_places=2)
    about_place = models.TextField()
    tour_highlights = models.CharField(max_length=200)
    # tour_itinerary = models.CharField(max_length=200)
    include = models.CharField(max_length=200)
    exclude = models.CharField(max_length=200)
    main_image = models.ImageField(upload_to='places/main_images/', null=True, blank=True, max_length=255)  # Example: {"url": "images/sigiriya.jpg"}
    # Remove sub_images JSONField if present
    place_type = models.CharField(max_length=50, choices=place_type, default= 'trending')

    def __str__(self):
        return self.title

    def delete(self, *args, **kwargs):
        # Delete main image file
        if self.main_image and self.main_image.path and os.path.isfile(self.main_image.path):
            os.remove(self.main_image.path)
        # Delete all related sub images (this will call PlaceImage.delete)
        for sub_image in self.sub_images.all():
            sub_image.delete()
        super().delete(*args, **kwargs)

class PlaceImage(models.Model):
    place = models.ForeignKey(Place, related_name='sub_images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='places/sub_images/', null=True, blank=True, max_length=255)

    def delete(self, *args, **kwargs):
        # Delete image file
        if self.image and self.image.path and os.path.isfile(self.image.path):
            os.remove(self.image.path)
        super().delete(*args, **kwargs)