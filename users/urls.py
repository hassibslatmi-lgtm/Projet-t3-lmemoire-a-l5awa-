from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', views.login_api, name='login'),
    path('admin/pending-users/', views.get_pending_users, name='get_pending_users'),
    path('admin/manage/<int:user_id>/', views.admin_manage_user, name='admin_manage_user'),
]