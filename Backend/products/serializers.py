from rest_framework import serializers
from .models import Category, Product, OfficialPrice, PriceHistory, ProductReview

class CategorySerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True)
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'image', 'created_at']
class PriceHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceHistory
        fields = ['price', 'changed_at']
class OfficialPriceSerializer(serializers.ModelSerializer):
    history = PriceHistorySerializer(many=True, read_only=True)
    class Meta:
        model = OfficialPrice
        fields = ['id', 'product_name', 'price', 'image', 'date_set', 'created_at', 'history']

class ProductReviewSerializer(serializers.ModelSerializer):
    buyer_name = serializers.ReadOnlyField(source='buyer.full_name')

    class Meta:
        model = ProductReview
        fields = ['id', 'buyer', 'buyer_name', 'product', 'rating', 'comment', 'created_at']
        read_only_fields = ['buyer', 'product']

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    farmer_name = serializers.ReadOnlyField(source='farmer.full_name')
    image = serializers.ImageField(required=False, allow_null=True)
    
    # حقل إضافي لجلب السعر الرسمي آلياً من جدول OfficialPrice
    official_price = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()
    
    reviews = ProductReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'farmer', 'farmer_name', 'category', 'category_name', 
            'name', 'description', 'quantity', 'image', 'official_price', 'price', 'reviews', 'created_at'
        ]
        read_only_fields = ['farmer']

    def get_official_price(self, obj):
        # البحث عن السعر بناءً على اسم المنتج
        price_entry = OfficialPrice.objects.filter(product_name=obj.name).first()
        return float(price_entry.price) if price_entry else 0

    def get_price(self, obj):
        return self.get_official_price(obj)