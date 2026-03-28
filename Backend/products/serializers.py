from rest_framework import serializers
from .models import Category, Product, OfficialPrice

class CategorySerializer(serializers.ModelSerializer):
    # نرجعوه ImageField عادي باش يقبل الـ Upload
    # وفي نفس الوقت Django REST راح يرجع الرابط الكامل وحده
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'image', 'created_at']

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    farmer_name = serializers.ReadOnlyField(source='farmer.full_name')
    # نفس الشيء للمنتجات
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Product
        fields = [
            'id', 'farmer', 'farmer_name', 'category', 'category_name', 
            'name', 'description', 'quantity', 'image', 'created_at'
        ]
        read_only_fields = ['farmer']
# serializers.py
class OfficialPriceSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = OfficialPrice
        fields = ['id', 'product_name', 'price', 'image', 'date_set']