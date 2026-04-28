from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from .models import Animal
from .serializers import AnimalSerializer
import math

def haversine(lat1, lon1, lat2, lon2):
    # Radius of the Earth in km
    R = 6371.0
    
    phi1, phi2 = math.radians(float(lat1)), math.radians(float(lat2))
    dphi = math.radians(float(lat2) - float(lat1))
    dlambda = math.radians(float(lon2) - float(lon1))
    
    a = math.sin(dphi / 2)**2 + \
        math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2)**2
    
    return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1 - a))

class AnimalViewSet(viewsets.ModelViewSet):
    serializer_class = AnimalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Farmers only see their own animals
        if self.request.user.role == 'farmer':
            return Animal.objects.filter(farmer=self.request.user)
        # Ministry/Staff see everything
        return Animal.objects.all()

    def perform_create(self, serializer):
        serializer.save(farmer=self.request.user)

    @action(detail=True, methods=['patch'], url_path='update-location')
    def update_location(self, request, pk=None):
        animal = self.get_object()
        new_lat = request.data.get('latitude')
        new_lng = request.data.get('longitude')

        if new_lat is None or new_lng is None:
            return Response({"error": "Latitude and longitude required"}, status=400)

        # Check for suspicious movement (> 10km)
        if animal.latitude and animal.longitude:
            distance = haversine(animal.latitude, animal.longitude, new_lat, new_lng)
            if distance > 10.0:
                animal.suspicious_movement = True
        
        animal.latitude = new_lat
        animal.longitude = new_lng
        animal.save()

        return Response({
            "status": "Location updated",
            "suspicious_movement": animal.suspicious_movement,
            "distance_moved_km": distance if 'distance' in locals() else 0
        })

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def verify(self, request, pk=None):
        """Admin action to verify an animal"""
        animal = self.get_object()
        animal.is_verified = True
        animal.save()
        return Response({"status": "Animal verified"})

    @action(detail=False, methods=['get'], url_path='national-summary', permission_classes=[permissions.IsAdminUser])
    def national_summary(self, request):
        """Global stats grouped by species and region"""
        summary = Animal.objects.values('species', 'region').annotate(count=Count('id')).order_by('region', 'species')
        return Response(summary)

    @action(detail=False, methods=['get'], url_path='heatmap-data')
    def heatmap_data(self, request):
        """Coordinates for heatmap visualization"""
        # Only staff or ministry can see all coordinates
        if not (request.user.is_staff or request.user.role == 'ministry'):
            return Response({"error": "Unauthorized"}, status=403)
            
        animals = Animal.objects.filter(latitude__isnull=False, longitude__isnull=False)
        data = [{"lat": float(a.latitude), "lng": float(a.longitude), "species": a.species} for a in animals]
        return Response(data)

    @action(detail=False, methods=['get'], url_path='farmer-inventory', permission_classes=[permissions.IsAdminUser])
    def farmer_inventory(self, request):
        """Summary of farmers and their total animal counts"""
        inventory = Animal.objects.values(
            'farmer__username', 'farmer__full_name'
        ).annotate(
            total_animals=Count('id')
        ).order_by('-total_animals')
        
        return Response(inventory)
