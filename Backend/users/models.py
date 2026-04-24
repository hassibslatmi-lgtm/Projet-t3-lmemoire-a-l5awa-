from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('farmer', 'Farmer'), 
        ('buyer', 'Buyer'),
        ('transporter', 'Transporter'), 
        ('ministry', 'Ministry'),
    )
    
    SEX_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
    )

    full_name = models.CharField(max_length=255, null=True, blank=True)
    sex = models.CharField(max_length=1, choices=SEX_CHOICES, null=True, blank=True)
    email = models.EmailField(unique=True) # email as unique identifier
    
    phone = models.CharField(max_length=15, unique=True, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    
    status = models.CharField(max_length=20, default='pending') 
    is_active = models.BooleanField(default=True) 
    rejection_reason = models.TextField(null=True, blank=True) 
    created_at = models.DateTimeField(auto_now_add=True)
    expo_push_token = models.CharField(max_length=255, null=True, blank=True)
    profile_photo = models.ImageField(upload_to='profile_photos/', null=True, blank=True)
    @property
    def get_photo_url(self):
        if self.profile_photo and hasattr(self.profile_photo, 'url'):
            return self.profile_photo.url

        return "/static/images/default-avatar.png"
    def __str__(self):
        return f"{self.full_name if self.full_name else self.username} ({self.role})"



class Farmer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    farmer_card = models.CharField(max_length=50, unique=True)
    farm_location = models.CharField(max_length=255)
    farm_area = models.FloatField(help_text="المساحة بالهكتار")


class Buyer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    business_name = models.CharField(max_length=255, null=True, blank=True)
    registre_commerce = models.CharField(max_length=50, unique=True, null=True, blank=True)


class Transporter(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    driver_license_number = models.CharField(max_length=50, unique=True)
    license_type = models.CharField(max_length=20)
    license_expiry_date = models.DateField(null=True, blank=True)
    vehicle_name = models.CharField(max_length=100)
    vehicle_year = models.IntegerField(null=True, blank=True)

