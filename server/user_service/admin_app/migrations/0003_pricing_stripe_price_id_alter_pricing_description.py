# Generated by Django 5.0.6 on 2024-08-29 11:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admin_app', '0002_pricing_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='pricing',
            name='stripe_price_id',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='pricing',
            name='description',
            field=models.TextField(blank=True, max_length=400, null=True),
        ),
    ]