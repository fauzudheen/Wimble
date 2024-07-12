# Generated by Django 5.0.6 on 2024-07-04 15:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_alter_user_is_active'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='user',
            options={'ordering': ['-id']},
        ),
        migrations.AddField(
            model_name='user',
            name='tagline',
            field=models.CharField(blank=True, max_length=225, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='account_tier',
            field=models.CharField(default='free', max_length=50),
        ),
    ]
