import React from 'react'
import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';

import PrivateRoute from '../utils/PrivateRoute';
import {AuthProvider} from '../context/context';

import Login from './Login';
import Signup from './Signup';
import Lobby from './Lobby';
import Chatroom from './Chatroom'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route 
              path="/lobby"
              element={
                <PrivateRoute>
                  <Lobby />
                </PrivateRoute>
              }
            />
            
            <Route path="/lobby/*"
              element={
                <PrivateRoute>
                  <Chatroom />
                </PrivateRoute>
              }
            />
    
        </Routes>
      </AuthProvider>
    </BrowserRouter >
  )
}

