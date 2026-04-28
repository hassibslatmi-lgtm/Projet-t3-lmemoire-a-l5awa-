from rest_framework import serializers
from .models import Animal

class AnimalSerializer(serializers.ModelSerializer):
    farmer_name = serializers.ReadOnlyField(source='farmer.full_name')

    class Meta:
        model = Animal
        fields = [
            'id', 'rfid_tag', 'internal_id', 'species', 
            'breed', 'birth_date', 'latitude', 'longitude', 
            'region', 'is_verified', 'suspicious_movement',
            'farmer', 'farmer_name', 'created_at', 'updated_at'
        ]
        read_only_fields = ['farmer', 'is_verified', 'suspicious_movement', 'created_at', 'updated_at']
