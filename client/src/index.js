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
import Taskmanagement from './components/Taskmanagement';
import Task from './components/Task';
import AddTask from './components/Addtask';
import Applications from './components/Applications';
import AddApp from './components/Addapp';
import AddPlan from './components/Addplan';

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
        <Route path=":enteredUsername" element={<Usermain />}/>
        <Route path=":enteredUsername/updateprofile" element={<Updateprofile />}/>
        <Route path=":enteredUsername/groupmanagement" element={<Groupmanagement />}/>
        <Route path=":enteredUsername/usermanagement" element={<Usermanagement />}/>
        <Route path=":enteredUsername/usermanagement/adduser" element={<Register />}/>
        <Route path=":enteredUsername/usermanagement/:selectedaccount" element={<EditAccount />}/>
        <Route path=":enteredUsername/taskmanagement" element={<Taskmanagement />}/>
        <Route path="/" element={<Welcome />}/>
        <Route path=":enteredUsername/taskmanagement/:specifictask" element={<Task />}/>
        <Route path=":enteredUsername/taskmanagement/applications/addtask" element={<AddTask/>}/>
        <Route path=":enteredUsername/taskmanagement/applications" element={<Applications/>}/>
        <Route path=":enteredUsername/taskmanagement/applications/addapp" element={<AddApp/>}/>
        <Route path=":enteredUsername/taskmanagement/applications/addplan" element={<AddPlan/>}/>
      </Routes>
    </Router>
  );
}
reportWebVitals();
