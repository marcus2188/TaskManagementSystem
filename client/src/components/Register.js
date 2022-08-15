import React, {useState} from "react";
import LoginService from "../services/LoginService";
import '../styles/global.css';
import { useNavigate } from "react-router-dom";

/* REGISTER/ADDUSER IS A PAGE FOR ADMIN ACCOUNTS TO ADD NEW ACCOUNTS OF USERS/ADMINS */
export default function Register(){
    // Services
    const loginService = new LoginService();

    // Navigation hooks and functions
    const navigate = useNavigate();
    const gotousermanagement = () => {
        navigate(-1);
    }

    // States for every input and their validity, 0 for normal, -1 for invalid, 1 for acceptable, 2 for username already exist
    const [uInputValid, setUInputValid] = useState(0);
    const [pInputValid, setPInputValid] = useState(0);
    const [eInputValid, setEInputValid] = useState(0);

    // states for value
    const [UnameR, setUnameR] = useState('');
    const [PwordR, setPwordR] = useState('');
    const [EmailR, setEmailR] = useState('');

    // States for add user process status, 0 for normal, -1 for error for invalidity, 1 for successful
    const[registerSuccess, setRegisterSuccess] = useState(0);

    // Handle registerform submit event, check all inputs are valid, then check if all inputs acceptable, then set
    const handlesubmitRegister = async e => {
        e.preventDefault();
        if(loginService.usernameValid(UnameR) && loginService.passwordValid(PwordR) && loginService.emailValid(EmailR)){
            if(loginService.usernameAcceptable(UnameR) && loginService.passwordAcceptable(PwordR) && loginService.emailAcceptable(EmailR)){
                setRegisterSuccess(1);
                const regobj = await loginService.registerUser({UnameR, PwordR, EmailR});

                // If nothing is returned, means username already exists
                if(JSON.stringify(regobj) === "{}"){
                    setUInputValid(2);
                    setRegisterSuccess(-1);
                }else{
                    setUnameR('');
                    setPwordR('');
                    setEmailR('');
                }
            }
        }
        if(loginService.usernameValid(UnameR)===false || loginService.usernameAcceptable(UnameR)===false){
            setRegisterSuccess(-1);
            setUInputValid(-1);
        }
        if(loginService.passwordValid(PwordR)===false || loginService.passwordAcceptable(PwordR)===false){
            setRegisterSuccess(-1);
            setPInputValid(-1);
        }
        if(loginService.emailValid(EmailR)===false || loginService.emailAcceptable(EmailR)===false){
            setRegisterSuccess(-1);
            setEInputValid(-1);
        }
    }

    // Live check inputs of username password and email to show acceptable css
    React.useEffect(() => {
        if(loginService.usernameAcceptable(UnameR)){
            setUInputValid(1);
        }else{
            setUInputValid(0);
        }
        if(loginService.passwordAcceptable(PwordR)){
            setPInputValid(1);
        }else{
            setPInputValid(0);
        }
        if(loginService.emailAcceptable(EmailR)){
            setEInputValid(1);
        }else{
            setEInputValid(0);
        }
    }, [UnameR, PwordR, EmailR]);

    // JSX
    return (
        <div className="page">
            <form className='pane' id='registerform' onSubmit={handlesubmitRegister}>
                <h1>Task Management System</h1>
                <h2>Register/add a new user account</h2>
                <h2 className={registerSuccess===1? 'acceptedlabel' : (registerSuccess===0? 'normallabel' : 'invalidlabel')}>{registerSuccess===1? 'Congrats, account added' : (registerSuccess===-1? 'Unable to add, please rectify' : 'Type till acceptable')}</h2>
                <label className={uInputValid===0? 'normallabel' : (uInputValid===1? 'acceptedlabel' : 'invalidlabel')}>{uInputValid===0? 'Username: (More than 5 chars)' : (uInputValid===1? 'Acceptable Username' : uInputValid===2? 'Username already exists, sorry' : 'Username must be more than 5 chars')}</label>
                <input className={uInputValid===0? 'normalinputbox' : (uInputValid===1? 'acceptedinputbox' : 'invalidinputbox')} type="text" onChange={(e)=>{setUnameR(e.target.value)}} placeholder="Enter your username here: " value={UnameR || ''}/>
                <label className={pInputValid===0? 'normallabel' : (pInputValid===1? 'acceptedlabel' : 'invalidlabel')}>{pInputValid===0? 'Password: (Alphanumeric with symbols length 8 to 10)' : (pInputValid===1? 'Acceptable Password' : 'Password must be alphanumeric with symbols length 8 to 10')}</label>
                <input className={pInputValid===0? 'normalinputbox' : (pInputValid===1? 'acceptedinputbox' : 'invalidinputbox')} type="password" onChange={(e)=>{setPwordR(e.target.value)}} placeholder="Enter your password here: " value={PwordR || ''}/>
                <label className={eInputValid===0? 'normallabel' : (eInputValid===1? 'acceptedlabel' : 'invalidlabel')}>{eInputValid===0? 'Email: (Must follow X@Y.ZZ format)' : (eInputValid===1? 'Acceptable Email' : 'Email must be in format X@Y.ZZ')}</label>
                <input className={eInputValid===0? 'normalinputbox' : (eInputValid===1? 'acceptedinputbox' : 'invalidinputbox')} type="text" onChange={(e)=>{setEmailR(e.target.value)}} placeholder="Enter your email here: " value={EmailR || ''}/>
                <div className='buttonset-1line'>
                    <button onClick={gotousermanagement}>Back</button>
                    <button type='submit'>Add User</button>
                </div>
            </form> 
        </div>
    );
}