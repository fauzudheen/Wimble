# Generated by Django 5.0.8 on 2024-08-21 12:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('notification', '0005_notificationpreference'),
    ]

    operations = [
        migrations.DeleteModel(
            name='NotificationPreference',
        ),
    ]
