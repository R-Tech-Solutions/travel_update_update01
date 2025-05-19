from django.db import models

# Create your models here.
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
    tour_itinerary = models.CharField(max_length=200)
    include = models.CharField(max_length=200)
    exclude = models.CharField(max_length=200)
    main_image = models.JSONField(default=dict, blank=True , null=True)  # Example: {"url": "images/sigiriya.jpg"}
    sub_images = models.JSONField(default=list, blank=True , null=True)
    
    
    place_type = models.CharField(max_length=50, choices=place_type, default= 'trending')

    def __str__(self):
        return self.title