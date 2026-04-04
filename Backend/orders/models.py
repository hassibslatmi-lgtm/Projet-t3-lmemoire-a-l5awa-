from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    product_image = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_image', 'quantity', 'price_at_purchase']

    def get_product_image(self, obj):
        if obj.product.image:
            return obj.product.image.url
        return None

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    buyer_name = serializers.ReadOnlyField(source='buyer.full_name')
    farmer_name = serializers.ReadOnlyField(source='farmer.full_name')
    farmer_phone = serializers.ReadOnlyField(source='farmer.phone')
    
    # هنا "المفتاح": نجبدو الموقع من البروفايل تاع الفلاح
    # تأكد أن اسم الحقل في موديل User هو 'farm_location'
    farmer_address = serializers.ReadOnlyField(source='farmer.farm_location')

    class Meta:
        model = Order
        fields = [
            'id', 'buyer', 'buyer_name', 'farmer', 'farmer_name', 'farmer_phone',
            'farmer_address', 'shipping_address', 'phone_number', 
            'status', 'is_paid', 'total_amount', 'items', 'created_at'
        ]