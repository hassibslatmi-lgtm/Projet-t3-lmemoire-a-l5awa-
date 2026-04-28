from django.db import models
from django.conf import settings

class Animal(models.Model):
    SPECIES_CHOICES = [
        ('Cow', 'Cow'),
        ('Sheep', 'Sheep'),
        ('Goat', 'Goat'),
    ]

    rfid_tag = models.CharField(max_length=100, unique=True)
    internal_id = models.CharField(max_length=100)
    species = models.CharField(max_length=10, choices=SPECIES_CHOICES)
    breed = models.CharField(max_length=100)
    birth_date = models.DateField()
    
    # Tracking
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    region = models.CharField(max_length=100, default='Unknown', help_text="Wilaya")
    location_name = models.CharField(max_length=255, null=True, blank=True, help_text="Detailed address (City, Wilaya)")
    
    # Verification & Security
    is_verified = models.BooleanField(default=False)
    suspicious_movement = models.BooleanField(default=False)
    
    farmer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='animals')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.species} - {self.internal_id} ({self.rfid_tag})"
