import json
from confluent_kafka import Consumer, KafkaError
import django
import os
import sys

parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_dir)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'article_service.settings')
django.setup()

from django.db import transaction
from article_app.models import User, Interest

# Kafka configuration
consumer = Consumer({
    'bootstrap.servers': 'kafka:9092',
    'group.id': 'article_service_group',
    'auto.offset.reset': 'earliest'
})

consumer.subscribe(['users', 'interests'])

def store_user_in_db(user_data):
    with transaction.atomic():
        User.objects.update_or_create(
            id=user_data['id'],
            defaults={
                'first_name': user_data.get('first_name', ''),
                'last_name': user_data.get('last_name', ''),
                'tagline': user_data.get('tagline', ''),
                'profile': user_data.get('profile', ''),
                'is_staff': user_data.get('is_staff', False),
            }
        )
    print(f"Stored user with profile URL: {user_data.get('profile', '')}")

def store_interest_in_db(interest_data):
    with transaction.atomic():
        Interest.objects.update_or_create(
            id=interest_data['id'],
            defaults={
                'name': interest_data['name'],
            }
        )
    

def consume_messages():
    try:
        print("-----------------Article service Consuming messages...-----------------")
        while True:
            msg = consumer.poll(1.0)
            if msg is None:
                continue

            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    print('End of partition reached {0}/{1}'.format(msg.topic(), msg.partition()))
                elif msg.error():
                    print('Error occurred: {0}'.format(msg.error().str()))
            else:
                topic = msg.topic()
                message_data = json.loads(msg.value().decode('utf-8'))
                
                if topic == 'users':
                    store_user_in_db(message_data)
                    print(f"User {message_data['id']} data stored in database")
                elif topic == 'interests':
                    store_interest_in_db(message_data)
                    print(f"Interest {message_data['id']} data stored in database")

    except Exception as e:
        print(f"Unexpected error: {e}")
    finally:
        consumer.close()

if __name__ == '__main__':
    consume_messages()