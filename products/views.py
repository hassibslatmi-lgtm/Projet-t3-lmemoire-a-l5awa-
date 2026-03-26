from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer

# جلب الأصناف (للفلاح والمشتري)
@api_view(['GET'])
@permission_classes([AllowAny])
def list_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

# إضافة صنف (Admin Only)
@api_view(['POST'])
@permission_classes([IsAdminUser])
def add_category(request):
    serializer = CategorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# إضافة منتج (Farmer Only)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_product(request):
    if request.user.role != 'farmer':
        return Response({'error': 'فقط الفلاحين يمكنهم إضافة منتجات'}, status=403)
    
    serializer = ProductSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(farmer=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)