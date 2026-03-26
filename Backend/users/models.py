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

    # الحقول الجديدة والمعدلة
    full_name = models.CharField(max_length=255, null=True, blank=True)
    sex = models.CharField(max_length=1, choices=SEX_CHOICES, null=True, blank=True)
    email = models.EmailField(unique=True) # إيميل واحد فقط لكل النظام
    
    phone = models.CharField(max_length=15, unique=True, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    
    status = models.CharField(max_length=20, default='pending') 
    is_active = models.BooleanField(default=True) 
    rejection_reason = models.TextField(null=True, blank=True) 
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name if self.full_name else self.username} ({self.role})"


# جدول بيانات الفلاح (Farmer)
class Farmer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    farmer_card = models.CharField(max_length=50, unique=True)
    farm_location = models.CharField(max_length=255)
    farm_area = models.FloatField(help_text="المساحة بالهكتار")

# جدول بيانات المشتري (Buyer)
class Buyer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    business_name = models.CharField(max_length=255, null=True, blank=True)
    registre_commerce = models.CharField(max_length=50, unique=True, null=True, blank=True)

# جدول بيانات الناقل (Transporter)
class Transporter(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    driver_license_number = models.CharField(max_length=50, unique=True)
    license_type = models.CharField(max_length=20)
    license_expiry_date = models.DateField(null=True, blank=True)
    vehicle_name = models.CharField(max_length=100)
    vehicle_year = models.IntegerField(null=True, blank=True)