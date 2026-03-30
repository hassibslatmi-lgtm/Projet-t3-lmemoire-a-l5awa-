from django.db.models import Q
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAdminUser, AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from .models import Category, OfficialPrice, Product, PriceHistory
from .serializers import CategorySerializer, OfficialPriceSerializer, ProductSerializer

# --- Category Views ---
@api_view(['GET'])
@permission_classes([AllowAny])
def list_categories(request):
    categories = Category.objects.all().order_by('-created_at')
    serializer = CategorySerializer(categories, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_category(request, pk):
    try:
        category = Category.objects.get(pk=pk)
        serializer = CategorySerializer(category, context={'request': request})
        return Response(serializer.data)
    except Category.DoesNotExist:
        return Response({'error': 'الصنف غير موجود'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def add_category(request):
    serializer = CategorySerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAdminUser])
def update_category(request, pk):
    try:
        category = Category.objects.get(pk=pk)
    except Category.DoesNotExist:
        return Response({'error': 'الصنف غير موجود'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = CategorySerializer(category, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_category(request, pk):
    try:
        category = Category.objects.get(pk=pk)
        category.delete()
        return Response({'message': 'تم الحذف بنجاح'}, status=status.HTTP_204_NO_CONTENT)
    except Category.DoesNotExist:
        return Response({'error': 'الصنف غير موجود'}, status=status.HTTP_404_NOT_FOUND)


# --- Official Price Views (Modified for Price History) ---
@api_view(['GET'])
@permission_classes([AllowAny])
def list_official_prices(request):
    # ترتيب حسب الأحدث
    prices = OfficialPrice.objects.all().order_by('-date_set') 
    # الـ Serializer سيتكفل بجلب الـ history تلقائياً
    serializer = OfficialPriceSerializer(prices, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAdminUser])
def add_official_price(request):
    serializer = OfficialPriceSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        # دالة save() في الموديل ستنشئ أول سجل في التاريخ تلقائياً
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'PATCH'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAdminUser])
def update_official_price(request, pk):
    try:
        price_obj = OfficialPrice.objects.get(pk=pk)
    except OfficialPrice.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = OfficialPriceSerializer(price_obj, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        # دالة save() في الموديل ستسجل السعر الجديد في التاريخ تلقائياً
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAdminUser])
def delete_official_price(request, pk):
    try:
        price = OfficialPrice.objects.get(pk=pk)
        price.delete()
        return Response({'message': 'Deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except OfficialPrice.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
@api_view(['GET'])
@permission_classes([AllowAny])
def get_official_price(request, pk):
    try:
        price = OfficialPrice.objects.get(pk=pk)
        serializer = OfficialPriceSerializer(price, context={'request': request})
        return Response(serializer.data)
    except OfficialPrice.DoesNotExist:
        return Response({'error': 'السعر الرسمي غير موجود'}, status=status.HTTP_404_NOT_FOUND)

# --- Farmer Product Views ---
@api_view(['GET'])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def list_farmer_products(request):
    if request.user.role != 'farmer':
        return Response({'error': 'Only farmers can view their products'}, status=status.HTTP_403_FORBIDDEN)
    products = Product.objects.filter(farmer=request.user).order_by('-created_at')
    serializer = ProductSerializer(products, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def add_product(request):
    if request.user.role != 'farmer':
        return Response({'error': 'Only farmers can add products'}, status=status.HTTP_403_FORBIDDEN)
    
    product_name = request.data.get('name')
    if not OfficialPrice.objects.filter(product_name=product_name).exists():
        return Response({
            'error': f'المنتج "{product_name}" غير متاح. يرجى الاختيار من القائمة الرسمية المحددة من طرف الإدارة.'
        }, status=status.HTTP_400_BAD_REQUEST)

    serializer = ProductSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save(farmer=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'PATCH'])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def update_product(request, pk):
    if request.user.role != 'farmer':
        return Response({'error': 'Only farmers can update products'}, status=status.HTTP_403_FORBIDDEN)
        
    try:
        product = Product.objects.get(pk=pk, farmer=request.user)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found or not owned by you'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = ProductSerializer(product, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def delete_product(request, pk):
    if request.user.role != 'farmer':
        return Response({'error': 'Only farmers can delete products'}, status=status.HTTP_403_FORBIDDEN)
        
    try:
        product = Product.objects.get(pk=pk, farmer=request.user)
        product.delete()
        return Response({'message': 'Product deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found or not owned by you'}, status=status.HTTP_404_NOT_FOUND)

# --- Buyer Product Views (Search & Details) ---

@api_view(['GET'])
@permission_classes([AllowAny])
def list_all_products(request):
    """
    عرض كل المنتجات مع إمكانية البحث والفلترة (للمشتري)
    Step 1-3 of the sequence diagram.
    """
    queryset = Product.objects.all().order_by('-created_at')
    
    # البحث بالكلمة المفتاحية (الاسم أو الوصف)
    search_query = request.query_params.get('search', None)
    if search_query:
        queryset = queryset.filter(
            Q(name__icontains=search_query) | 
            Q(description__icontains=search_query)
        )
        
    # الفلترة حسب الصنف
    category_id = request.query_params.get('category', None)
    if category_id:
        queryset = queryset.filter(category_id=category_id)
        
    serializer = ProductSerializer(queryset, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_product_detail(request, pk):
    """
    عرض تفاصيل المنتج (للمشتري)
    Step 4-5 of the sequence diagram.
    """
    try:
        product = Product.objects.get(pk=pk)
        serializer = ProductSerializer(product, context={'request': request})
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'error': 'المنتج غير موجود'}, status=status.HTTP_404_NOT_FOUND)
