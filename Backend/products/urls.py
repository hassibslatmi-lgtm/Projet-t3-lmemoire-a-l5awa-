from django.urls import path
from . import views
#urls for product app
urlpatterns = [
    path('categories/', views.list_categories, name='list-categories'),
    path('categories/add/', views.add_category, name='add-category'),
    path('categories/<int:pk>/', views.get_category, name='get-category'),
    path('categories/<int:pk>/update/', views.update_category, name='update-category'),
    path('categories/<int:pk>/delete/', views.delete_category, name='delete-category'),
    path('official-prices/', views.list_official_prices, name='list-prices'),
    path('official-prices/add/', views.add_official_price, name='add-price'),
    path('official-prices/delete/<int:pk>/', views.delete_official_price, name='delete-price'),
    path('official-prices/update/<int:pk>/', views.update_official_price, name='update-price'),

]