import QueryService from '../services/QueryService';
import { useNavigate } from 'react-router-dom';
import '../styles/global.css';
import React, { useState } from 'react';

export default function Applications(){
    // Services
    const queryService = new QueryService();

    // States for data
    const [userGroups, setUserGroups] = useState([]);

    // Navigation hooks and functions
    const navigate = useNavigate();
    const gototaskmanagement = () => {
        navigate(-1);
    }
    const gotoaddapp = () => {
        navigate('addapp');
    }
    const gotoaddtask = () => {
        navigate('addtask');
    } 
    const gotoaddplan = () => {
        navigate('addplan');
    } 

    // Special hooked function to return access group array of strings for the current person logged in
    const getuserGroups = async e => {
        const accountobj = await queryService.checkAccessLevel({username: JSON.parse(sessionStorage.getItem('token')).token.username});
        setUserGroups(accountobj.accessGroups);
    }

    // Call these on component startup
    React.useEffect(() => {
        getuserGroups();
    }, [])

    // JSX, strictly only PM allowed to add plans, only PL allowed to add apps
    return(
        <div className="page">
            <div>This is applist page</div>
            <div className='buttonset-1line'>
                <button onClick={gototaskmanagement}>Back</button>
                {userGroups.includes("PL")? <button onClick={gotoaddapp}>Add App</button> : <></>}
                {userGroups.includes("PM")? <button onClick={gotoaddplan}>Add Plan</button> : <></>}
                <button onClick={gotoaddtask}>Add Task</button>
                
            </div>
        </div>
    );
}