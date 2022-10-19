from django.urls import re_path
from . import consumers

# routing specially for socket connections
# \w+ in regular express means one or more word character
# ?P<room_name> provides kwargs (keyword variable) so we can access in Consumer
# needs as_asgi() otherwise object can't be used in await expression
websocket_urlpatterns = [
  re_path(r'ws/chat/(?P<room_name>\w+)/$', consumers.ChatRoomConsumer.as_asgi())
]



