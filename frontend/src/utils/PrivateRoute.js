import React, {useContext} from 'react'
import AuthContext from '../context/context'
import Login from '../components/Login';

const PrivateRoute = ({children}) => {
  const {user} = useContext(AuthContext)
  // if logged in
  if (user !== null) {
    return children
  }
  return <Login />
}

export default PrivateRoute;