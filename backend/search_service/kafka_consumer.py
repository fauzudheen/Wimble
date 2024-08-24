import json
from confluent_kafka import Consumer, KafkaError
import django
import os
import sys

parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_dir)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'search_service.settings')
django.setup()

#The following lines should be below django.setup(), otherwise it will not work
#You need to ensure that Django is properly configured before importing any Django models or apps


consumer = Consumer({
    'bootstrap.servers': 'kafka:9092',
    'group.id': 'search_service_group',
    'auto.offset.reset': 'earliest'
})

consumer.subscribe([
    'users', 'users-deleted', 
    'teams', 'teams-deleted',
    'articles', 'articles-deleted',
                    ])

def consume_messages():
    try:
        print("-----------------Search service Consuming messages...-----------------")
        while True:
            msg = consumer.poll(1.0)
            if msg is None:
                continue

            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    print('End of partition reached {0}/{1}'.format(msg.topic(), msg.partition()))
                else:
                    print('Error occurred: {0}'.format(msg.error().str()))
            else:
                try:
                    topic = msg.topic()
                    message_data = json.loads(msg.value().decode('utf-8'))
                    print(f"Received message: {message_data}")
                    print(f"Topic: {topic}")
                    print(f"Message: {msg}")
                    
                except json.JSONDecodeError as e:
                    print(f"JSON decode error: {e}")
                except Exception as e:
                    print(f"Error processing message: {e}")

    except Exception as e:
        print(f"Unexpected error: {e}") 
    finally:
        consumer.close()


if __name__ == '__main__':
    consume_messages()