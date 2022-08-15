import '../styles/global.css';
import React, {useState} from 'react';
import propTypes from 'prop-types';
import LoginService from '../services/LoginService';

/* LOGIN IS A PAGE FOR GETTING USERNAME + PASSWORD TO AUTHENTICATE */
export default function Login({setToken}) {
  // Services/Controllers
  const loginService = new LoginService();

  // States and effects, for input box (0 for normal, -1 for wrong, -2 for invalid)
  const [usernameInputBoxValid, setUsernameInputBoxValid] = useState(0);
  const [passwordInputBoxValid, setPasswordInputBoxValid] = useState(0); 
  const [Uname, setUname] = useState('');
  const [Pword, setPword] = useState('');


  // Login form submission event handle when login button clicked
  const handlesubmitLogin = async e => {
    e.preventDefault();

    // If both inputs ok, API POST request to server to obtain token of authentication
    if(loginService.usernameValid(Uname) && loginService.passwordValid(Pword)){
      const newtoken = await loginService.loginUser({Uname, Pword});

      // If undefined token returns, they enterred wrong username or password. Clear session
      if(JSON.stringify(newtoken.token) === undefined){
        setUsernameInputBoxValid(-1);
        setPasswordInputBoxValid(-1);
        sessionStorage.clear();
      }
      setToken(newtoken);
    }else{
      // If one of the inputs has problems, find the problem and change that input state by setting
      if(loginService.usernameValid(Uname)){
        setUsernameInputBoxValid(0);
      }else{
        setUsernameInputBoxValid(-2);
      }
      if(loginService.passwordValid(Pword)){
        setPasswordInputBoxValid(0);
      }else{
        setPasswordInputBoxValid(-2);
      }
    }
  }

  // JSX
  return (
    <div className="page">
      <form className="pane" onSubmit={handlesubmitLogin} id='loginform'>
        <div className='hearticon'></div>
        <h1>Task Management System</h1>
        <h2 className={usernameInputBoxValid===0? 'normallabel' : 'invalidlabel'}>{usernameInputBoxValid===-1? 'Wrong inputs/disabled account' : 'Good day yall'}</h2>
        <h2>Please sign into your account</h2>
        <label className={usernameInputBoxValid===0? 'normallabel' : 'invalidlabel'}>{usernameInputBoxValid===-1? 'Wrong Username or Password' : (usernameInputBoxValid===-2? 'Username cannot be blank' : 'Username:')}</label>
        <input className={usernameInputBoxValid===0? 'normalinputbox' : 'invalidinputbox'} type="text" onChange={(e)=>{setUname(e.target.value)}} placeholder="Username here please: "/>
        <label className={passwordInputBoxValid===0? 'normallabel' : 'invalidlabel'}>{passwordInputBoxValid===-1? 'Wrong Username or Password' : (passwordInputBoxValid===-2? 'Password cannot be blank' : 'Password:')}</label>
        <input className={passwordInputBoxValid===0? 'normalinputbox' : 'invalidinputbox'} type="password" onChange={(e)=>{setPword(e.target.value)}} placeholder="Password here please: "/>
        <div className='buttonset'>
            <button type='submit'>Login</button>
        </div>
      </form>
    </div>
  );
}

// Accept a token as prop parameter
Login.propTypes = {setToken: propTypes.func.isRequired}
