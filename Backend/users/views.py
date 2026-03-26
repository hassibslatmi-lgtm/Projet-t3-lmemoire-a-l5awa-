



from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from django.core.mail import send_mail
from django.conf import settings
from .models import User
from .serializers import UserSerializer
from rest_framework.authtoken.models import Token

# 1. تسجيل مستخدم جديد مع إرسال إيميل ترحيبي
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        
        # --- إضافة كود إرسال الإيميل هنا ---
        subject = "مرحباً بك في AgriGov ✅"
        message = f"مرحباً {user.full_name}، تم تسجيل حسابك بنجاح وهو الآن قيد المراجعة من طرف الإدارة."
        try:
            send_mail(subject, message, settings.EMAIL_HOST_USER, [user.email], fail_silently=True)
        except Exception as e:
            print(f"Error sending signup email: {e}")
        # ----------------------------------

        return Response({"message": "تم التسجيل بنجاح. حسابك قيد المراجعة."}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 2. دخول المستخدم (Login)
@api_view(['POST'])
@permission_classes([AllowAny])
def login_api(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({'error': 'يرجى تقديم الإيميل وكلمة السر'}, status=400)

    try:
        user_obj = User.objects.get(email=email)
        
        if not user_obj.check_password(password):
            return Response({'error': 'كلمة السر خاطئة'}, status=400)

        if not user_obj.is_staff:
            if user_obj.status == 'pending':
                return Response({'error': 'حسابك مازال في مرحلة المراجعة.'}, status=403)
            if user_obj.status == 'rejected':
                return Response({'error': 'تم رفض طلبك.', 'reason': user_obj.rejection_reason}, status=403)

        token, _ = Token.objects.get_or_create(user=user_obj)
        return Response({
            'token': token.key, 
            'role': user_obj.role, 
            'full_name': user_obj.full_name,
            'username': user_obj.username
        }, status=200)

    except User.DoesNotExist:
        return Response({'error': 'الحساب غير موجود.'}, status=404)

# 3. جلب قائمة الانتظار
@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_pending_users(request):
    pending_users = User.objects.filter(status='pending', is_staff=False).order_by('-created_at')
    serializer = UserSerializer(pending_users, many=True)
    return Response(serializer.data, status=200)

# 4. قبول أو رفض مع إرسال إيميل بالقرار
@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_manage_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        action = request.data.get('action') 
        reason = request.data.get('reason', 'لم يتم ذكر سبب محدد')

        if action == 'approve':
            user.status = 'active'
            user.is_active = True
            subject = "تم تفعيل حسابك في AgriGov ✅"
            message = f"مرحباً {user.full_name}، نتشرف بإعلامك أنه تم قبول طلبك. يمكنك الآن الدخول للمنصة."
        elif action == 'reject':
            user.status = 'rejected'
            user.is_active = False
            user.rejection_reason = reason
            subject = "تحديث بخصوص طلب انضمامك ❌"
            message = f"مرحباً {user.full_name}، للأسف تم رفض طلبك.\nالسبب: {reason}"
        else:
            return Response({'error': 'إجراء غير صالح'}, status=400)

        user.save()

        # --- إرسال الإيميل للمستخدم بعد اتخاذ القرار ---
        try:
            send_mail(subject, message, settings.EMAIL_HOST_USER, [user.email], fail_silently=False)
        except Exception as e:
            print(f"Error sending decision email: {e}")
        # --------------------------------------------

        return Response({'message': f'تم تنفيذ العملية بنجاح للمستخدم {user.full_name}'})
    except User.DoesNotExist:
        return Response({'error': 'المستخدم غير موجود'}, status=404)