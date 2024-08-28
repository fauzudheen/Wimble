from django.apps import AppConfig
import nltk

class ArticleAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'article_app'

    def ready(self):
        nltk.download('stopwords')
