from rest_framework import serializers
from .models import Category, Product

class CategorySerializer(serializers.ModelSerializer):
    # نستخدم SerializerMethodField باش نتحكمو في رابط الصورة
    image = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'image', 'created_at']

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image:
            # إذا كان كاين request، يرجع الرابط الكامل (http://...)
            if request:
                return request.build_absolute_uri(obj.image.url)
            # إذا ماكانش (مثلاً في الـ Terminal)، يرجع المسار العادي
            return obj.image.url
        return None

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    farmer_name = serializers.ReadOnlyField(source='farmer.full_name')
    # نفس الشيء بالنسبة للـ Product
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'farmer', 'farmer_name', 'category', 'category_name', 
            'name', 'description', 'quantity', 'image', 'created_at'
        ]
        read_only_fields = ['farmer']

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image:
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None