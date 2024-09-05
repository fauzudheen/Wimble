from django.db import models

class Pricing(models.Model):
    TIER_CHOICES = [
        ('free', 'Free'),
        ('premium', 'Premium'),
    ]

    tier = models.CharField(max_length=20, choices=TIER_CHOICES)
    description = models.TextField(max_length=400, null=True, blank=True)
    price = models.IntegerField()
    benefits = models.TextField(help_text="Enter one benefit per line")
    stripe_price_id = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return self.tier