import requests
import json
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.db.models import Sum

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import Order, OrderItem
from .serializers import OrderSerializer
from products.models import Product, OfficialPrice

# =========================================================
# 1. إنشاء الطلب (Buyer) - يدفع مباشرة ويظهر في Dashboard
# =========================================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def place_order(request):
    """
    معدل: الطلب يُنشأ مباشرة بحالة PAID و IS_PAID=True 
    """
    data = request.data
    buyer = request.user
    
    product_id = data.get('product_id')
    quantity = int(data.get('quantity', 1))
    address = data.get('address')
    phone = data.get('phone')

    if not address or not phone:
        return Response({"error": "Address and phone are required"}, status=400)

    product = get_object_or_404(Product, id=product_id)
    farmer = product.farmer
    
    # جلب السعر الرسمي
    price_entry = OfficialPrice.objects.filter(product_name=product.name).first()
    if not price_entry:
        return Response({"error": f"Price for {product.name} not found"}, status=400)
    
    total_price = int(price_entry.price * quantity)

    # التعديل: هنا جعلنا الطلب يبدأ مباشرة كمدفوع PAID
    order = Order.objects.create(
        buyer=buyer,
        farmer=farmer,
        pickup_address=getattr(farmer, 'farm_location', 'No Address Set'),
        shipping_address=address,
        phone_number=phone,
        total_amount=total_price,
        status='paid',   # يبدأ مباشرة paid
        is_paid=True     # True فوراً لتحديث الإحصائيات
    )

    OrderItem.objects.create(
        order=order, 
        product=product, 
        quantity=quantity, 
        price_at_purchase=price_entry.price
    )

    # نطلب رابط الدفع من Chargily (اختياري للعرض فقط لأننا فعلنا الطلب محلياً)
    url = f"{settings.CHARGILY_BASE_URL}/checkouts"
    headers = {
        "Authorization": f"Bearer {settings.CHARGILY_SECRET_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "amount": total_price,
        "currency": "dzd",
        "success_url": "http://localhost:3000/buyer/orders/success", 
        "metadata": {"order_id": str(order.id)}
    }
    
    try:
        resp = requests.post(url, json=payload, headers=headers)
        if resp.status_code in [200, 201]:
            res_data = resp.json()
            order.chargily_invoice_id = res_data.get('id')
            order.save()
            return Response({
                "checkout_url": res_data.get('checkout_url'), 
                "order_id": order.id,
                "message": "Order created and PAID successfully"
            }, status=201)
    except:
        pass

    return Response({"message": "Order created as PAID locally", "order_id": order.id}, status=201)


# =========================================================
# 2. Webhook (احتياطي فقط)
# =========================================================
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def chargily_webhook(request):
    return HttpResponse(status=200)


# =========================================================
# 3. تحكم الفلاح (Farmer Views)
# =========================================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_order_processing(request, order_id):
    """الفلاح يجهز السلعة للنقل"""
    order = get_object_or_404(Order, id=order_id, farmer=request.user)
    # لا نحتاج للتأكد من الدفع لأنه PAID أصلاً
    order.status = 'processing' 
    order.save()
    return Response({"message": "Order is ready for Transporter"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def farmer_orders_list(request):
    orders = Order.objects.filter(farmer=request.user).order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def farmer_dashboard_stats(request):
    from products.models import Product
    user = request.user
    # سيحسب الأموال فوراً لأن is_paid=True
    revenue = Order.objects.filter(farmer=user, is_paid=True).aggregate(Sum('total_amount'))['total_amount__sum'] or 0
    stats = {
        "total_products": Product.objects.filter(farmer=user).count(),
        "total_orders": Order.objects.filter(farmer=user).count(),
        "total_revenue": float(revenue)
    }
    return Response(stats)


# =========================================================
# 4. تحكم الناقل (Transporter Views)
# =========================================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def available_missions(request):
    """الناقل يرى الطلبات الجاهزة للنقل فقط"""
    missions = Order.objects.filter(status='processing', transporter__isnull=True).order_by('-created_at')
    serializer = OrderSerializer(missions, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_mission(request, order_id):
    order = get_object_or_404(Order, id=order_id)
    if order.transporter:
        return Response({"error": "Already accepted by another transporter"}, status=400)
    
    order.transporter = request.user
    order.status = 'shipped' 
    order.save()
    return Response({"message": "Mission accepted", "status": order.status})


# =========================================================
# 5. تحكم المشتري (Stats)
# =========================================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def buyer_dashboard_stats(request):
    user = request.user
    spent = Order.objects.filter(buyer=user, is_paid=True).aggregate(Sum('total_amount'))['total_amount__sum'] or 0
    return Response({
        "total_orders": Order.objects.filter(buyer=user).count(), 
        "total_spent": float(spent)
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_as_delivered(request, order_id):
    order = get_object_or_404(Order, id=order_id, buyer=request.user)
    order.status = 'delivered' 
    order.save()
    return Response({"message": "Delivery confirmed"})