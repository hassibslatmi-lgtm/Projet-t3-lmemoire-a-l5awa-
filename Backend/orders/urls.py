from django.urls import path
from . import views

urlpatterns = [
    path('place/', views.place_order, name='place-order'),
    path('webhook/', views.chargily_webhook, name='chargily-webhook'),
    path('buyer-stats/', views.buyer_dashboard_stats, name='buyer-stats'),
    path('confirm-delivery/<int:order_id>/', views.mark_as_delivered, name='mark-as-delivered'),
    path('farmer-stats/', views.farmer_dashboard_stats, name='farmer-stats'),
    path('farmer/orders/', views.farmer_orders_list, name='farmer-orders-list'),
    path('farmer/mark-ready/<int:order_id>/', views.mark_order_processing, name='mark-ready'),
    path('transporter/available-missions/', views.available_missions, name='available-missions'),
    path('transporter/accept-mission/<int:order_id>/', views.accept_mission, name='accept-mission'),
    path('transporter/reject-mission/<int:order_id>/', views.reject_mission, name='reject-mission'),
    path('transporter/mark-delivered/<int:order_id>/', views.transporter_mark_delivered, name='transporter-mark-delivered'),
]