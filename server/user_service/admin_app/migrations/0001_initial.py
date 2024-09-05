# Generated by Django 5.0.6 on 2024-08-29 08:57

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Pricing',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tier', models.CharField(choices=[('free', 'Free'), ('premium', 'Premium')], max_length=20)),
                ('price', models.IntegerField()),
                ('benefits', models.TextField(help_text='Enter one benefit per line')),
            ],
        ),
    ]