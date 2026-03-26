from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),#signup Api
    path('login/', views.login_api, name='login'),  #login Api
    
    # الإدارة (Admin Panel)
    path('admin/pending/', views.get_pending_users, name='get-pending'), #liste of users pending
    path('admin/validated/', views.get_validated_users, name='get-validated'),#liste of users validated
    path('admin/manage/<int:user_id>/', views.admin_manage_user, name='manage-new-user'), #validate or reject new users
    path('admin/toggle-block/<int:user_id>/', views.toggle_user_block, name='toggle-block'),#blocked or unblock active usres
    path('admin/stats/', views.get_admin_stats, name='admin-stats'),#statistics for admin dashbord Account
]