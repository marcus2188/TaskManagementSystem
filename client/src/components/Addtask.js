import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/global.css';
import Select from 'react-select';
import QueryService from '../services/QueryService';

export default function AddTask(){
    // Services
    const queryService = new QueryService();

    // Navigation hooks and functions
    const navigate = useNavigate();
    const gotoapps = () => {
        navigate(-1);
    }

    // States for the inputs
    const [tname, setTname] = useState('');
    const [tdesc, setTdesc] = useState('');
    const [tnotes, setTnotes] = useState('');
    const [taskAppAcro, setTaskAppAcro] = useState('');
    const [taskPlan, setTaskPlan] = useState('');
    const [addSuccess, setAddSuccess] = useState(0);  // 0 for normal, -1 for invalid, 1 for success, -2 for duplicate task name, -3 for breaking character limits, -4 for unsupported text format

    // States for data objects
    const [appData, setAppData] = useState([]);
    const [planData, setPlanData] = useState([]);

    // Functions for retrieving react-select values
    const getselectapp = (vals) => {
        setTaskAppAcro(vals.value);
    }
    const getselectplan = (vals) => {
        setTaskPlan(vals.value);
    }

    // Function to get all app acronyms asynchronously for reactselect
    const getAllApps = async () => {
        const allappdata = await queryService.retrieveAllApps({});
        setAppData(allappdata);
    }
    const getAllPlans = async () => {
        const allplandata = await queryService.retrieveAllPlans({});
        setPlanData(allplandata);
    }

    // Functions to convert list of apps into list of react select options
    const pipeAppsToOptions = (applist) => {
        const newlist = [];
        applist.forEach(ap => {
            newlist.push({value: ap.app_acro, label: ap.app_acro});
        });
        return newlist;
    }
    const pipePlansToOptions = (planlist) => {
        const newlist = [];
        planlist.forEach(p => {
            newlist.push({value: p.mvpname, label: p.mvpname});
        });
        return newlist;
    }


    // on form submit
    const handlesubmittask = async e =>{
        e.preventDefault();
        if(tname.length!==0 && tdesc.length!==0 && tnotes.length!==0 && taskAppAcro.length!==0){
            const today = new Date();
            const datestr = (today.getDate() < 10? '0' + today.getDate() : today.getDate()) + '/' + ((today.getMonth() + 1) < 10? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + '/' + today.getFullYear();
            await queryService.addTask({tname, tdesc, tnotes, taskAppAcro, taskPlan, curuser: JSON.parse(sessionStorage.getItem('token')).token.username, curdate: datestr}).then(res => {
                if(res.operationStatus==='SUCCESS'){
                    setAddSuccess(1);
                }else{
                    if(res.reason==='ER_DUP_ENTRY'){
                        setAddSuccess(-2);
                    }
                    if(res.reason==='ER_DATA_TOO_LONG'){
                        setAddSuccess(-3);
                    }
                    if(res.reason==='ER_PARSE_ERROR'){
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
        getAllApps();
        getAllPlans();
    }, [])

    // Call these on value change
    React.useEffect(() => {
        setAddSuccess(0);
    }, [tname, tdesc, tnotes, taskAppAcro, taskPlan])

    return(
        <div className="page">
            <form className='pane' id='taskform' onSubmit={handlesubmittask}>
                <h2>Add a task</h2>
                <h2 className={addSuccess===0? 'normallabel' : (addSuccess===1? 'acceptedlabel' : 'invalidlabel')}>{addSuccess===0? 'All fields mandatory ex/plan' : (addSuccess===-1? 'Error! Inputs must be valid' : (addSuccess===-2? 'Taskname already exists' : (addSuccess===-3? 'Error! Dont exceed limits' : (addSuccess===-4? 'Unsupported formatting from your copy-pasting' : 'Task successfully added'))))}</h2>
                <label>Taskname:</label>
                <input type='text' placeholder='taskname here:' onChange={(e)=>{setTname(e.target.value);}} />
                <label>Taskdesc (max 60 chars):</label>
                <textarea rows='2' cols='60' placeholder='taskdesc here:' onChange={(e)=>{setTdesc(e.target.value);}}/>
                <label>Tasknotes (max 4000 chars):</label>
                <textarea rows='6' cols='60' placeholder='tasknote here:' onChange={(e)=>{setTnotes(e.target.value);}}/>
                <label>Appacro:</label>
                <Select options={pipeAppsToOptions(appData)} placeholder='choose app' onChange={getselectapp}/>
                {taskAppAcro===''? 
                    <></>
                :
                    <div>
                        <label>Plan:</label>
                        {console.log(pipePlansToOptions(planData.filter(p => p.app_acro===taskAppAcro)))}
                        <Select options={pipePlansToOptions(planData.filter(p => p.app_acro===taskAppAcro))} placeholder='choose plan' onChange={getselectplan}/>
                        
                    </div>
                }
                <div className='buttonset'>
                    <button type='submit'>Add the Task</button>
                    <button type='button' onClick={gotoapps}>Back</button>
                </div>

            </form>
        </div>
    );
}