from django.shortcuts import get_object_or_404
import requests, json
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.db.models import Sum
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Order, OrderItem
from .serializers import OrderSerializer  # تأكد من استيراد السيريالايزر الخاص بك
from products.models import Product, OfficialPrice

# 1. دالة إنشاء الطلب والربط مع بوابة Chargily
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def place_order(request):
    data = request.data
    buyer = request.user
    
    product_id = data.get('product_id')
    quantity = int(data.get('quantity', 1))
    address = data.get('address')
    phone = data.get('phone')

    # التحقق من البيانات المطلوبة
    if not address or not phone:
        return Response({"error": "Address and phone are required"}, status=400)

    # جلب المنتج والتأكد من سعره الرسمي
    product = get_object_or_404(Product, id=product_id)
    price_entry = OfficialPrice.objects.filter(product_name=product.name).first()
    
    if not price_entry:
        return Response({"error": f"Price for {product.name} not found"}, status=400)
    
    total_price = int(price_entry.price * quantity)
    
    # Chargily تطلب مبلغا لا يقل عن 100 دينار
    if total_price < 100:
        return Response({"error": "Total amount must be at least 100 DZD"}, status=400)

    # إنشاء الطلب في قاعدة البيانات
    order = Order.objects.create(
        buyer=buyer,
        farmer=product.farmer,
        total_amount=total_price,
        shipping_address=address,
        phone_number=phone,
        status='paid',  # [TESTING LOGIC] Set to paid for testing
        is_paid=True    # [TESTING LOGIC] Set to True for testing
    )

    # إنشاء عناصر الطلب
    OrderItem.objects.create(
        order=order, 
        product=product, 
        quantity=quantity, 
        price_at_purchase=price_entry.price
    )

    # إعداد البيانات لإرسالها لـ Chargily
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
        res_data = resp.json()
        
        if resp.status_code in [200, 201]:
            order.chargily_invoice_id = res_data.get('id')
            order.save()
            return Response({
                "checkout_url": res_data.get('checkout_url'), 
                "order_id": order.id
            }, status=201)
        
        return Response({"error": "Chargily Error", "details": res_data}, status=400)
        
    except Exception as e:
        return Response({"error": f"Connection Error: {str(e)}"}, status=503)


# 2. استقبال إشعارات الدفع (Webhook)
@csrf_exempt
@api_view(['POST'])
def chargily_webhook(request):
    try:
        data = json.loads(request.body)
        if data.get('type') == 'checkout.paid':
            checkout_payload = data.get('data', {})
            order_id = checkout_payload.get('metadata', {}).get('order_id')
            
            if order_id:
                Order.objects.filter(id=order_id).update(is_paid=True, status='paid')
                print(f"✅ Order {order_id} has been paid successfully.")
                return HttpResponse(status=200)
    except Exception as e:
        print(f"❌ Webhook Error: {str(e)}")
        
    return HttpResponse(status=200)


# 3. إحصائيات لوحة التحكم للمشتري
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def buyer_dashboard_stats(request):
    user = request.user
    total_orders = Order.objects.filter(buyer=user).count()
    total_spent_data = Order.objects.filter(buyer=user, is_paid=True).aggregate(Sum('total_amount'))
    total_spent = total_spent_data['total_amount__sum'] or 0
    farmer_products_count = Product.objects.filter(farmer=user).count()

    return Response({
        "total_orders": total_orders,
        "total_spent": float(total_spent),
        "total_farmer_products": farmer_products_count
    })


# 4. إحصائيات لوحة تحكم المزارع
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def farmer_dashboard_stats(request):
    user = request.user
    total_products = Product.objects.filter(farmer=user).count()
    total_orders = Order.objects.filter(farmer=user).count()
    total_revenue_data = Order.objects.filter(farmer=user, is_paid=True).aggregate(Sum('total_amount'))
    total_revenue = total_revenue_data['total_amount__sum'] or 0
    
    return Response({
        "total_products": total_products,
        "total_orders": total_orders,
        "total_spent": float(total_revenue)
    })


# 5. قائمة الطلبات الكاملة الخاصة بالمزارع
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def farmer_orders_list(request):
    user = request.user
    # جلب الطلبات التي تخص هذا المزارع مرتبة من الأحدث
    orders = Order.objects.filter(farmer=user).order_by('-created_at')
    # تحويل البيانات إلى JSON باستخدام السيريالايزر
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)