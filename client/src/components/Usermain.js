import '../styles/Usermain.css';
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import QueryService from '../services/QueryService';
import LoginService from '../services/LoginService';

/* USERMAIN IS THE MAIN MENU FOR THE PERSON LOGGED IN WITH ALL OPTIONS */
export default function Usermain() {
  // Services
  const loginService = new LoginService();
  const queryService = new QueryService();

  // States and effects
  React.useEffect(() => {
    checkGroup();
  }, [])
  const [userGroups, setUserGroups] = useState([]);

  // Navigation hook and functions
  const navigate = useNavigate();
  const gotoupdateprofile = () => {
    navigate("updateprofile");
  }
  const gobacktowelcome = () => {
    navigate(-1);
  }
  const gotousermanagement = () => {
    navigate("usermanagement");
  }
  const gotogroupmanagement = () => {
    navigate("groupmanagement");
  }

  // Special hooked function to return access group array of strings for the current person logged in
  const checkGroup = async e => {
    const accountobj = await queryService.checkAccessLevel({username: JSON.parse(sessionStorage.getItem('token')).token.username});
    setUserGroups(accountobj.accessGroups);
  }

  // JSX with its own css by same name
  return (
    <div className="page">
      <div className='pane'>
        <h1>Task Management System</h1>
        <h2>Logged into {JSON.parse(sessionStorage.getItem('token')).token.username} !</h2>
        <h2>You are {userGroups.map((gg) => {return(gg+', ')})}</h2>
        <div className='buttonset'>
          <div className='col1'>
            {userGroups.includes('admin')? <button onClick={gotousermanagement}>User Management</button> : <></>}
            {userGroups.includes('admin')? <button onClick={gotogroupmanagement}>Group Management</button> : <></>}
          </div>
          <div className='col2'>
            <button onClick={gobacktowelcome}>Back</button>
            <button onClick={gotoupdateprofile}>Update Profile</button>
          </div>
          <div className='col3'>
            <button onClick={() => {navigate('/'); loginService.logoutUser();}}>Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}