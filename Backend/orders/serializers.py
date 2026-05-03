from rest_framework import serializers
from .models import Order, OrderItem

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
    farmer_address = serializers.ReadOnlyField(source='farmer.farm_location')
    
    transporter_name = serializers.ReadOnlyField(source='transporter.full_name')
    transporter_phone = serializers.ReadOnlyField(source='transporter.phone')
    vehicle_name = serializers.ReadOnlyField(source='transporter.transporter.vehicle_name')
    
    quantity = serializers.SerializerMethodField()
    product_name = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'buyer', 'buyer_name', 'farmer', 'farmer_name', 'farmer_phone',
            'farmer_address', 'transporter', 'transporter_name', 'transporter_phone', 'vehicle_name',
            'pickup_address', 'shipping_address', 'phone_number', 
            'status', 'is_paid', 'total_amount', 'items', 'created_at', 'quantity', 'product_name'
        ]

    def get_quantity(self, obj):
        return sum(item.quantity for item in obj.items.all())

    def get_product_name(self, obj):
        first_item = obj.items.first()
        if first_item:
            return first_item.product.name
        return "Unknown Product"