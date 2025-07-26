from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
from .serializers import *
from rest_framework.generics import ListAPIView
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework import status
from datetime import datetime
from rest_framework.pagination import PageNumberPagination

import json

from rest_framework.parsers import MultiPartParser, FormParser

class ProductCreateView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        data = request.data
        image = request.FILES.get('image', None)
        if "name" not in data or "variants" not in data:
            return Response({"error": "Missing required fields."}, status=400)
        
        if not data["name"].strip():
            return Response({"error": "Product name cannot be empty."}, status=400)

        last_product = Products.objects.order_by('-ProductID').first()
        next_product_id = (last_product.ProductID + 1) if last_product else 10001

        product = Products.objects.create(
            ProductName=data['name'],
            ProductID=next_product_id,
            ProductCode=f"{data['name'].lower().replace(' ', '_')}_{str(next_product_id)}",
            ProductImage=image,  
            CreatedUser=request.user 
        )
        variants_raw = data.get('variants', '[]')
        try:
            variants = json.loads(variants_raw)
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON format for variants."}, status=400)

        for var in variants:
            variant = Variants.objects.create(product=product, name=var['name'])
            for opt in var.get('options', []):
                SubVariants.objects.create(variant=variant, value=opt)

        return Response({"message": "Product created successfully"}, status=201)


class ProductPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class ProductListView(ListAPIView):
    queryset = Products.objects.prefetch_related('variants__subvariants').all()
    serializer_class = ProductSerializer
    pagination_class = ProductPagination


class UpdateStockView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request, pid):
        product = get_object_or_404(Products, ProductID=pid)
        action = request.data.get("action")
        quantity = request.data.get("quantity")

        if action not in ["add", "remove"]:
            return Response({"error": "Invalid action"}, status=400)

        try:
            quantity = float(quantity)
        except:
            return Response({"error": "Invalid quantity"}, status=400)

        if action == "add":
            product.TotalStock = float(product.TotalStock) + quantity
        elif action == "remove":
            if product.TotalStock >= quantity:
                product.TotalStock = float(product.TotalStock) - quantity
            else :
                return Response({"error": "Not Enough stock"}, status=400)

        StockTransaction.objects.create(
            product = product,
            action = action,
            quantity = quantity,
            user=request.user
        )

        product.save()
        return Response({"message": "Stock updated", "TotalStock": str(product.TotalStock)})


class StockReportView(APIView):
    def get(self, request):
        start = request.GET.get('start')
        end = request.GET.get('end')

        queryset = StockTransaction.objects.all()

        if start and end:
            try:
                start_date = datetime.strptime(start, "%Y-%m-%d").date()
                end_date = datetime.strptime(end, "%Y-%m-%d").date()
                queryset = queryset.filter(date__range=(start_date, end_date))
            except ValueError:
                return Response({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = StockTransactionSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)