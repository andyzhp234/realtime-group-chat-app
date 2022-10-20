
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.urls import re_path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('chat/', include('chat.urls')),
    path('api/', include('api.urls')),
    
    path('', TemplateView.as_view(template_name="index.html")),
    path('signup/', TemplateView.as_view(template_name="index.html")),
    path('lobby/', TemplateView.as_view(template_name="index.html")),
    re_path('lobby/(?P<room_name>\w+)/', TemplateView.as_view(template_name="index.html")),
]
