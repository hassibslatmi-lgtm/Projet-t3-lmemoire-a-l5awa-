import requests
import json
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.db.models import Sum

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Order, OrderItem
from .serializers import OrderSerializer
from products.models import Product, OfficialPrice

# ---------------------------------------------------------
# 1. إنشاء الطلب (Buyer)
# ---------------------------------------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def place_order(request):
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
    
    # جلب السعر الرسمي للمنتج
    price_entry = OfficialPrice.objects.filter(product_name=product.name).first()
    if not price_entry:
        return Response({"error": f"Price for {product.name} not found"}, status=400)
    
    total_price = int(price_entry.price * quantity)

    # إنشاء الطلب وحفظ عنوان المزرعة في pickup_address
    order = Order.objects.create(
        buyer=buyer,
        farmer=farmer,
        pickup_address=getattr(farmer, 'farm_location', 'No Address Set'),
        shipping_address=address,
        phone_number=phone,
        total_amount=total_price,
        status='pending',
        is_paid=False
    )

    OrderItem.objects.create(
        order=order, 
        product=product, 
        quantity=quantity, 
        price_at_purchase=price_entry.price
    )

    # التكامل مع Chargily
    url = f"{settings.CHARGILY_BASE_URL}/checkouts"
    headers = {
        "Authorization": f"Bearer {settings.CHARGILY_SECRET_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "amount": total_price,
        "currency": "dzd",
        "success_url": "http://localhost:3000/buyer/orders", 
        "metadata": {"order_id": str(order.id)}
    }
    
    try:
        resp = requests.post(url, json=payload, headers=headers)
        if resp.status_code in [200, 201]:
            res_data = resp.json()
            order.chargily_invoice_id = res_data.get('id')
            order.save()
            return Response({"checkout_url": res_data.get('checkout_url'), "order_id": order.id}, status=201)
    except Exception as e:
        print(f"Chargily Connection Error: {e}")

    return Response({"message": "Order created locally", "order_id": order.id}, status=201)


# ---------------------------------------------------------
# 2. تحويل الطلب لـ Processing (Farmer)
# ---------------------------------------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_order_processing(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({"error": f"الطلب رقم {order_id} غير موجود"}, status=404)

    if order.farmer != request.user:
        return Response({"error": "ليس لديك صلاحية لهذا الطلب"}, status=403)

    if not order.is_paid:
        return Response({"error": "المشتري لم يدفع بعد"}, status=400)
        
    order.status = 'processing' 
    order.save()
    return Response({
        "message": "تم تحديث الحالة، الطلب يظهر الآن للناقلين", 
        "status": order.status
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def farmer_orders_list(request):
    orders = Order.objects.filter(farmer=request.user).order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


# ---------------------------------------------------------
# 3. الناقل (Transporter)
# ---------------------------------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def available_missions(request):
    missions = Order.objects.filter(status='processing', transporter__isnull=True).order_by('-created_at')
    serializer = OrderSerializer(missions, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_mission(request, order_id):
    order = get_object_or_404(Order, id=order_id)
    
    if order.transporter:
        return Response({"error": "المهمة مأخوذة بالفعل"}, status=400)
    
    if order.status != 'processing':
        return Response({"error": "الفلاح لم يجهز الطلب بعد"}, status=400)
    
    order.transporter = request.user
    order.status = 'shipped' 
    order.save()
    return Response({"message": "تم قبول المهمة بنجاح", "status": order.status})


# ---------------------------------------------------------
# 4. المشتري (Confirmation)
# ---------------------------------------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_as_delivered(request, order_id):
    order = get_object_or_404(Order, id=order_id, buyer=request.user)
    if order.status != 'shipped':
        return Response({"error": "الطلب لم يشحن بعد"}, status=400)
    order.status = 'delivered' 
    order.save()
    return Response({"message": "تم تأكيد الاستلام بنجاح", "status": order.status})


# ---------------------------------------------------------
# 5. Webhook & Stats
# ---------------------------------------------------------
@csrf_exempt
@api_view(['POST'])
def chargily_webhook(request):
    try:
        data = json.loads(request.body)
        if data.get('type') == 'checkout.paid':
            order_id = data.get('data', {}).get('metadata', {}).get('order_id')
            if order_id:
                Order.objects.filter(id=order_id).update(is_paid=True, status='paid')
                return HttpResponse(status=200)
    except: pass
    return HttpResponse(status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def farmer_dashboard_stats(request):
    from products.models import Product
    user = request.user
    stats = {
        "total_products": Product.objects.filter(farmer=user).count(),
        "total_orders": Order.objects.filter(farmer=user).count(),
        "total_revenue": float(Order.objects.filter(farmer=user, is_paid=True).aggregate(Sum('total_amount'))['total_amount__sum'] or 0)
    }
    return Response(stats)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def buyer_dashboard_stats(request):
    user = request.user
    spent = Order.objects.filter(buyer=user, is_paid=True).aggregate(Sum('total_amount'))['total_amount__sum'] or 0
    return Response({"total_orders": Order.objects.filter(buyer=user).count(), "total_spent": float(spent)})