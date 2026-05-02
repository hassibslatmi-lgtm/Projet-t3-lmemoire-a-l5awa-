import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from .ai_service import query_agribot_ai, get_weather
from products.models import Product, OfficialPrice, ProductReview
from django.db.models import Avg, Count
from django.db.models.functions import Coalesce

class ChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_message = request.data.get('message', '').strip()
        user = request.user
        
        if not user_message:
            return Response({"error": "Message is required"}, status=400)

        # 1. Load System Prompt (Knowledge Base)
        guide_path = os.path.join(settings.BASE_DIR, 'AGRIGOV_GUIDE.md')
        try:
            with open(guide_path, 'r', encoding='utf-8') as f:
                system_prompt = f.read()
        except FileNotFoundError:
            system_prompt = "You are AgriBot, the AI assistant for AgriGov."

        # 2. Build RAG Context based on User Data and DB
        context_lines = []
        context_lines.append(f"Current User Info: Name={user.full_name}, Username={user.username}, Role={user.role}, Address={user.address}")
        
        # --- DYNAMIC DATA FETCHING ---
        msg_lower = user_message.lower()
        
        # A. Personalized Weather (Based on user address)
        if any(w in msg_lower for w in ["weather", "طقس", "climat"]):
            location = user.address if user.address else "Algiers"
            # Extract city name if address is long (simple split)
            city = location.split(',')[0].strip() if ',' in location else location
            weather_info = get_weather(city)
            context_lines.append(f"Weather for user's location ({city}): {weather_info}")

        # B. Best Rated Products
        if any(w in msg_lower for w in ["best rating", "top rated", "best product", "تقييم", "أفضل"]):
            top_products = Product.objects.annotate(
                avg_rating=Coalesce(Avg('reviews__rating'), 0.0)
            ).order_by('-avg_rating')[:3]
            
            if top_products:
                prod_list = ", ".join([f"{p.name} (Rating: {p.avg_rating}/5 by {p.farmer.username})" for p in top_products])
                context_lines.append(f"Top rated products in market: {prod_list}")
            else:
                context_lines.append("No ratings available in the database yet.")

        # C. Regional Product Distribution (Most products per region)
        if any(w in msg_lower for w in ["region", "area", "most product", "منطقة", "ولابة"]):
            # Grouping products by farmer's address
            regional_stats = Product.objects.values('farmer__address').annotate(
                total=Count('id')
            ).order_by('-total')[:5]
            
            if regional_stats:
                region_info = ", ".join([f"{r['farmer__address'] if r['farmer__address'] else 'Unknown'}: {r['total']} items" for r in regional_stats])
                context_lines.append(f"Product count by region: {region_info}")

        # D. Official Price Reference (Always useful)
        official_prices = OfficialPrice.objects.all().order_by('-date_set')[:5]
        if official_prices:
            price_context = "Official Market Prices: " + ", ".join([f"{p.product_name} ({p.price} DA)" for p in official_prices])
            context_lines.append(price_context)

        # E. User Role specific context
        if user.role == 'farmer':
            farmer_count = Product.objects.filter(farmer=user).count()
            context_lines.append(f"The farmer currently has {farmer_count} active listings.")

        context_data = "\n".join(context_lines)

        # 3. Query the AI
        ai_response = query_agribot_ai(system_prompt, context_data, user_message)

        return Response({
            "response": ai_response,
            "role_context_used": user.role,
            "data_context_length": len(context_lines)
        })
