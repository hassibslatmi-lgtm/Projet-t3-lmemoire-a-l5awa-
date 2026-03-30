from django.db import models
from django.conf import settings
from products.models import Product

class Order(models.Model):
    # الدفع إلكتروني فقط
    payment_method = models.CharField(max_length=20, default='online')
    
    STATUS_CHOICES = (
        ('pending', 'قيد الانتظار'),
        ('paid', 'تم الدفع'),
        ('processing', 'قيد التحضير'),
        ('shipped', 'تم الشحن'),
        ('delivered', 'تم الاستلام'),
        ('cancelled', 'ملغى'),
    )

    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders_made')
    farmer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders_received')
    
    shipping_address = models.TextField()
    phone_number = models.CharField(max_length=20)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    is_paid = models.BooleanField(default=False)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    chargily_invoice_id = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)