from django.urls import path
from . import views

urlpatterns = [
    path('place/', views.place_order, name='place-order'),
    path('webhook/', views.chargily_webhook, name='chargily-webhook'),
    path('buyer-stats/', views.buyer_dashboard_stats, name='buyer-stats'),
    path('farmer-stats/', views.farmer_dashboard_stats, name='farmer-stats'),
    path('farmer/orders/', views.farmer_orders_list, name='farmer-orders-list'),
]