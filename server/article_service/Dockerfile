FROM python:3.11-slim-bullseye

RUN pip install --no-cache-dir --upgrade pip

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY requirements.txt /app/

RUN pip install -r requirements.txt

COPY . /app/

EXPOSE 8002

CMD python manage.py migrate & python manage.py collectstatic --noinput & python manage.py runserver 0.0.0.0:8002 & python /app/article_app/consumer.py