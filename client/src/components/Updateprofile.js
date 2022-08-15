import '../styles/global.css';
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import LoginService from '../services/LoginService';

/* UPDATEPROFILE LETS YOU CHANGE AND SET THE USERNAME, PASSWORD AND EMAIL OF THE CURRENT ACCOUNT */
export default function Updateprofile() {
  // Services
  const loginService = new LoginService();

  // Navigation hooks and functions
  const navigate = useNavigate();
  const gobacktousermain = () => {
    navigate(-1);
  }

  // States for every input and their validity, 0 for normal, -1 for invalid, 1 for acceptable
  const [pInputValid, setPInputValid] = useState(0);
  const [eInputValid, setEInputValid] = useState(0);

  // States for value
  const [PwordU, setPwordU] = useState('');
  const [EmailU, setEmailU] = useState('');

  // States for account update status, 0 for normal, -1 for error for invalidity, 1 for successful
  const[updateSuccess, setUpdateSuccess] = useState(0);

  // Handle updateform submit event, check all inputs are valid, then check if all inputs acceptable, then set
  const handlesubmitUpdateProfile = async e => {
    e.preventDefault();
    if(loginService.passwordValid(PwordU) && loginService.emailValid(EmailU)){
      if(loginService.passwordAcceptable(PwordU) && loginService.emailAcceptable(EmailU)){
        setUpdateSuccess(1);
        setPwordU('');
        setEmailU('');
        await loginService.updateAccount({username: JSON.parse(sessionStorage.getItem('token')).token.username, password: PwordU, email: EmailU});
      }
    }
    if(loginService.passwordValid(PwordU)===false || loginService.passwordAcceptable(PwordU)===false){
      setPInputValid(-1);
      setUpdateSuccess(-1);
    }
    if(loginService.emailValid(EmailU)===false || loginService.emailAcceptable(EmailU)===false){
      setEInputValid(-1);
      setUpdateSuccess(-1);
    }
  }

  // Live check inputs of password and email to show acceptable css
  React.useEffect(() => {
    if(loginService.passwordAcceptable(PwordU)){
      setPInputValid(1);
    }else{
      setPInputValid(0);
    }
    if(loginService.emailAcceptable(EmailU)){
      setEInputValid(1);
    }else{
      setEInputValid(0);
    }
  }, [PwordU, EmailU]);

  // JSX
  return (
    <div className="page">
      <form className="pane" id='registerform' onSubmit={handlesubmitUpdateProfile}>
        <h1>Task Management System</h1>
        <h2>Update your account</h2>
        <h2>Username: {JSON.parse(sessionStorage.getItem('token')).token.username}</h2>
        <h2 className={updateSuccess===1? 'acceptedlabel' : (updateSuccess===-1? 'invalidlabel' : 'normallabel')}>{updateSuccess===1? 'Successfully updated account' : (updateSuccess===0? 'Type till acceptable' : 'Unable to update, please rectify')}</h2>
        <label className={pInputValid===0? 'normallabel' : (pInputValid===1? 'acceptedlabel' : 'invalidlabel')}>{pInputValid===0? 'Password:' : (pInputValid===1? 'Acceptable Password' : 'Password must be alphanumeric with symbols length 8 to 10')}</label>
        <input className={pInputValid===0? 'normalinputbox' : (pInputValid===1? 'acceptedinputbox' : 'invalidinputbox')} type="password" onChange={(e)=>{setPwordU(e.target.value)}} value={PwordU || ''}/>
        <label className={eInputValid===0? 'normallabel' : (eInputValid===1? 'acceptedlabel' : 'invalidlabel')}>{eInputValid===0? 'Email:' : (eInputValid===1? 'Acceptable Email' : 'Email must follow format X@Y.ZZ')}</label>
        <input className={eInputValid===0? 'normalinputbox' : (eInputValid===1? 'acceptedinputbox' : 'invalidinputbox')} type="text" onChange={(e)=>{setEmailU(e.target.value)}} value={EmailU || ''}/>
        <div className='buttonset'>
            <button type='submit'>Update</button>
            <button onClick={gobacktousermain}>Back</button>
        </div>
      </form>
    </div>
    
  );
}
