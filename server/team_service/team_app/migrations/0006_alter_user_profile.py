# Generated by Django 5.0.7 on 2024-08-18 06:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('team_app', '0005_alter_teammeeting_options_alter_team_profile_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='profile',
            field=models.CharField(blank=True, null=True),
        ),
    ]