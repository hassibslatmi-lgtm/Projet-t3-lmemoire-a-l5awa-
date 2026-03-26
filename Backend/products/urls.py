from django.urls import path
from . import views

urlpatterns = [
    path('categories/add/', views.add_category, name='add-category'),
    path('categories/', views.list_categories, name='list-categories'),
    # ... باقي الروابط
]