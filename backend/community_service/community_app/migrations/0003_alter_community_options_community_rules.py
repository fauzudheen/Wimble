# Generated by Django 5.0.7 on 2024-07-25 12:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('community_app', '0002_alter_community_cover_image_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='community',
            options={'ordering': ['name']},
        ),
        migrations.AddField(
            model_name='community',
            name='rules',
            field=models.TextField(blank=True, null=True),
        ),
    ]
