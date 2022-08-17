import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginService from '../services/LoginService';
import QueryService from '../services/QueryService';
import '../styles/Usermanagement.css';

/* USER MANAGEMENT FOR ADMIN DISPLAYS ALL SYSTEM ACCOUNTS, WITH EDIT OPTIONS */
export default function Usermanagement(){
    // Services
    const loginService = new LoginService();
    const queryService = new QueryService();

    // States for variables. Default data is a list with 1 dummy account
    const [accountsAndAccessData, setAccountsAndAccessData] = useState([]);

    // Navigation hooks and functions
    const navigate = useNavigate();
    const gotousermain = () => {
        navigate(-1);
    }
    const gotoregister = () => {
        navigate('adduser');
    }
    const gotoedit = (rowid) => {
        navigate(`editid=${rowid}`);
    }

    // Function to get all accounts asynchronously
    const getAll = async () => {
        const alldata = await queryService.getAllAccounts({});
        setAccountsAndAccessData(alldata);
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
        getAll();
    }, [])

    // JSX
    return (
        <div className="page">
            <h1>Task Management System</h1>
            <h2>User Management</h2>
            <table className='datatable'>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Username</th>
                        <th>Passwordhash</th>
                        <th>Email</th>
                        <th>Access</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {accountsAndAccessData.map(row => {
                        return(
                            <tr key={row.id}>
                                <td>{row.id}</td>
                                <td>{row.username}</td>
                                <td>{row.password.slice(0,20)}</td>
                                <td>{row.email}</td>
                                <td>{row.accessGroups.join(', ')}</td>
                                <td>{row.status}</td>
                                <td>{JSON.parse(sessionStorage.getItem('token')).token.username===row.username? 'CURRENT' : 
                                    <div className='actionbuttonset'>
                                        <button className='actionbutton' onClick={() => {gotoedit(row.id)}}>Edit</button>
                                    </div>
                                }</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className='pane'>
                <div className='buttonset-1line'>
                    <button onClick={gotousermain}>Back</button>
                    <button onClick={gotoregister}>Add New User</button>
                    <button onClick={() => {navigate('/'); loginService.logoutUser();}}>Logout</button>
                </div>
            </div>
        </div>
    );
}