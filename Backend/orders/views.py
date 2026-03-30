from django.shortcuts import get_object_or_404
import requests, json
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Order, OrderItem
from products.models import Product, OfficialPrice

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def place_order(request):
    data = request.data
    buyer = request.user
    
    # 1. استخراج البيانات
    product_id = data.get('product_id')
    quantity = int(data.get('quantity', 1))
    address = data.get('address')
    phone = data.get('phone')

    if not address or not phone:
        return Response({"error": "Address and phone are required"}, status=400)

    # 2. حساب السعر
    product = get_object_or_404(Product, id=product_id)
    price_entry = OfficialPrice.objects.filter(product_name=product.name).first()
    
    if not price_entry:
        return Response({"error": f"Price for {product.name} not found"}, status=400)
    
    total_price = int(price_entry.price * quantity)
    
    if total_price < 100:
        return Response({"error": "Total amount must be at least 100 DZD"}, status=400)

    # 3. إنشاء الطلب
    order = Order.objects.create(
        buyer=buyer,
        farmer=product.farmer,
        total_amount=total_price,
        shipping_address=address,
        phone_number=phone,
        status='pending'
    )

    OrderItem.objects.create(
        order=order, product=product, quantity=quantity, price_at_purchase=price_entry.price
    )

    # 4. الاتصال بـ Chargily
    url = f"{settings.CHARGILY_BASE_URL}/checkouts"
    headers = {
        "Authorization": f"Bearer {settings.CHARGILY_SECRET_KEY}",
        "Content-Type": "application/json",
    }
    
    payload = {
        "amount": total_price,
        "currency": "dzd",
        "success_url": "https://google.com", # غيرها لاحقاً لـ رابط صفحة النجاح في React
        "metadata": {
            "order_id": str(order.id)
        }
    }
    
    try:
        resp = requests.post(url, json=payload, headers=headers)
        res_data = resp.json()
        
        # التعديل هنا: نقبل 200 و 201 كلاهما نجاح
        if resp.status_code in [200, 201]:
            order.chargily_invoice_id = res_data.get('id')
            order.save()
            print(f"✅ Success! Checkout URL: {res_data.get('checkout_url')}")
            return Response({
                "checkout_url": res_data.get('checkout_url'),
                "order_id": order.id
            }, status=201)
        else:
            print(f"❌ Chargily Rejected: {res_data}")
            return Response({"error": "Chargily Error", "details": res_data}, status=400)

    except Exception as e:
        return Response({"error": f"Connection Error: {str(e)}"}, status=503)

@csrf_exempt
@api_view(['POST'])
def chargily_webhook(request):
    try:
        data = json.loads(request.body)
        if data.get('type') == 'checkout.paid':
            order_id = data['data']['metadata'].get('order_id')
            if order_id:
                Order.objects.filter(id=order_id).update(is_paid=True, status='paid')
                print(f"💰 Order {order_id} has been PAID!")
                return HttpResponse(status=200)
    except Exception as e:
        print(f"⚠️ Webhook Error: {e}")
    return HttpResponse(status=200)