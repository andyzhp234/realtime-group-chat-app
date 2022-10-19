from channels.db import database_sync_to_async
from django.db import close_old_connections
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model
from urllib.parse import parse_qs
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from jwt import decode as jwt_decode
import os
from dotenv import load_dotenv

load_dotenv()

@database_sync_to_async
def get_user(validated_token):
    try:
      user = get_user_model().objects.get(id=validated_token["user_id"])
      return user
    except:
        return AnonymousUser()

class JwtAuthMiddleware:
    """
    Custom middleware (insecure) that takes user IDs from the query string.
    """

    def __init__(self, app):
        # Store the ASGI application we were passed
        self.app = app

    async def __call__(self, scope, receive, send):
        # Close old database connections to prevent usage of timed out connections
        close_old_connections()

        # Get the token
        token = parse_qs(scope["query_string"].decode("utf8"))["token"][0]
        
        # try authenticate the user
        try:
          UntypedToken(token)
        except (InvalidToken, TokenError) as error:
          #invalid token
          print(error)
          # return as AnonymousUser since user can't be verify
          scope['user'] = AnonymousUser()
          return await self.app(scope, receive, send)
        else:
          #valid token
          decoded_data = jwt_decode(token, os.getenv('SECRET_KEY'), algorithms=["HS256"])
          scope['user'] = await get_user(validated_token=decoded_data)
          return await self.app(scope, receive, send)