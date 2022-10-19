# channels is basically the websocket library provided by django
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import chat.routing

from django.core.asgi import get_asgi_application
from .channelsmiddleware import JwtAuthMiddleware
django_asgi_app = get_asgi_application()

# when we got a WSGI request, this is where we route it to
application = ProtocolTypeRouter({
  "http": django_asgi_app,
  # 'websocket' : AuthMiddlewareStack(
  'websocket' : JwtAuthMiddleware(
      URLRouter(
        chat.routing.websocket_urlpatterns  
      )
   ),
})
