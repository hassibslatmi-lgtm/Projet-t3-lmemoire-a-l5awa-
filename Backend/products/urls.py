from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.list_categories, name='list-categories'),
    path('categories/add/', views.add_category, name='add-category'),
    path('categories/<int:pk>/', views.get_category, name='get-category'),
    path('categories/<int:pk>/update/', views.update_category, name='update-category'),
    path('categories/<int:pk>/delete/', views.delete_category, name='delete-category'),
]