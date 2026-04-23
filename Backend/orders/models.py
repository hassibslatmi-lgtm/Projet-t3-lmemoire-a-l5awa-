from django.db import models
from django.conf import settings


class Order(models.Model):
    STATUS_CHOICES = (
        ('paid', 'مدفوع - جاهز للنقل'), 
        ('processing', 'قيد التحضير'),
        ('shipped', 'تم الشحن'),
        ('delivered', 'تم الاستلام'),
        ('cancelled', 'ملغى'),
    )

    payment_method = models.CharField(max_length=20, default='online')
    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders_made')
    farmer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders_received')
    
    # (Transporter)
    transporter = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='deliveries'
    )
    
    pickup_address = models.TextField(null=True, blank=True)
    shipping_address = models.TextField() 
    phone_number = models.CharField(max_length=20)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='paid')
    is_paid = models.BooleanField(default=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    chargily_invoice_id = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.status}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product.name} (x{self.quantity}) in Order #{self.order.id}"