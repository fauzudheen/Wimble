#!/bin/sh

# Start the Django server in the background
python manage.py runserver 0.0.0.0:8002 &

# Start the Kafka consumer
python /app/backend/article_service/article_app/consumer.py
