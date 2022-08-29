import {useNavigate } from "react-router-dom";
import React, { useState } from "react";
import '../styles/Usermanagement.css';
import QueryService from "../services/QueryService";
import LoginService from "../services/LoginService";
import Select from 'react-select';

/* TASK MANAGEMENT PRESENTS ALL TASKS ON KANBAN BOARD LIVE */
export default function Taskmanagement(){
    // Services
    const queryService = new QueryService();
    const loginService = new LoginService();

    // Const for variables
    const task_states = ['open', 'todo', 'doing', 'done', 'closed'];
    const [taskdata, setTaskData] = useState([]);
    const [appsdata, setAppsData] = useState([]);
    const [plansdata, setPlansData] = useState([]);
    const [userGroups, setUserGroups] = useState([]);
    const [selectedApp, setSelectedApp] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState([]);

    // Navigation hooks and functions
    const navigate = useNavigate();
    const gotousermain = () => {
        navigate(-1);
    }
    const gotospecifictask = (tname) => {
        navigate(`taskname=${tname}`);
    }
    const gotoaddtask = () => {
        navigate('applications/addtask');
    }
    const gotoapps = () => {
        navigate('applications');
    }

     // Special hooked function to return access group array of strings for the current person logged in
    const checkGroup = async e => {
        const accountobj = await queryService.checkAccessLevel({username: JSON.parse(sessionStorage.getItem('token')).token.username});
        setUserGroups(accountobj.accessGroups);
    }

    // Functions to convert list of strings into react-select option objects list, viceversa
    const pipeToOptions = (mylist) => {
        const newlist = [];
        mylist.forEach(acc => {
            newlist.push({value: acc, label: acc});
        });
        return newlist;
    }

    // Function to get all tasks asynchronously
    const getAllTasks = async () => {
        const alltaskdata = await queryService.retrieveAllTasks({});
        setTaskData(alltaskdata);
    }
    // Function to get all app acronyms asynchronously for reactselect
    const getAllApps = async () => {
        const newlist = [];
        const allappdata = await queryService.retrieveAllApps({});
        allappdata.forEach(ap => {
            newlist.push(ap.app_acro);
        })
        newlist.push('All Apps');
        setAppsData(newlist);
        setSelectedApp(newlist);
    }
    // Function to get all plan mvp names asynchronously for reactselect
    const getAllPlans = async () => {
        const newlist = [];
        const allplandata = await queryService.retrieveAllPlans({});
        allplandata.forEach(pp => {
            newlist.push(pp.mvpname);
        })
        newlist.push('');
        newlist.push('All Plans');
        setPlansData(newlist);
        // initially, set selected plan list to be newlist as well
        setSelectedPlan(newlist);
    }

     // Call these on component startup
    React.useEffect(() => {
        getAllTasks();
        getAllPlans();
        getAllApps();
        checkGroup();
    }, [])

    // Functions to retrieve react-select values
    const getSelectApp = (vals) => {
        if(vals.value === 'All Apps'){
            setSelectedApp(appsdata);
        }
        else{
            setSelectedApp([vals.value]);
        }
    }
    const getSelectPlan = (vals) => {
        if(vals.value === 'All Plans'){
            setSelectedPlan(plansdata);
        }
        else{
            setSelectedPlan([vals.value]);
        }
        
    }

    // Functions to move tasks to other states
    const movetasktostate = async (tasknamestr, destinationstatestr) => {
        await queryService.shiftTaskState({taskname: tasknamestr, tostate: destinationstatestr});
    }

    // JSX
    return(
        <div className="page">
            <div className="titleandfilters">
                <Select options={pipeToOptions(appsdata)} placeholder='All Apps' className="appselect" onChange={getSelectApp}/>
                <h1>Kanban Task Board</h1>
                <Select options={pipeToOptions(plansdata)} placeholder='All Plans' className="planselect" onChange={getSelectPlan}/>
            </div>
            
            <div className="kanban-task">
                {task_states.map((ts, ind) => {
                    return(
                        <div key={ind} className="kanban-task-category">
                            <h2>{ts}</h2>
                            {userGroups.includes('PL')? (ts==='open'? 
                            <div className="addtaskpluspane" onClick={gotoaddtask}>
                                <img width={40} src={require('../assets/images/circleplus.png')} alt="" />
                            </div> : <></>) : <></>}
                            {taskdata.filter(tsf => selectedApp.includes(tsf.taskappacro))
                                .filter(tsh => selectedPlan.includes(tsh.taskplan))
                                .filter(tsk => tsk.taskstate===ts).sort(function(a, b){
                                var aa = a.taskcreatedate.split('/').reverse().join(),
                                    bb = b.taskcreatedate.split('/').reverse().join();
                                return aa < bb ? -1 : (aa > bb ? 1 : 0);
                                }).map(ts => {
                                return(
                                    <div className="task-note" onClick={() => {gotospecifictask(ts.taskname)}}>
                                        <div className="task-note-title"><label>{ts.taskname}</label></div>
                                        <div><p>{ts.taskdesc}</p></div>
                                        <div className="task-note-bottom">
                                            <div className="row1">
                                                <div className="task-note-bottom-appacro"><h4>{ts.taskappacro}</h4></div>
                                                <div className="task-note-bottom-cdate"><h4>{ts.taskcreatedate}</h4></div>
                                            </div>
                                            <div className="row1">
                                                <div className="task-note-bottom-creator"><h4>{ts.taskcreator}</h4></div>
                                                <div className="task-note-bottom-plan"><h4>{ts.taskplan}</h4></div>
                                            </div>
                                            
                                        </div>
                                        <div className="hoveredbuttons">
                                            {userGroups.includes('PL')?
                                                (ts.taskstate==='open'? 
                                                    <></>
                                                :
                                                    (ts.taskstate==='done'?
                                                        <div>
                                                            <button className="actionbutton" onClick={() => {movetasktostate(ts.taskname, "doing"); window.location.reload(true);}}>{'<'}</button>
                                                            <button className="actionbutton" onClick={() => {movetasktostate(ts.taskname, "closed"); window.location.reload(true);}}>{'>'}</button>
                                                        </div>
                                                    :
                                                        <></>
                                                    )
                                                )
                                            :
                                                <></>
                                            }
                                            {userGroups.includes('PM')?
                                                (ts.taskstate==='open'? 
                                                    <button className="actionbutton" onClick={() => {movetasktostate(ts.taskname, "todo"); window.location.reload(true);}}>{'>'}</button>
                                                :
                                                    <></>
                                                )
                                            :
                                                <></>
                                            }
                                            {userGroups.includes('M')?
                                                (ts.taskstate==='todo'? 
                                                    <button className="actionbutton" onClick={() => {movetasktostate(ts.taskname, "doing"); window.location.reload(true);}}>{'>'}</button>
                                                :
                                                    (ts.taskstate==='doing'?
                                                        <div>
                                                            <button className="actionbutton" onClick={() => {movetasktostate(ts.taskname, "todo"); window.location.reload(true);}}>{'<'}</button>
                                                            <button className="actionbutton" onClick={() => {movetasktostate(ts.taskname, "done"); window.location.reload(true);}}>{'>'}</button>
                                                        </div>
                                                    :
                                                        <></>
                                                    )
                                                )
                                            :
                                                <></>
                                            }
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
            <div className='pane'>
                <div className='buttonset-1line'>
                    <button onClick={gotousermain}>Back</button>
                    <button onClick={gotoapps}>Applications</button>
                    <button>Filter</button>
                    <button onClick={() => {navigate('/'); loginService.logoutUser();}}>Logout</button>
                </div>
            </div>
        </div>
    );
}