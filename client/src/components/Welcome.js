import '../styles/global.css';
import {useNavigate} from 'react-router-dom';
import LoginService from '../services/LoginService';

/* WELCOME IS THE LANDING PAGE FOR SUCCESSFUL LOGIN AUTHENTICATION */
export default function Welcome() {
  // Services
  const loginService = new LoginService();

  // navigation hooks and functions
  const navigate = useNavigate();
  const gotousermain = () =>{
    navigate(`/${JSON.parse(sessionStorage.getItem('token')).token.username}`);
  }

  // JSX
  return (
    <div className="page">
      <div className='pane'>
        <h1>Task Management System</h1>
        <h2>A reactjs SPA C.R.U.D demo</h2>
        <h2>Welcome, {JSON.parse(sessionStorage.getItem('token')).token.username} !</h2>
        <div className='buttonset'>
          <button onClick={gotousermain}>Enter</button>
          <button onClick={loginService.logoutUser}>Logout</button>
        </div>
      </div>
    </div>
  );
}
