from rest_framework import serializers
from .models import *

class SubVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubVariants
        fields = ['value']


class VariantSerializer(serializers.ModelSerializer):
    subvariants = SubVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Variants
        fields = ['name', 'subvariants']


class ProductSerializer(serializers.ModelSerializer):
    variants = VariantSerializer(many=True, read_only=True)
    ProductID = serializers.IntegerField(read_only=True)
    ProductCode = serializers.CharField(read_only=True)
    CreatedDate = serializers.DateTimeField(read_only=True)
    UpdatedDate = serializers.DateTimeField(read_only=True)
    CreatedUser = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Products
        fields = [ 'id', 'ProductID', 'ProductCode', 'ProductName', 'ProductImage', 'CreatedDate', 'UpdatedDate', 'CreatedUser', 'IsFavourite', 'Active', 'HSNCode', 'TotalStock', 'variants' ]

class StockTransactionSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = StockTransaction
        fields = ['id', 'product', 'action', 'quantity', 'date', 'time', 'user']
    def get_product(self, obj):
        return obj.product.ProductCode 
        