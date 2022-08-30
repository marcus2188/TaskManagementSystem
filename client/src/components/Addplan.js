import Select from 'react-select';
import QueryService from '../services/QueryService';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

export default function AddPlan(){
    // Services
    const queryService = new QueryService();

    // Navigation functions and hooks
    const navigate = useNavigate();
    const gotoapps = () => {
        navigate(-1);
    }

    // States for variables
    const [planMvpName, setPlanMvpName] = useState('');
    const [planStartDate, setPlanStartDate] = useState('');
    const [planEndDate, setPlanEndDate] = useState('');
    const [planAppAcro, setPlanAppAcro] = useState('');

    // States for modes
    const [addSuccess, setAddSuccess] = useState(0);  // 0 for normal, -1 for invalid, 1 for success. -2 for plan mvpname already exist

    // States for data
    const [groupsData, setGroupsData] = useState([]);
    const [appsData, setAppsData] = useState([]);
    const [userGroups, setUserGroups] = useState([]);

    // Function to get all groups asynchronously
    const getAllGroups = async () => {
        const gdata = await queryService.getAllGroups({});
        setGroupsData(gdata);
    }
    // Function to get all app acronyms asynchronously for reactselect
    const getAllApps = async () => {
        const allappdata = await queryService.retrieveAllApps({});
        setAppsData(allappdata);
    }

    // Special hooked function to return access group array of strings for the current person logged in
    const getuserGroups = async e => {
        const accountobj = await queryService.checkAccessLevel({username: JSON.parse(sessionStorage.getItem('token')).token.username});
        setUserGroups(accountobj.accessGroups);
    }

    // React Select piping functions to convert db obj to list of access strings, includes only PM M PL
    const pipedataobjtooptions = (objlist) => {
        const newlist = [];
        objlist.forEach(obj => {
            if(['PM', 'PL', 'M'].includes(obj.accessGroups)){
                newlist.push({label: obj.accessGroups, value: obj.accessGroups});
            }
        });
        return newlist;
    }

    // Functions to convert list of apps into list of react select options
    const pipeAppsToOptions = (applist) => {
        const newlist = [];
        applist.forEach(ap => {
            newlist.push({value: ap.app_acro, label: ap.app_acro});
        });
        return newlist;
    }

    // Functions for retrieving react-select values
    const getselectapp = (vals) => {
        setPlanAppAcro(vals.value);
    }

    // on form submit
    const handlesubmitPlan = async e =>{
        e.preventDefault();
        await queryService.addPlan({planMvpName, planStartDate, planEndDate, planAppAcro}).then(res => {
            if(res.operationStatus==='SUCCESS'){
                setPlanMvpName(''); setPlanStartDate(''); setPlanEndDate('');
                setAddSuccess(1);
            }else{
                if(res.reason==='MVPNAMEALREADYEXIST'){
                    setAddSuccess(-2);
                }
                if(res.reason==='INVALIDINPUT'){
                    setAddSuccess(-1);
                }
            }
        })
    }

    // Call these on component startup
    React.useEffect(() => {
        getAllGroups();
        getAllApps();
        getuserGroups();
    })

    // JSX
    return(
        <div className="page">
            <form className='pane' id='planform' onSubmit={handlesubmitPlan}>
                <h2>Add a Plan</h2>
                <h2 className={addSuccess===0? 'normallabel' : (addSuccess===1? 'acceptedlabel' : 'invalidlabel')}>{addSuccess===0? 'All fields mandatory' : (addSuccess===-1? 'Error! Inputs must be valid' : (addSuccess===-2? 'MVP name already exists' : 'Plan successfully added'))}</h2>
                <label>Plan MVP Name:</label>
                <input type='text' placeholder='mvpname here:' onChange={e => {setPlanMvpName(e.target.value)}} value={planMvpName || ''}/>
                <label>Plan startdate:</label>
                <input type='date' onChange={(e) => {setPlanStartDate(e.target.value)}} value={planStartDate || ''}/>
                <label>Plan enddate:</label>
                <input type='date' onChange={(e) => {setPlanEndDate(e.target.value)}} value={planEndDate || ''}/>
                <label>Plan App Acro:</label>
                <Select placeholder='Choose app acro' options={pipeAppsToOptions(appsData)} onChange={getselectapp}/>
                
                <div className='buttonset'>
                    <button type='submit'>Add the Plan</button>
                    <button type='button' onClick={gotoapps}>Back</button>
                </div>
            </form>
        </div>
    );
}