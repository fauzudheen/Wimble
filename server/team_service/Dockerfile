FROM python:3.11-slim-bullseye

RUN pip install --no-cache-dir --upgrade pip

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY requirements.txt /app/

RUN pip install -r requirements.txt

COPY . /app/

EXPOSE 8004

CMD python manage.py migrate & python manage.py collectstatic --noinput & python manage.py runserver 0.0.0.0:8004 & python /app/team_app/consumer.py