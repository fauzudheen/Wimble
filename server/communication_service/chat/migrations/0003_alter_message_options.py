# Generated by Django 5.0.8 on 2024-08-09 08:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0002_team_rename_participants_chatroom_members_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='message',
            options={'ordering': ['-created_at']},
        ),
    ]
