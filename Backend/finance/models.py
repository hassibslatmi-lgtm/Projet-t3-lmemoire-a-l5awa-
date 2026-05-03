from django.db import models
from users.models import Farmer, Buyer

class Expense(models.Model):
    CATEGORY_CHOICES = [
        ('inputs', 'Inputs (Seeds/Fertilizers)'),
        ('utilities', 'Utilities (Water/Electricity)'),
        ('labor', 'Labor'),
        ('logistics', 'Logistics'),
    ]

    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE, related_name='expenses')
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateField()
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.amount} DZD"

class BuyerStock(models.Model):
    buyer = models.ForeignKey(Buyer, on_delete=models.CASCADE, related_name='stock_items')
    farmer = models.ForeignKey(Farmer, on_delete=models.SET_NULL, null=True, blank=True, related_name='buyer_stock_sourced')
    product_name = models.CharField(max_length=255)
    quantity = models.FloatField()
    buy_price = models.DecimalField(max_digits=12, decimal_places=2)
    sell_price = models.DecimalField(max_digits=12, decimal_places=2)
    last_updated = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product_name} - {self.quantity} units"
