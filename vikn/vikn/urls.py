"""
URL configuration for vikn project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from inventory.views import *
from rest_framework.authtoken.views import obtain_auth_token

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/products/', ProductListView.as_view(), name='product-get'),
    path('api/products/create/', ProductCreateView.as_view(), name='product-post'),
    path('api/products/<int:pid>/stock/', UpdateStockView.as_view(), name='update-stock'),
    path('api/products/stockreport/', StockReportView.as_view()),
    path("api/token/", obtain_auth_token),
]

urlpatterns += (static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT) )
