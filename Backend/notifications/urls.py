from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_my_notifications, name='my-notifications'),
    path('<int:pk>/read/', views.mark_as_read, name='mark-as-read'),
]