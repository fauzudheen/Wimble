from django.db import models
from django.contrib.auth.models import AbstractUser
import datetime

class User(AbstractUser):
    bio = models.TextField(max_length=1000, null=True, blank=True)
    profile = models.ImageField(upload_to='profiles/', null=True, blank=True)
    account_tier = models.CharField(max_length=50, null=True, blank=True)
    date_joined = models.DateField(default=datetime.date.today)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-id'] 