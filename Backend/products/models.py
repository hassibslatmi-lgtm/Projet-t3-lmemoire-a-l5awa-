from django.db import models
from django.conf import settings

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(null=True, blank=True)
    image = models.ImageField(upload_to='categories/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    farmer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='products')
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    name = models.CharField(max_length=255)
    description = models.TextField()
    quantity = models.FloatField() 
    image = models.ImageField(upload_to='products/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.farmer.username}"

# --- التعديل هنا في OfficialPrice ---
class OfficialPrice(models.Model):
    product_name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='official_prices/', null=True, blank=True)
    
    # auto_now_add: يسجل تاريخ أول مرة درت فيها Add فقط
    created_at = models.DateTimeField(auto_now_add=True) 
    
    # auto_now: يتحدث أوتوماتيكياً في كل مرة تدير Update (save)
    date_set = models.DateTimeField(auto_now=True) 

    class Meta:
        ordering = ['-date_set'] # باش يخرج الجديد (المحدث) هو الأول

    def __str__(self):
        return f"{self.product_name} - {self.price}"