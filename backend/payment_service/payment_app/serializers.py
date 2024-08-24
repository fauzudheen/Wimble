from rest_framework import serializers
from . import models

class PaymentStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.PaymentStatus
        fields = '__all__'