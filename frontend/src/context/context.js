import React, {createContext} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";

const AuthContext = createContext({});


export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  let [loading, setLoading] = React.useState(true)
  const [JWTTokens, setJWTTokens] = React.useState(()=> localStorage.getItem('JWTTokens')?
    JSON.parse(localStorage.getItem('JWTTokens')) : null)
  
  const [user, setUser] = React.useState(()=> localStorage.getItem('JWTTokens')?
    jwt_decode(JSON.parse(localStorage.getItem('JWTTokens')).access) : null)
  
  const handleLogin = (form) => {
    // axios.post('http://127.0.0.1:8000/api/token/', form)
    axios.post('https://realtime-group-chat-andyzhp.herokuapp.com/api/token/', form)
      .then(function (response) {
        // handle success
        setJWTTokens(response.data)
        setUser(jwt_decode(response.data.access))
        localStorage.setItem('JWTTokens', JSON.stringify(response.data))
        navigate('/lobby')
      })
      .catch(function (error) {
        // handle error
        alert('ERROR: LOGIN FAILED!')
      })
  }


  const logoutUser = () => {
    setJWTTokens(null)
    setUser(null)
    localStorage.removeItem('JWTTokens')
    navigate('/')
  }

  const updateToken = () => {
    let refresh = JWTTokens;
    // if for some reason when we refresh
    // the page, the user has logged out
    // we will logout again. To ensure Robustness
    if (refresh === null) {
      logoutUser();
      return;
    }
    // axios.post('http://127.0.0.1:8000/api/token/refresh/', {
    axios.post('https://realtime-group-chat-andyzhp.herokuapp.com/api/token/refresh/', {
      "refresh": refresh.refresh
    })
      .then(function (response) {
        // handle success
        setJWTTokens(response.data)
        setUser(jwt_decode(response.data.access))
        localStorage.setItem('JWTTokens', JSON.stringify(response.data))
      })
      .catch(function (error) {
        // handle error
        logoutUser();
      })
    
    setLoading(false)
  }


  let contextData = {
    user:user,
    JWTTokens:JWTTokens,
    handleLogin:handleLogin,
    logoutUser:logoutUser,
  }

  // call useEffect when loading status changes
  // also calls when JWTTokens changes
  React.useEffect(()=> {
      if(loading){
          updateToken()
      }
      let fourMin = 1000 * 60 * 4
      let interval =  setInterval(()=> {
          if(JWTTokens){
              updateToken()
          }
      }, fourMin)
      return ()=> clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JWTTokens, loading])

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext

