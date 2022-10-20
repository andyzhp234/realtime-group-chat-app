import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from .models import Message
from channels.db import database_sync_to_async
from datetime import datetime
from pytz import timezone, utc


# why channel? Django itself don't support websocket, needs to use channel library

# Channels + WebSockets together to achieve two way communications
# and open connection between clients and server
# websocket for client side to init the connection
# channels on the server side to receive and send requests back to client.
# consumers == channel's django view

class ChatRoomConsumer(AsyncWebsocketConsumer):  
  async def connect(self):
    # a connection is made    
    self.room_name = self.scope['url_route']['kwargs']['room_name']
    self.room_group_name = 'chat_' + self.room_name
    
    # add this channel to the group
    await self.channel_layer.group_add(
      self.room_group_name,
      self.channel_name
    )

    # reject user that is not authenticated
    if self.scope["user"] == AnonymousUser():
      await self.close()
    else:
      # needs to wait for TCP accept the connection (handshake)
      await self.accept()
      
      # after connection is set, pull up the most recent 10 message
      message = await self.fetch_message()
      message.reverse()
      await self.send_message({
        "message" : message,
        "firstname" : "old Data",
        "username" : "old Data",
        "message_type" : "old_data",
        "timestamp" : str(self.get_pst_time()),
      })
      
      # after TCP connection is set, we can send infos to Clients
      await self.send_group_message({
        "message" : self.scope["user"].first_name + " joined the chat",
        "firstname" : self.scope["user"].first_name,
        "username" : self.scope["user"].username,
        "message_type" : "joined_chat",
        "timestamp" : str(self.get_pst_time()),
      })

  def get_pst_time(self):
    date_format='%Y-%m-%d %H:%M:%S'
    date = datetime.now(tz=utc)
    date = date.astimezone(timezone('US/Pacific'))
    pstDateTime=date.strftime(date_format)
    return pstDateTime

  @database_sync_to_async
  def fetch_message(self):
    message = Message.objects.order_by('-timestamp').filter(chatRoom=self.room_group_name)[:10]
    message = self.messages_serializer(message)
    return message


  def messages_serializer(self, messages):
    result = []
    for message in messages:
        result.append(self.message_serializer(message))
    return result

  
  def message_serializer(self, message):
    return {
          'id': message.id,
          'message_type': 'old_data',
          'chatRoom' : message.chatRoom, 
          'firstname': message.firstname,
          'username' : message.username,
          'message': message.content,
          'icons': message.icons,
          'timestamp': str(message.timestamp),
    }


  async def disconnect(self, close_code):
    # after TCP connection is set, we can send infos to Clients
    await self.send_group_message({
      "message" : self.scope["user"].first_name + " leaved the chat",
      "firstname" : self.scope["user"].first_name,
      "username" : self.scope["user"].username,
      "message_type" : "joined_chat",
      "timestamp" : str(self.get_pst_time()),
    })
    await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

  
  @database_sync_to_async
  def saveMessage(self, data):
    Message.objects.create(
      firstname=self.scope["user"].first_name,
      username=self.scope["user"].username,
      content=data,
      chatRoom=self.room_group_name,
      timestamp=str(self.get_pst_time()),
    )

  async def new_message(self, data):
    # whenever we received a new message,
    # we will store this new message
    await self.saveMessage(data)


    # and we will broadcast this message
    # the message we send needs to contain
    # 1. the content
    # 2. sender's first_name
    # 3. sender's icons (optional)
    await self.send_group_message({
      "message" : data,
      "firstname" : self.scope["user"].first_name,
      "username" : self.scope["user"].username,
      "message_type" : 'chat',
      "timestamp" : str(self.get_pst_time()),
    })


  commands = {
    'new_message' : new_message,
    # 'fetch_message' : fetch_message,
  }



  async def receive(self, text_data):
    text_data_json = json.loads(text_data)
    message = text_data_json['message']
    message_type = text_data_json['type']
    await self.commands[message_type](self, message)
    


  async def send_group_message(self, event):
    message = event['message']
    firstname = event['firstname']
    username = event['username']
    message_type = event['message_type']
    timestamp = event['timestamp']
    await self.channel_layer.group_send(
      self.room_group_name,
      {
        'type' : 'send_message',
        'message' : message,
        'firstname' : firstname,
        'username' : username,
        'message_type' : message_type,
        'timestamp' : timestamp,
      }
    )


  async def send_message (self, event):
    message = event['message']
    firstname = event['firstname']
    username = event['username']
    message_type = event['message_type']
    timestamp = event['timestamp']
    await self.send(text_data=json.dumps({
      'message_type' : message_type,
      'message' : message,
      'firstname' : firstname,
      'username' : username,
      'timestamp' : str(timestamp),
    }))
