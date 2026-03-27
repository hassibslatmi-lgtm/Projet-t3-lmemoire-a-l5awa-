from rest_framework import serializers
from .models import User, Farmer, Buyer, Transporter

# 1. نزيدو هاد الـ Serializers الصغار باش نبعثو البيانات المنظمة
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
    # 2. نربطو الـ Roles بالـ User (هذا هو الـ Link الحقيقي للـ Front)
    farmer = FarmerSerializer(read_only=True)
    buyer = BuyerSerializer(read_only=True)
    transporter = TransporterSerializer(read_only=True)
    
    extra_data = serializers.JSONField(write_only=True, required=False)

    class Meta:
        model = User
        # 3. نزيدو الحقول الجديدة في الـ fields
        fields = [
            'id', 'username', 'password', 'email', 'full_name', 'sex', 
            'role', 'phone', 'address', 'status', 'created_at',
            'farmer', 'buyer', 'transporter', 'extra_data'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True}
        }

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("هذا البريد الإلكتروني مسجل مسبقاً في النظام.")
        return value

    def create(self, validated_data):
        extra_data = validated_data.pop('extra_data', {})
        password = validated_data.pop('password')
        
        user = User.objects.create(**validated_data)
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