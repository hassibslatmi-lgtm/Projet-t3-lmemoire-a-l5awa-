from rest_framework import serializers
from .models import User, Farmer, Buyer, Transporter

class UserSerializer(serializers.ModelSerializer):
    extra_data = serializers.JSONField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'full_name', 'sex', 'role', 'phone', 'address', 'status', 'extra_data']
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
                Transporter.objects.create(user=user, **extra_data)
        except Exception as e:
            user.delete() 
            raise serializers.ValidationError({"error": f"بيانات الدور غير صحيحة: {str(e)}"})
        
        return user