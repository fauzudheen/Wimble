import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from chat import routing as chat_routing
from notification import routing as notification_routing
from .middleware import JWTAuthMiddleware

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "communication_service.settings")

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": AuthMiddlewareStack(
            JWTAuthMiddleware(
                URLRouter(
                    chat_routing.websocket_urlpatterns + notification_routing.websocket_urlpatterns
                )
            )
        ),
    } 
)