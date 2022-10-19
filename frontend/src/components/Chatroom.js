import React, {useContext, useRef} from 'react'
import AuthContext from '../context/context'
import { useNavigate } from 'react-router-dom';

export default function Chatroom() {
  const navigate = useNavigate();
  const {JWTTokens, logoutUser, user} = useContext(AuthContext)
  let roomname = window.location.pathname.split('/')[2];
  let hostname = '127.0.0.1:8000';
  let token = JWTTokens.access
  let wsURL = 'ws://'+hostname+'/ws/chat/'+roomname+'/?token='+token
  
  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // react states
  let [socket, setSocket] = React.useState(null)
  let [messages, setMessages] = React.useState([])

  React.useEffect(()=>{
  
    let chatSocket = new WebSocket(wsURL);
    setSocket(chatSocket)
    chatSocket.onmessage = function (e) {
      const data = JSON.parse(e.data)
      if (data.message_type === 'old_data') {
        // data.message.reverse()
        for (let i of data.message) {
          setMessages(prevState => prevState.concat([i]))
        }
      } else {
        setMessages(prevState => prevState.concat([data]))
      }
    }
  }, [])
  
  function sendMessage(e) {
    if (e.key === 'Enter') {
      if(socket !== null) {
        // SOCKET is ready
        socket.send(JSON.stringify({
          'type' : 'new_message',
          'message' : e.target.value,
        }))
      }
      e.target.value = ''
    }
  }

  function handleLeave(e) {
    if(socket !== null) {
      socket.close();
    }
    if (e.target.className === 'Back_button') {
      navigate('/lobby');
    } else if (e.target.className === 'logout_button') {
      logoutUser()
    }
  }

  return (
    <div className='chatroom_home'>
      <button className='Back_button' onClick={handleLeave}>
        Back
      </button>
      <button className='logout_button' onClick={handleLeave}>
        Log Out
      </button>
      <div className='chatroom_title'>
        Welcome to {roomname} chat room
      </div>
      <div className='chatroom_main'>

        <div className='chat_window'>
          { messages.map((element, index) => {
            let date = new Date(element.timestamp);
            date = date.toLocaleString('en-GB', { timeZone: 'America/Los_Angeles' })
            return(
              element.message_type === "joined_chat" ?
                <div className='joined_messages' key={index}>
                  {element.message}
                </div>
                :
                <div style={{width:'80%'}}key={index} >
                  {element.username === user.username ?
                      <div className='my_message'>
                        Me: <p className='message'>{element.message}</p>
                        <div className='message_date'>
                          {date}
                        </div>
                      </div>
                    :
                      <div className='others_message'>
                        {element.firstname}: <p className='message'>{element.message}</p>
                        <div className='message_date'>
                          {date}
                        </div>
                      </div>
                  }
                  {scrollToBottom()}
                </div>
            )  
          })}
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <div ref={messagesEndRef} />
        </div>

        <input className='typing' placeholder='Type Here!' onKeyDown={sendMessage}>
        </input>

      </div>
    </div>
  )
}
