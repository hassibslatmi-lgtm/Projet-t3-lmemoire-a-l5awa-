from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExpenseViewSet, BuyerStockViewSet

router = DefaultRouter()
router.register(r'expenses', ExpenseViewSet, basename='expense')
router.register(r'stock', BuyerStockViewSet, basename='buyer-stock')

urlpatterns = [
    path('', include(router.urls)),
]
