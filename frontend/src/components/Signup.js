import React from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Signup() {
  const navigate = useNavigate();
  let [form, setForm] = React.useState({
    'username' : '',
    'password' : '',
    'first_name' : '',
    'last_name' : '',
  })

  function handleChange(e) {
    const { name, value } = e.target;
    const oldForm = form;
    oldForm[name] = value
    setForm(oldForm)
  }

  function handleSignup(e) {
    e.preventDefault();
    
    if (form['username'] === '') {
      window.alert('MISSING username!')
    } else if (form['password'] === '') {
      window.alert('MISSING password!')
    } else if (form['first_name'] === '') {
      window.alert('MISSING First Name!')
    } else if (form['last_name'] === '') {
      window.alert('MISSING Last Name!')
    } else {
      // axios.post('http://127.0.0.1:8000/api/signup/', form)
      axios.post('https://realtime-group-chat-andyzhp.herokuapp.com/api/signup/', form)
        .then(function (response) {
          // handle success
          navigate('/');
        })
        .catch(function (error) {
          // handle error
          alert('ERROR: SIGNUP FAILED!')
        })
    }
  }
  return (
    <div className='login_background'>
      <form className='login_container' onSubmit={handleSignup}>
        <div className='login'>
          <p>SIGN UP</p>
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

          <div className='username_box'>
            <label htmlFor="username">
              First Name
            </label>
            <input 
              placeholder='first_name'
              type="text"
              name="first_name"
              onChange={handleChange}
            />
          </div>

          <div className='username_box'>
            <label htmlFor="username">
              Last Name
            </label>
            <input 
              placeholder='last_name'
              type="text"
              name="last_name"
              onChange={handleChange}
            />
          </div>


          <button type="submit" className='login_button'>
            Sign Up
          </button>

        </div>
        <div className='login_img'></div>
      </form>
    </div>
  )
}
