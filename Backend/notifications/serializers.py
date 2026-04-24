from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    time_ago = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ['id', 'verb', 'order_id', 'is_read', 'created_at', 'time_ago']

    def get_time_ago(self, obj):
        # اختياري: تقدر تستعمل مكتبة humanize باش تخرج "منذ 5 دقائق"
        return obj.created_at.strftime("%Y-%m-%d %H:%M")