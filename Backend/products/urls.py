
from django.urls import path
from . import views

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
    # --- Buyer Search and Product Detail URLs ---
    path('search/', views.list_all_products, name='search-products'),
    path('products/<int:pk>/', views.get_product_detail, name='product-detail'),
    path('products/<int:pk>/review/', views.add_product_review, name='add-product-review'),

    # --- Farmer Product URLs ---
    path('farmer/products/', views.list_farmer_products, name='list-farmer-products'),
    path('farmer/products/add/', views.add_product, name='add-farmer-product'),
    path('farmer/products/<int:pk>/update/', views.update_product, name='update-farmer-product'),
    path('farmer/products/<int:pk>/delete/', views.delete_product, name='delete-farmer-product'),
    path('official-prices/<int:pk>/', views.get_official_price, name='get-official-price'),
]