import requests
import json
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.db.models import Sum
from django.db import transaction 

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import Order, OrderItem
from .serializers import OrderSerializer
from products.models import Product, OfficialPrice

# =========================================================
# 1. إنشاء الطلب (المشتري) - مع تعديل خصم الكمية والتحقق
# =========================================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@transaction.atomic 
def place_order(request):
    data = request.data
    buyer = request.user
    
    product_id = data.get('product_id')
    quantity = int(data.get('quantity', 1))
    address = data.get('address')
    phone = data.get('phone')

    if not address or not phone:
        return Response({"error": "Address and phone are required"}, status=400)

    # 1. التحقق من وجود المنتج والكمية الكافية
    product = get_object_or_404(Product, id=product_id)
    
    # التحقق: إذا كانت الكمية المطلوبة أكبر من المتوفرة
    if product.quantity < quantity:
        return Response({
            "error": f"الكمية المطلوبة غير متوفرة. المتبقي في المخزن: {product.quantity} فقط."
        }, status=400)

    farmer_user = product.farmer 
    
    price_entry = OfficialPrice.objects.filter(product_name=product.name).first()
    if not price_entry:
        return Response({"error": f"Price for {product.name} not found"}, status=400)
    
    total_price = int(price_entry.price * quantity)

    try:
        farm_loc = farmer_user.farmer.farm_location
    except:
        farm_loc = "Site Web"

    # 2. إنشاء الطلب
    order = Order.objects.create(
        buyer=buyer,
        farmer=farmer_user,
        pickup_address=farm_loc,
        shipping_address=address,
        phone_number=phone,
        total_amount=total_price,
        status='paid',   
        is_paid=True     
    )

    # 3. إنشاء عنصر الطلب
    OrderItem.objects.create(
        order=order, 
        product=product, 
        quantity=quantity, 
        price_at_purchase=price_entry.price
    )

    # 4. تحديث الكمية في المخزن (الخصم)
    product.quantity -= quantity
    product.save()

    # 5. التعامل مع بوابة الدفع Chargily
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
                "message": "Order created and PAID successfully. Stock updated.",
                "remaining_quantity": product.quantity
            }, status=201)
    except:
        pass

    return Response({
        "message": "Order created as PAID locally. Stock updated.", 
        "order_id": order.id,
        "remaining_quantity": product.quantity
    }, status=201)


# =========================================================
# 2. تحكم الفلاح
# =========================================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_order_processing(request, order_id):
    order = get_object_or_404(Order, id=order_id, farmer=request.user)
    order.status = 'processing' 
    order.save()
    return Response({"message": "Order is ready for Transporter"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def farmer_dashboard_stats(request):
    user = request.user
    revenue = Order.objects.filter(farmer=user, is_paid=True).aggregate(Sum('total_amount'))['total_amount__sum'] or 0
    return Response({
        "total_products": Product.objects.filter(farmer=user).count(),
        "total_orders": Order.objects.filter(farmer=user).count(),
        "total_revenue": float(revenue)
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def farmer_orders_list(request):
    orders = Order.objects.filter(farmer=request.user).order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


# =========================================================
# 3. تحكم الناقل (Available, Accept, Reject)
# =========================================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def available_missions(request):
    transporter_user = request.user
    trans_addr = transporter_user.address

    if not trans_addr:
        return Response({"error": "يرجى كتابة عنوانك في البروفايل"}, status=400)

    missions = Order.objects.filter(
        status='paid',
        transporter__isnull=True,
        farmer__farmer__farm_location__icontains=trans_addr.strip()
    ).distinct().order_by('-created_at')

    serializer = OrderSerializer(missions, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_mission(request, order_id):
    order = get_object_or_404(Order, id=order_id)
    if order.transporter:
        return Response({"error": "هذه المهمة مأخوذة من قبل ناقل آخر"}, status=400)
    
    order.transporter = request.user
    order.status = 'shipped' 
    order.save()
    return Response({"message": "تم قبول المهمة بنجاح", "status": order.status})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reject_mission(request, order_id):
    return Response({
        "message": "تم رفض المهمة، لن تظهر لك في القائمة حالياً",
        "order_id": order_id
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def transporter_dashboard_stats(request):
    user = request.user
    completed = Order.objects.filter(transporter=user, status='delivered').count()
    active = Order.objects.filter(transporter=user, status='shipped').count()
    
    return Response({
        "missions_completed": completed,
        "active_missions": active
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def transporter_missions_list(request):
    missions = Order.objects.filter(transporter=request.user).order_by('-created_at')
    serializer = OrderSerializer(missions, many=True)
    return Response(serializer.data)


# =========================================================
# 4. تحكم المشتري
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def transporter_mark_delivered(request, order_id):
    order = get_object_or_404(Order, id=order_id, transporter=request.user)
    
    if order.status != 'shipped':
        return Response({"error": "يمكنك فقط تأكيد استلام الطلبات التي هي في حالة 'تم الشحن'"}, status=400)
    
    order.status = 'delivered'
    order.save()
    return Response({
        "message": "تم تحديث حالة الطلب إلى 'تم الاستلام' بنجاح",
        "status": order.status
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def buyer_orders_list(request):
    orders = Order.objects.filter(buyer=request.user).order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

# =========================================================
# 5. Webhook
# =========================================================
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def chargily_webhook(request):
    return HttpResponse(status=200)