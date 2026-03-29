from rest_framework import serializers
from .models import User, Farmer, Buyer, Transporter
from django.conf import settings

class FarmerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Farmer
        fields = '__all__'

class BuyerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Buyer
        fields = '__all__'

class TransporterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transporter
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    farmer = FarmerSerializer(read_only=True)
    buyer = BuyerSerializer(read_only=True)
    transporter = TransporterSerializer(read_only=True)
    extra_data = serializers.JSONField(write_only=True, required=False)
    
    # حقل رابط الصورة
    profile_photo_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'password', 'email', 'full_name', 'sex', 
            'role', 'phone', 'address', 'status', 'created_at',
            'farmer', 'buyer', 'transporter', 'extra_data', 'profile_photo', 'profile_photo_url'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True}
        }

    def get_profile_photo_url(self, obj):
        request = self.context.get('request')
        if obj.profile_photo:
            return request.build_absolute_uri(obj.profile_photo.url)
        
        # إذا حبيت تستعمل الأيقونة اللي حطيتها في الميديا (default_user.png)
        # تقدر تستعمل السطرين اللي تحت، وإذا حبيت ui-avatars خليها كيما راهي
        name = obj.full_name or obj.username
        return f"https://ui-avatars.com/api/?name={name}&background=random&size=128"

    def validate_email(self, value):
        user_id = self.instance.id if self.instance else None
        if User.objects.filter(email=value).exclude(id=user_id).exists():
            raise serializers.ValidationError("هذا البريد الإلكتروني مسجل مسبقاً.")
        return value

    def create(self, validated_data):
        extra_data = validated_data.pop('extra_data', {})
        password = validated_data.pop('password', None)
        user = User.objects.create(**validated_data)
        if password:
            user.set_password(password)
        user.save()

        role = validated_data.get('role')
        try:
            if role == 'farmer':
                Farmer.objects.create(user=user, **extra_data)
            elif role == 'buyer':
                Buyer.objects.create(user=user, **extra_data)
            elif role == 'transporter':
                Transporter.objects.create(
                    user=user,
                    driver_license_number=extra_data.get('driver_license') or extra_data.get('driver_license_number'),
                    license_type=extra_data.get('license_type', 'Other'),
                    vehicle_name=extra_data.get('vehicle_name', 'N/A'),
                    vehicle_year=extra_data.get('vehicle_year', 2024)
                )
        except Exception as e:
            user.delete() 
            raise serializers.ValidationError({"error": f"بيانات الدور غير صحيحة: {str(e)}"})
        return user

    def update(self, instance, validated_data):
        # 1. استخراج بيانات الدور الإضافية إن وجدت
        extra_data = validated_data.pop('extra_data', {})

        # 2. تحديث بيانات المستخدم (User)
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # 3. تحديث بيانات الدور (Farmer/Buyer/Transporter) أوتوماتيكياً
        role_instance = None
        if instance.role == 'farmer' and hasattr(instance, 'farmer'):
            role_instance = instance.farmer
        elif instance.role == 'buyer' and hasattr(instance, 'buyer'):
            role_instance = instance.buyer
        elif instance.role == 'transporter' and hasattr(instance, 'transporter'):
            role_instance = instance.transporter

        if role_instance and extra_data:
            for attr, value in extra_data.items():
                if hasattr(role_instance, attr): # للتأكد أن الحقل موجود في الموديل
                    setattr(role_instance, attr, value)
            role_instance.save()

        return instance