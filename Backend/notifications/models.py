from django.db import models
from django.conf import settings

class Notification(models.Model):
    # المستخدم اللي يلحقوا التنبيه
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    # المستخدم اللي تسبب في التنبيه (اختياري)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    # نص التنبيه
    verb = models.CharField(max_length=255)
    # نربطوها بالطلب باش كي يكليكي المستخدم يروح ليه ديريكت
    order_id = models.IntegerField(null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at'] # التنبيهات الجديدة تظهر هي الأولى

    def __str__(self):
        return f"Notification for {self.recipient.username}: {self.verb}"