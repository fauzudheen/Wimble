# Generated by Django 5.0.6 on 2024-08-18 06:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0011_alter_userskill_skill_alter_userskill_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='profile',
            field=models.ImageField(blank=True, null=True, upload_to='user_service/users/profiles/'),
        ),
    ]