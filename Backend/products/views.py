from django.db.models import Q, ProtectedError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAdminUser, AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from django.db import IntegrityError
from django.shortcuts import get_object_or_404
from .models import Category, OfficialPrice, Product, PriceHistory, ProductReview
from .serializers import CategorySerializer, OfficialPriceSerializer, ProductSerializer, ProductReviewSerializer
from orders.models import OrderItem

# ==========================================
# --- 1. Category Views (الأصناف) ---
# ==========================================

@api_view(['GET'])
@permission_classes([AllowAny])
def list_categories(request):  #hadi tjib la list ta3 kol category bch l buyer ykhayr
    categories = Category.objects.all().order_by('-created_at')
    serializer = CategorySerializer(categories, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_category(request, pk):
    category = get_object_or_404(Category, pk=pk)
    serializer = CategorySerializer(category, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def add_category(request):  #hadi tkhali ghir l'admin ydir add category
    serializer = CategorySerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAdminUser])
def update_category(request, pk):
    category = get_object_or_404(Category, pk=pk)
    serializer = CategorySerializer(category, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_category(request, pk):  #hadi tkhali l'admin ydir delete category bsh ida kant deja m3mra hadik la category tji error
    category = get_object_or_404(Category, pk=pk)
    try:
        category.delete()
        return Response({'message': 'تم الحذف بنجاح'}, status=status.HTTP_204_NO_CONTENT)
    except ProtectedError:
        return Response({
            'error': 'لا يمكن حذف الصنف لأنه يحتوي على منتجات مرتبطة به. امحِ المنتجات أولاً.'
        }, status=status.HTTP_400_BAD_REQUEST)



# Official Price Views 


@api_view(['GET'])
@permission_classes([AllowAny])  
def list_official_prices(request):  #hadi la list ta3 officiel price bch l Farmer ychouf l price
    prices = OfficialPrice.objects.all().order_by('-date_set') 
    serializer = OfficialPriceSerializer(prices, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAdminUser])
def add_official_price(request): #hna lazm l'admin hwa li ydir add price
    serializer = OfficialPriceSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'PATCH'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAdminUser])
def update_official_price(request, pk):
    price_obj = get_object_or_404(OfficialPrice, pk=pk)
    serializer = OfficialPriceSerializer(price_obj, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAdminUser])
def delete_official_price(request, pk):
    price = get_object_or_404(OfficialPrice, pk=pk)
    price.delete()
    return Response({'message': 'تم الحذف بنجاح'}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_official_price(request, pk):
    price = get_object_or_404(OfficialPrice, pk=pk)
    serializer = OfficialPriceSerializer(price, context={'request': request})
    return Response(serializer.data)



# 3. Farmer Product Views 

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
    
    official_price_id = request.data.get('official_price_id')
    product_name = request.data.get('name')
    
    official_price = None
    if official_price_id:
        official_price = get_object_or_404(OfficialPrice, id=official_price_id)
    elif product_name:
        official_price = OfficialPrice.objects.filter(product_name=product_name).first()
        
    if not official_price:
        return Response({
            'error': 'المنتج غير متاح. يرجى الاختيار من القائمة الرسمية.'
        }, status=status.HTTP_400_BAD_REQUEST)

    data = request.data.copy() if hasattr(request.data, 'copy') else request.data
    data['name'] = official_price.product_name
    if official_price.category:
        data['category'] = official_price.category.id

    serializer = ProductSerializer(data=data, context={'request': request})
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
    
    product = get_object_or_404(Product, pk=pk, farmer=request.user)
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
    
    product = get_object_or_404(Product, pk=pk, farmer=request.user)
    product.delete()
    return Response({'message': 'Product deleted successfully'}, status=status.HTTP_204_NO_CONTENT)



# 4. Buyer Views

@api_view(['GET'])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def list_all_products(request):
    if request.user.role != 'buyer':
        return Response({'error': 'عذراً، خدمة البحث متاحة للمشترين فقط.'}, status=status.HTTP_403_FORBIDDEN)

    queryset = Product.objects.all().order_by('-created_at')
    
    search_query = request.query_params.get('search', None)
    if search_query:
        queryset = queryset.filter(
            Q(name__icontains=search_query) | 
            Q(description__icontains=search_query)
        )
        
    category_id = request.query_params.get('category', None)
    if category_id:
        queryset = queryset.filter(category_id=category_id)
        
    limit = request.query_params.get('limit', None)
    if limit:
        try:
            queryset = queryset[:int(limit)]
        except (ValueError, TypeError):
            pass

    serializer = ProductSerializer(queryset, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_product_detail(request, pk):
    if request.user.role != 'buyer':
        return Response({'error': 'عذراً، التفاصيل متاحة للمشترين فقط.'}, status=status.HTTP_403_FORBIDDEN)

    product = get_object_or_404(Product, pk=pk)
    serializer = ProductSerializer(product, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def add_product_review(request, pk):
    """
    يسمح للمشتري بتقييم المنتج بمجرد إتمام الطلب والدفع (Status: paid, processing, etc.)
    """
    if request.user.role != 'buyer':
        return Response({'error': 'عذراً، التقييم متاح للمشترين فقط.'}, status=status.HTTP_403_FORBIDDEN)

    product = get_object_or_404(Product, pk=pk)

    # التحقق: هل المشتري طلب هذا المنتج وحالة الطلب مدفوعة أو قيد التنفيذ؟
    has_purchased = OrderItem.objects.filter(
        product=product,
        order__buyer=request.user,
        order__status__in=['paid', 'processing', 'shipped', 'delivered']
    ).exists()

    if not has_purchased:
        return Response({
            'error': 'لا يمكنك تقييم هذا المنتج إلا إذا قمت بطلبه وشرائه مسبقاً.'
        }, status=status.HTTP_403_FORBIDDEN)

    serializer = ProductReviewSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        try:
            # ربط المشتري والمنتج يدوياً عند الحفظ لتجنب التلاعب
            serializer.save(buyer=request.user, product=product)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except IntegrityError:
            return Response({'error': 'لقد قمت بتقييم هذا المنتج مسبقاً.'}, status=status.HTTP_400_BAD_REQUEST)
            
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)