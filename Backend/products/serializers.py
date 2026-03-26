from rest_framework import serializers
from .models import Category, Product

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'image', 'created_at']

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    farmer_name = serializers.ReadOnlyField(source='farmer.full_name')

    class Meta:
        model = Product
        fields = ['id', 'farmer', 'farmer_name', 'category', 'category_name', 'name', 'description', 'quantity', 'image', 'created_at']
        read_only_fields = ['farmer']