import Select from 'react-select';
import QueryService from '../services/QueryService';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

export default function AddApp(){
    // Services
    const queryService = new QueryService();

    // Navigation functions and hooks
    const navigate = useNavigate();
    const gotoapps = () => {
        navigate(-1);
    }

    // States for variables
    const [appAcro, setAppAcro] = useState('');
    const [appDesc, setAppDesc] = useState('');
    const [apprno, setApprno] = useState(undefined);
    const [appStartDate, setAppStartDate] = useState('');
    const [appEndDate, setAppEndDate] = useState('');
    const [appPermitOpen, setAppPermitOpen] = useState('');
    const [appPermitTodo, setAppPermitTodo] = useState('');
    const [appPermitDoing, setAppPermitDoing] = useState('');
    const [appPermitDone, setAppPermitDone] = useState('');
    const [appPermitCreate, setAppPermitCreate] = useState('');

    // States for modes
    const [addSuccess, setAddSuccess] = useState(0);  // 0 for normal, -1 for invalid, 1 for success. -2 for appacro already exist, -3 for breaking character limit

    // States for data
    const [groupsData, setGroupsData] = useState([]);

    // Functions to set react-select values
    const getselectpermitopen = (vals) => {
        setAppPermitOpen(vals.value)
    }
    const getselectpermittodo = (vals) => {
        setAppPermitTodo(vals.value)
    }
    const getselectpermitdoing = (vals) => {
        setAppPermitDoing(vals.value)
    }
    const getselectpermitdone = (vals) => {
        setAppPermitDone(vals.value)
    }
    const getselectpermitcreate = (vals) => {
        setAppPermitCreate(vals.value)
    }

    // Function to get all groups asynchronously
    const getAllGroups = async () => {
        const gdata = await queryService.getAllGroups({});
        setGroupsData(gdata);
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

    // on form submit
    const handlesubmitapp = async e =>{
        e.preventDefault();
        if(appAcro.length!==0 && appDesc.length!==0 && apprno!==-99 && appStartDate.length!==0 && appEndDate.length!==0 && appPermitOpen.length!==0 && appPermitTodo.length!==0 && appPermitDoing.length!==0 && appPermitDone.length!==0 && appPermitCreate.length!==0){
            await queryService.addApp({appAcro, appDesc, apprno, appStartDate, appEndDate, appPermitOpen, appPermitTodo, appPermitDoing, appPermitDone, appPermitCreate}).then(resp => {
                if(resp.operationStatus==='SUCCESS'){
                    setAddSuccess(1);
                }else{
                    if(resp.reason==='ER_DUP_ENTRY'){
                        setAddSuccess(-2);
                    }
                    if(resp.reason==='ER_DATA_TOO_LONG'){
                        setAddSuccess(-3);
                    }
                    if(resp.reason==='ER_PARSE_ERROR'){
                        setAddSuccess(-4);
                    }
                }
            })
        }else{
            setAddSuccess(-1);
        }
        
    }

    // Call these on component startup
    React.useEffect(() => {
        getAllGroups();
    }, [])

    // JSX
    return(
        <div className="page">
            <form className='pane' id='taskform' onSubmit={handlesubmitapp}>
                <h2>Add an App</h2>
                <h2 className={addSuccess===0? 'normallabel' : (addSuccess===1? 'acceptedlabel' : 'invalidlabel')}>{addSuccess===0? 'All fields mandatory' : (addSuccess===-1? 'Error! Inputs must be valid' : (addSuccess===-2? 'App acro already exists' : (addSuccess===-3? 'Error! Dont break char limits' : (addSuccess===-4? 'Unsupported text format due to copy-pasting': 'App successfully added'))))}</h2>
                <label>App Acro:</label>
                <input type='text' placeholder='appacro here:' onChange={e => {setAppAcro(e.target.value)}} value={appAcro || ''}/>
                <label>App desc (max 60 chars):</label>
                <textarea rows='4' cols='50' placeholder='appdesc here:' onChange={e => {setAppDesc(e.target.value)}}  value={appDesc || ''}/>
                <label>App round no:</label>
                <input type='number' placeholder='approundno here:' onChange={e => {setApprno(e.target.value)}}  value={apprno || undefined}/>
                <label>App startdate:</label>
                <input type='date' onChange={(e) => {setAppStartDate(e.target.value)}}/>
                <label>App enddate:</label>
                <input type='date' onChange={(e) => {setAppEndDate(e.target.value)}}/>
                <div className='selectionset'>
                    <div className='selection'>
                        <label>App permit open:</label>
                        <Select placeholder='permit open' options={pipedataobjtooptions(groupsData)} onChange={getselectpermitopen}/>
                    </div>
                    <div className='selection'>
                        <label>App permit todo:</label>
                        <Select placeholder='choose app' options={pipedataobjtooptions(groupsData)} onChange={getselectpermittodo}/>
                    </div>
                    <div className='selection'>
                        <label>App permit doing:</label>
                        <Select placeholder='choose app' options={pipedataobjtooptions(groupsData)} onChange={getselectpermitdoing}/>
                    </div>
                    <div className='selection'>
                        <label>App permit done:</label>
                <       Select placeholder='choose app' options={pipedataobjtooptions(groupsData)} onChange={getselectpermitdone}/>
                    </div>
                    <div className='selection'>
                        <label>App permit create:</label>
                        <Select placeholder='choose app' options={pipedataobjtooptions(groupsData)} onChange={getselectpermitcreate}/>
                    </div>
                </div>
                
                
                
                
                
                <div className='buttonset'>
                    <button type='submit'>Add the App</button>
                    <button type='button' onClick={gotoapps}>Back</button>
                </div>
            </form>
        </div>
    );
}