from django.db import models
from django.contrib.auth.models import AbstractUser
import datetime
import json
from .producer import kafka_producer

class User(AbstractUser):
    tagline = models.CharField(max_length=225, null=True, blank=True)
    bio = models.TextField(max_length=1000, null=True, blank=True)
    profile = models.ImageField(upload_to='profiles/', null=True, blank=True)
    account_tier = models.CharField(default="free", max_length=50)
    date_joined = models.DateField(default=datetime.date.today)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-id'] 

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.publish_user_update()

    def publish_user_update(self):
        user_data = { 
            'id': self.id,
            'username': self.username,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'is_active': self.is_active,
            'is_staff': self.is_staff,
            'tagline': self.tagline, 
            'bio': self.bio,
            'profile': self.profile.url if self.profile else None,  # Convert to URL
            'account_tier': self.account_tier,
            'date_joined': str(self.date_joined),
        }

        kafka_producer.produce_message('users', self.id, user_data)