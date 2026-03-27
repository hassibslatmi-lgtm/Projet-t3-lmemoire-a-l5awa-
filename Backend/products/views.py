from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, AllowAny
from .models import Category
from .serializers import CategorySerializer

# جلب قائمة كل الأصناف (للجميع)
@api_view(['GET'])
@permission_classes([AllowAny])
def list_categories(request):
    categories = Category.objects.all().order_by('-created_at')
    # التعديل هنا: إضافة context={'request': request}
    serializer = CategorySerializer(categories, many=True, context={'request': request})
    return Response(serializer.data)

# جلب تفاصيل صنف واحد بالـ ID
@api_view(['GET'])
@permission_classes([AllowAny])
def get_category(request, pk):
    try:
        category = Category.objects.get(pk=pk)
        # التعديل هنا: إضافة context={'request': request}
        serializer = CategorySerializer(category, context={'request': request})
        return Response(serializer.data)
    except Category.DoesNotExist:
        return Response({'error': 'الصنف غير موجود'}, status=status.HTTP_404_NOT_FOUND)

# إضافة صنف جديد (Admin Only)
@api_view(['POST'])
@permission_classes([IsAdminUser])
def add_category(request):
    # نمرر الـ context هنا أيضاً ليرجع لنا الرابط الكامل بعد الحفظ مباشرة
    serializer = CategorySerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# تعديل صنف (Admin Only)
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAdminUser])
def update_category(request, pk):
    try:
        category = Category.objects.get(pk=pk)
    except Category.DoesNotExist:
        return Response({'error': 'الصنف غير موجود'}, status=status.HTTP_404_NOT_FOUND)
    
    # إضافة context={'request': request}
    serializer = CategorySerializer(category, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# حذف صنف (Admin Only)
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_category(request, pk):
    try:
        category = Category.objects.get(pk=pk)
        category.delete()
        return Response({'message': 'تم الحذف بنجاح'}, status=status.HTTP_204_NO_CONTENT)
    except Category.DoesNotExist:
        return Response({'error': 'الصنف غير موجود'}, status=status.HTTP_404_NOT_FOUND)