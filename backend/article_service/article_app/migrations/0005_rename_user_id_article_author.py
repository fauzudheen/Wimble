# Generated by Django 5.0.6 on 2024-07-07 06:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('article_app', '0004_user_alter_article_user_id'),
    ]

    operations = [
        migrations.RenameField(
            model_name='article',
            old_name='user_id',
            new_name='author',
        ),
    ]