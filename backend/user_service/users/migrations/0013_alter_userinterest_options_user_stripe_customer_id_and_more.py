# Generated by Django 5.0.6 on 2024-08-23 11:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0012_alter_user_profile'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='userinterest',
            options={'ordering': ['interest__name']},
        ),
        migrations.AddField(
            model_name='user',
            name='stripe_customer_id',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='stripe_subscription_id',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='subscription_expiry',
            field=models.DateField(blank=True, null=True),
        ),
    ]
