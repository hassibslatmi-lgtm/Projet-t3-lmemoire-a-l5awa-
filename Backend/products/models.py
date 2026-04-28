from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

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


# ... (Category and Product models stay the same)

class OfficialPrice(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='official_prices', null=True, blank=True)
    product_name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='official_prices/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True) 
    date_set = models.DateTimeField(auto_now=True) 

    class Meta:
        ordering = ['-date_set']

    def __str__(self):
        return f"{self.product_name} - {self.price} DA"

   
    def save(self, *args, **kwargs):  #hadi la function hia li tkhalina n7afdou 3la price history
        is_new = self.pk is None
        # نحفظ السعر الحالي أولاً
        super().save(*args, **kwargs)
        
        # بعد الحفظ، ننشئ سجلاً في تاريخ الأسعار
        PriceHistory.objects.create(
            official_price=self,
            price=self.price
        )

class PriceHistory(models.Model):
    # ربط التاريخ بموديل OfficialPrice
    official_price = models.ForeignKey(OfficialPrice, related_name='history', on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    changed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-changed_at'] # الجديد يظهر فوق في الـ Timeline

    def __str__(self):
        return f"{self.official_price.product_name}: {self.price} at {self.changed_at}"

class ProductReview(models.Model):
    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('buyer', 'product')
        ordering = ['-created_at']

    def __str__(self):
        return f"Review by {self.buyer.username} for {self.product.name}"