import '../styles/Usermanagement.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginService from '../services/LoginService';
import QueryService from '../services/QueryService';

export default function Groupmanagement(){
    // Services
    const loginService = new LoginService();
    const queryService = new QueryService();

    // Navigation hooks and functions
    const navigate = useNavigate();
    const gotousermain = () => {
        navigate(-1);
    }
    // States for accessGroups data in database
    const [groupsData, setGroupsData] = useState([]);

    // States for triggering events
    const [showAddGroup, setShowAddGroup] = useState(false);
    const [groupname, setGroupname] = useState('');

    // Function to get all groups asynchronously
    const getAllGroups = async () => {
        const gdata = await queryService.getAllGroups({});
        setGroupsData(gdata);
    }

    // Call these on component startup
    React.useEffect(() => {
        getAllGroups();
    }, [])

    // handle submit of add new group
    const handlesubmitAdd = async e =>{
        e.preventDefault();
        const oo = await queryService.addGroup({groupname});
        if(JSON.stringify(oo) === "{}"){
            console.log("hi");
        }
        setShowAddGroup(false);
        window.location.reload(true);
    }

    return(
        <div className="page">
            <h1>Task Management System</h1>
            <h2>Group Management</h2>
            <h2>These are all the access groups</h2>
            <table className='datatable'>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>AccessGroups</th>
                    </tr>
                </thead>
                <tbody>
                    {groupsData.map(row => {
                        return(
                            <tr key={row.id}>
                                <td>{row.id}</td>
                                <td>{row.accessGroups}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {showAddGroup?
            <form onSubmit={handlesubmitAdd}>
                <input type='text' placeholder='Type new group' onChange={(e)=>{setGroupname(e.target.value)}}/>
                <button type='submit'>Confirm Add</button>
            </form>
            :
            <></>}
            
            <div className='pane'>
                <div className='buttonset-1line'>
                    <button onClick={gotousermain}>Back</button>
                    {showAddGroup? <></> : <button onClick={() => {setShowAddGroup(true);}}>Wanna Add More</button>}
                    <button onClick={() => {navigate('/'); loginService.logoutUser();}}>Logout</button>
                </div>
            </div>
        </div>
    );
}