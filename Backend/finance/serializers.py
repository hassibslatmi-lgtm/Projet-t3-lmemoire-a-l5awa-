from rest_framework import serializers
from .models import Expense, BuyerStock

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ['id', 'farmer', 'title', 'category', 'amount', 'date', 'description', 'created_at']
        read_only_fields = ['farmer', 'created_at']

class BuyerStockSerializer(serializers.ModelSerializer):
    farmer_name = serializers.ReadOnlyField(source='farmer.user.full_name')
    
    class Meta:
        model = BuyerStock
        fields = ['id', 'buyer', 'farmer', 'farmer_name', 'product_name', 'quantity', 'buy_price', 'sell_price', 'last_updated', 'created_at']
        read_only_fields = ['buyer', 'last_updated', 'created_at']
