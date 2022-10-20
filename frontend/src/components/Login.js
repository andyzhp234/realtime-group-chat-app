import React, {useContext} from 'react'
import AuthContext from '../context/context'
import { useNavigate } from 'react-router-dom';

export default function Login() {
  // react context
  const {handleLogin} = useContext(AuthContext)
  const navigate = useNavigate();

  // react states
  let [form, setForm] = React.useState({
    'username' : '',
    'password' : '',
  })

  // handle form changes
  function handleChange(e) {
    const { name, value } = e.target;
    const oldForm = form;
    oldForm[name] = value;
    setForm(oldForm);
  }

  function submitLogin(e) {
    e.preventDefault();
    handleLogin(form);
  }

  function demoUserLogin(e) {
    e.preventDefault();
    handleLogin({
      'username' : 'demo',
      'password' : 'demo',
    });
  }


  return (
    <div className='login_background'>
      <form className='login_container' onSubmit={submitLogin}>
        <div className='login'>
          <p className='login_title'>Real Time Chat App</p>
          <p className="login_welcome">Welcome Back</p>

          <div className='username_box'>
            <label htmlFor="username">
              Username
            </label>
            <input
              placeholder='username'
              type="text"
              name="username"
              onChange={handleChange}
              
            />
          </div>

          <div className='username_box'>
            <label htmlFor="username">
              Password
            </label>
            <input 
              placeholder='password'
              type="password"
              name="password"
              onChange={handleChange}
            />
          </div>

          <button type="submit" className='login_button'>Login</button>

          <button type="button" className='login_button' onClick={demoUserLogin}>Demo User</button>
          
          <button type="button" className='login_button' onClick={() => navigate('/signup')}>
            Sign Up
          </button>

        </div>
        <div className='login_img'></div>
      </form>
    </div>
  )
}
