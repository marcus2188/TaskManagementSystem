import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import Welcome from './components/Welcome';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from "./components/Login";
import Usermain from './components/Usermain';
import Updateprofile from './components/Updateprofile';
import Register from './components/Register';
import Usermanagement from './components/Usermanagement';
import LoginService from './services/LoginService';
import EditAccount from './components/EditAccount';
import Groupmanagement from './components/Groupmanagement';

// Renders the start container defined
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Start />
);

// start container function
function Start(){
  // Service
  const loginService = new LoginService();

  // Check for authentication token, if don't have push login component on top of the default route /
  const {token, setToken} = loginService.useToken();
  if(!token){
    return(
      <Login setToken={setToken}/>
    );
  }

  // JSX for managing all routes, main container after user logged in
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />}/>
        <Route path=":enteredUsername" element={<Usermain />}/>
        <Route path=":enteredUsername/updateprofile" element={<Updateprofile />}/>
        <Route path=":enteredUsername/groupmanagement" element={<Groupmanagement />}/>
        <Route path=":enteredUsername/usermanagement" element={<Usermanagement />}/>
        <Route path=":enteredUsername/usermanagement/adduser" element={<Register />}/>
        <Route path=":enteredUsername/usermanagement/:selectedaccount" element={<EditAccount />}/>
      </Routes>
    </Router>
  );
}
reportWebVitals();
