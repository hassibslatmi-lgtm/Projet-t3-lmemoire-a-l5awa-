from rest_framework import viewsets, permissions
from .models import Expense, BuyerStock
from .serializers import ExpenseSerializer, BuyerStockSerializer
from users.models import Farmer, Buyer

class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(farmer__user=self.request.user)

    def perform_create(self, serializer):
        farmer = Farmer.objects.get(user=self.request.user)
        serializer.save(farmer=farmer)

class BuyerStockViewSet(viewsets.ModelViewSet):
    serializer_class = BuyerStockSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return stock items for the logged-in buyer
        return BuyerStock.objects.filter(buyer__user=self.request.user)

    def perform_create(self, serializer):
        # Automatically assign the logged-in buyer to the new stock item
        buyer = Buyer.objects.get(user=self.request.user)
        serializer.save(buyer=buyer)
