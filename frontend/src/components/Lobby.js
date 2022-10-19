import React, {useContext}from 'react'
import AuthContext from '../context/context'
import { useNavigate } from 'react-router-dom';

export default function Lobby() {
  const navigate = useNavigate();
  const {logoutUser} = useContext(AuthContext)
  return (
    <div className='lobby_home'>
      <div className='lobby'>
        <button className='logout_button' onClick={logoutUser}>
          Log Out
        </button>
  
        <div className='room' onClick={() => navigate('/lobby/game')}>
          GAME CHAT ROOM
        </div>

        <div className='room1' onClick={() => navigate('/lobby/study')}>
          STUDY CHAT ROOM
        </div>
        <div className='room2' onClick={() => navigate('/lobby/movie')}>
          MOVIE CHAT ROOM
        </div>
        <div className='room3' onClick={() => navigate('/lobby/music')}>
          MUSIC CHAT ROOM
        </div>
      </div>
    </div>
  )
}
