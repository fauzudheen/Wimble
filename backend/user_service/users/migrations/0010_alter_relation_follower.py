# Generated by Django 5.0.6 on 2024-07-23 09:24

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0009_relation'),
    ]

    operations = [
        migrations.AlterField(
            model_name='relation',
            name='follower',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='followings', to=settings.AUTH_USER_MODEL),
        ),
    ]
