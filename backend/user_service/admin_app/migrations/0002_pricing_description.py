# Generated by Django 5.0.6 on 2024-08-29 09:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admin_app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='pricing',
            name='description',
            field=models.TextField(default='nil'),
            preserve_default=False,
        ),
    ]