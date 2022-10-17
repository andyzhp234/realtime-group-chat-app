# realtime-group-chat-app


# Project Specifications
(1) Real Live Chat <br />
(2) User Registration <br />
(3) Track Conversations and Users in Chat <br />
(4) Record / Save conversations <br />
(5) Delete / Edit message <br />
(6) More... <br />


# Web Sockets
(1) Needs to utilitze web socket for real time application <br />
(2) Web protocal running over TCP <br />
(3) Allows us to create a asyn environment <br />
(4) Bi-directional (where HTTP is one-directional). Server and client can send message at the same time. <br />
(5) Socket is full-duplex <br />

# About the Program
(1) We need to use both WSGI and ASGI <br />
(2) WSGI for static pages <br />
(3) ASGI for asyn data reading and sending <br />



# Authentication Process
Client Sign in <br />
sends API request to get access token and refresh token <br />
use access token to access Websocket <br />
open connection with websocket <br />
Access token will expire in 5 min <br />
Frontend needs to send refresh token every 4 min (Needs to anticipate in Network Delay and etc delay) <br />
Websocket should temperarly check in anyone in the websocket has expired token, and if so, kick them out. <br />
