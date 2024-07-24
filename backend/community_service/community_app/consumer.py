import json
from confluent_kafka import Consumer, KafkaError
import django
import os
import sys

from community_app.models import User

parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_dir)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'community_service.settings')
django.setup()

from django.db import transaction

# Kafka configuration
consumer = Consumer({
    'bootstrap.servers': 'kafka:9092',
    'group.id': 'community_service_group',
    'auto.offset.reset': 'earliest'
})

consumer.subscribe(['users'])

def store_user_in_db(user_data):
    with transaction.atomic():
        User.objects.update_or_create(
            id=user_data['id'],
            defaults={
                'first_name': user_data.get('first_name', ''),
                'last_name': user_data.get('last_name', ''),
                'tagline': user_data.get('tagline', ''),
                'profile': user_data.get('profile', ''),
            }
        )

def consume_messages():
    try:
        print("-----------------Community service Consuming messages...-----------------")
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
                print(f"Received message: {message_data}")

                if topic == 'users':
                    store_user_in_db(message_data)
                    print(f"User {message_data['id']} data stored in database")


    except Exception as e:
        print(f"Unexpected error: {e}")
    finally:
        consumer.close()

if __name__ == '__main__':
    consume_messages()