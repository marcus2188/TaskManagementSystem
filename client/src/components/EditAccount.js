import React, {useState} from "react";
import LoginService from "../services/LoginService";
import '../styles/EditAccount.css';
import { useLocation, useNavigate } from "react-router-dom";
import Select from 'react-select';
import QueryService from "../services/QueryService";

/* EDITACCOUNT IS A PAGE THAT ADMINS HAVE THAT EDITS OTHER ACCOUNT DETAILS */
export default function EditAccount(){
    // Services
    const loginService = new LoginService();
    const queryService = new QueryService();

    // Navigation hooks and functions
    const navigate = useNavigate();
    const location = useLocation();
    const gotousermanagement = () => {
        navigate(-1);
    }

    // States for every input and their validity, 0 for normal, -1 for invalid, 1 for acceptable, 2 for username already exist
    const [uInputValid, setUInputValid] = useState(0);
    const [pInputValid, setPInputValid] = useState(0);
    const [eInputValid, setEInputValid] = useState(0);

    // states for value
    const [referencedAccount, setReferencedAccount] = useState({username: '', password: '', email: '', accessGroups: [], status: -99});
    const [UnameE, setUnameE] = useState('');
    const [PwordE, setPwordE] = useState('');
    const [EmailE, setEmailE] = useState('');
    const [accessGroupsE, setAccessGroupsE] = useState([]);
    const [statusE, setStatusE] = useState(-99);

    // States for add user process status, 0 for normal, -1 for error for invalidity, 1 for successful
    const[editSuccess, setEditSuccess] = useState(0);
    const [allAccessGroups, setAllAccessGroups] = useState([]);

    // TODO: Constant variables, to be read from a config file 
    // const allAccessGroupsList = ['user', 'admin'];
    const allStatus = [0, 1];

    // Function async to retrieve all access groups in the db
    const getAllGroups = async () =>{
        const gdata = await queryService.getAllGroups({});
        const newlist = []
        gdata.forEach(g => {
            newlist.push(g.accessGroups);
        })
        setAllAccessGroups(newlist);
    }

    // Handle editform submission, allow blanks but check for acceptable inputs first. Decouple accessgroups and status objects from react-select
    const handlesubmitEdit = async e => {
        e.preventDefault();
        if((loginService.isBlank(UnameE) || loginService.usernameAcceptable(UnameE)) && (loginService.isBlank(PwordE) || loginService.passwordAcceptable(PwordE))
        && (loginService.isBlank(EmailE) || loginService.emailAcceptable(EmailE))){
            setEditSuccess(1);
            const regobj = await queryService.updateAccount({
                id: referencedAccount.id,
                username: loginService.isBlank(UnameE)? referencedAccount.username : UnameE,
                password: loginService.isBlank(PwordE)? undefined : PwordE,
                email: loginService.isBlank(EmailE)? referencedAccount.email : EmailE,
                accessGroups: accessGroupsE.length===0? referencedAccount.accessGroups : pipeTostringlist(accessGroupsE),
                status: statusE===-99? referencedAccount.status : statusE.value,
                oldusername: referencedAccount.username
            });
            
            // If nothing is returned, means username already exists, or they keyed in same username
            if(JSON.stringify(regobj) === "{}"){
                setUInputValid(2);
                setEditSuccess(-1);
            }else{
                setUnameE('');
                setPwordE('');
                setEmailE('');
                setAccessGroupsE([]);
                setStatusE(-99);
                gotousermanagement();
            }
        }
        if(loginService.isBlank(UnameE)===false && loginService.usernameAcceptable(UnameE)===false){
            setEditSuccess(-1);
            setUInputValid(-1);
        }
        if(loginService.isBlank(PwordE)===false && loginService.passwordAcceptable(PwordE)===false){
            setEditSuccess(-1);
            setPInputValid(-1);
        }
        if(loginService.isBlank(EmailE)===false && loginService.emailAcceptable(EmailE)===false){
            setEditSuccess(-1);
            setEInputValid(-1);
        }
    }

    // Live check inputs of username password and email to show acceptable css
    React.useEffect(() => {
        if(loginService.usernameAcceptable(UnameE)){
            setUInputValid(1);
        }else{
            setUInputValid(0);
        }
        if(loginService.passwordAcceptable(PwordE)){
            setPInputValid(1);
        }else{
            setPInputValid(0);
        }
        if(loginService.emailAcceptable(EmailE)){
            setEInputValid(1);
        }else{
            setEInputValid(0);
        }
    }, [UnameE, PwordE, EmailE]);

    // Function to get account detail asynchronously, by getting id from current route path
    const getAccount = async () => {
        const currentidstr = location.pathname.substring(location.pathname.indexOf('=') + 1)
        const accdata = await queryService.getAccountDetails({id: parseInt(currentidstr)});
        setReferencedAccount(accdata);
    }

    // Routeguard function
    const routeguard = async () => {
        const account = await queryService.checkAccessLevel({username: JSON.parse(sessionStorage.getItem('token')).token.username});
        if(!account.accessGroups.includes('admin')){
            navigate('/');
        }
    }

    // Call these on component startup
    React.useEffect(() => {
        routeguard();
        getAccount();
        getAllGroups();
    }, [])

    // Functions to convert list of accessgroup strings into react-select option objects list, viceversa
    const pipeToOptions = (mylist) => {
        const newlist = [];
        mylist.forEach(acc => {
            newlist.push({value: acc, label: acc});
        });
        return newlist;
    }
    const pipeTostringlist = (mylist) => {
        const newlist = [];
        mylist.forEach(acc => {
            newlist.push(acc.value);
        });
        return newlist;
    }


    // Functions to retrieve react-select values
    const getSelectAccessGroupValues = (vals) => {
        setAccessGroupsE(vals);
    }
    const getSelectStatusValues = (vals) => {
        setStatusE(vals);
    }

    // JSX
    return (
        <div className="page">
            <form className='pane' id='editform' onSubmit={handlesubmitEdit}>
                <h1>Task Management System</h1>
                <h2>Edit Account Details</h2>
                <h2>Leave empty if unchanged</h2>
                <h2 className={editSuccess===1? 'acceptedlabel' : (editSuccess===0? 'normallabel' : 'invalidlabel')}>{editSuccess===1? 'Congrats, account updated' : (editSuccess===-1? 'Unable to add, please rectify' : 'Type till acceptable')}</h2>
                <div className="hstack">
                    <div className="currentside">
                        <label>Username:</label>
                        <label>{referencedAccount.username}</label>
                        <label>PasswordHashed:</label>
                        <label>{referencedAccount.password.slice(0, 15)}</label>
                        <label>Email:</label>
                        <label>{referencedAccount.email}</label>
                        <label>AccessGroups:</label>
                        <label>{referencedAccount.accessGroups.join(', ')}</label>
                        <label>Status:</label>
                        <label>{referencedAccount.status}</label>
                    </div>
                    <div className="editside">
                        <label className={uInputValid===0? 'normallabel' : (uInputValid===1? 'acceptedlabel' : 'invalidlabel')}>{uInputValid===0? 'Username:' : (uInputValid===1? 'Acceptable Username' : uInputValid===2? 'Username already exists, sorry' : 'Username must be more than 5 chars')}</label>
                        <input className={uInputValid===0? 'normalinputbox' : (uInputValid===1? 'acceptedinputbox' : 'invalidinputbox')} type="text" onChange={(e)=>{setUnameE(e.target.value)}} placeholder="Leave empty if unchanged: " value={UnameE || ''}/>
                        <label className={pInputValid===0? 'normallabel' : (pInputValid===1? 'acceptedlabel' : 'invalidlabel')}>{pInputValid===0? 'Password:' : (pInputValid===1? 'Acceptable Password' : 'Password must be alphanumeric with symbols length 8 to 10')}</label>
                        <input className={pInputValid===0? 'normalinputbox' : (pInputValid===1? 'acceptedinputbox' : 'invalidinputbox')} type="password" onChange={(e)=>{setPwordE(e.target.value)}} placeholder="Leave empty if unchanged: " value={PwordE || ''}/>
                        <label className={eInputValid===0? 'normallabel' : (eInputValid===1? 'acceptedlabel' : 'invalidlabel')}>{eInputValid===0? 'Email:' : (eInputValid===1? 'Acceptable Email' : 'Email must be in format X@Y.ZZ')}</label>
                        <input className={eInputValid===0? 'normalinputbox' : (eInputValid===1? 'acceptedinputbox' : 'invalidinputbox')} type="text" onChange={(e)=>{setEmailE(e.target.value)}} placeholder="Leave empty if unchanged: " value={EmailE || ''}/>
                        <label>AccessGroups:</label>
                        <Select isMulti={true} options={pipeToOptions(allAccessGroups)} placeholder='Leave empty if unchanged' onChange={getSelectAccessGroupValues}/>
                        <label>Status:</label>
                        <Select options={pipeToOptions(allStatus)} placeholder='Leave empty if unchanged'  onChange={getSelectStatusValues}/>
                    
                    </div>
                </div>
                
                <div className='buttonset-1line'>
                    <button onClick={gotousermanagement}>Back</button>
                    <button type='submit'>Confirm Edit</button>
                </div>
            </form> 
        </div>
    );
}