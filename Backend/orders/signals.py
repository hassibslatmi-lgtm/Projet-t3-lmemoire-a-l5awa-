from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order
from notifications.models import Notification

@receiver(post_save, sender=Order)
def order_status_notifications(sender, instance, created, **kwargs):
    if created:
        # المشتري دار طلب -> نبعث للفلاح
        Notification.objects.create(
            recipient=instance.farmer,
            sender=instance.buyer,
            verb=f"لديك طلب جديد #{instance.id} من {instance.buyer.full_name}",
            order_id=instance.id
        )
    else:
        # إذا تغيرت الحالة لـ 'shipped' -> نبعث للمشتري
        if instance.status == 'shipped':
            Notification.objects.create(
                recipient=instance.buyer,
                sender=instance.transporter,
                verb=f"الطلب #{instance.id} في الطريق إليك مع الناقل",
                order_id=instance.id
            )
        # إذا تغيرت الحالة لـ 'delivered' -> نبعث للفلاح
        elif instance.status == 'delivered':
            Notification.objects.create(
                recipient=instance.farmer,
                verb=f"تم استلام الطلب #{instance.id} من طرف المشتري",
                order_id=instance.id
            )
            Notification.objects.create(
                recipient=instance.buyer,
                sender=instance.transporter,
                verb=f"Delivered: تم توصيل طلبك #{instance.id} بنجاح",
                order_id=instance.id
            )