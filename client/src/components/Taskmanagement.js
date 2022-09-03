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

    const [allappsdata, setAllAppsData] = useState([]);

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
    const getAllAppsRaw = async () => {
        const allappdata = await queryService.retrieveAllApps({});
        setAllAppsData(allappdata);
    }

    // Function to evaluate if that task should be allowed to show buttons based on whether that task app acro has permits including the current account
    // Decide to show left or right buttons as well, by a boolean array return [leftbutton, rightbutton]
    const showButton = (taskappacro, state) => {
        var objtoreturn = {left: '', right: ''};
        allappsdata.forEach(ap => {
            if(ap.app_acro===taskappacro){
                if(state==='open'){
                    if(userGroups.includes(ap.app_permit_open)){
                        objtoreturn = {left: false, right: true};
                    }else{
                        objtoreturn = {left: false, right: false};
                    }
                }else{
                    if(state==='todo'){
                        if(userGroups.includes(ap.app_permit_todo)){
                            objtoreturn = {left: false, right: true}
                        }else{
                            objtoreturn = {left: false, right: false}
                        }
                    }else{
                        if(state==='doing'){
                            if(userGroups.includes(ap.app_permit_doing)){
                                objtoreturn = {left: true, right: true}
                            }else{
                                objtoreturn = {left: false, right: false}
                            }
                        }else{
                            if(state==='done'){
                                if(userGroups.includes(ap.app_permit_done)){
                                    objtoreturn = {left: true, right: true}
                                }else{
                                    objtoreturn = {left: false, right: false}
                                }
                            }else{
                                if(state==='closed'){
                                    objtoreturn = {left: false, right: false}
                                }else{
                                    console.log("Task does not exist");
                                }
                            }
                        }
                    }
                }
            }
        })
        return objtoreturn;
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
        getAllAppsRaw();
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
    const movetasktostate = async (tasknamestr, state, direction) => {
        if(state==="open"){
            if(direction==="right"){
                await queryService.shiftTaskState({taskname: tasknamestr, tostate: "todo", curuser: JSON.parse(sessionStorage.getItem('token')).token.username});
            }
        }
        if(state==="todo"){
            if(direction==="right"){
                await queryService.shiftTaskState({taskname: tasknamestr, tostate: "doing", curuser: JSON.parse(sessionStorage.getItem('token')).token.username});
            }
        }
        if(state==="doing"){
            if(direction==="left"){
                await queryService.shiftTaskState({taskname: tasknamestr, tostate: "todo", curuser: JSON.parse(sessionStorage.getItem('token')).token.username});
            }
            if(direction==="right"){
                await queryService.shiftTaskState({taskname: tasknamestr, tostate: "done", curuser: JSON.parse(sessionStorage.getItem('token')).token.username});
            }
        }
        if(state==="done"){
            if(direction==="left"){
                await queryService.shiftTaskState({taskname: tasknamestr, tostate: "doing", curuser: JSON.parse(sessionStorage.getItem('token')).token.username});
            }
            if(direction==="right"){
                await queryService.shiftTaskState({taskname: tasknamestr, tostate: "closed", curuser: JSON.parse(sessionStorage.getItem('token')).token.username});
            }
        }
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
                {task_states.map((tsa, ind) => {
                    return(
                        <div key={ind} className="kanban-task-category">
                            <h2>{tsa}</h2>
                            {userGroups.includes('PL')? (tsa==='open'? 
                            <div className="addtaskpluspane" onClick={gotoaddtask}>
                                <img width={40} src={require('../assets/images/circleplus.png')} alt="" />
                            </div> : <></>) : <></>}
                            {taskdata.filter(tsf => selectedApp.includes(tsf.taskappacro))
                                .filter(tsh => selectedPlan.includes(tsh.taskplan))
                                .filter(tsk => tsk.taskstate===tsa).sort(function(a, b){
                                var aa = a.taskcreatedate.split('/').reverse().join(),
                                    bb = b.taskcreatedate.split('/').reverse().join();
                                return aa < bb ? -1 : (aa > bb ? 1 : 0);
                                }).map((ts, indh) => {
                                return(
                                    <div key={indh} className="task-note" onClick={() => {gotospecifictask(ts.taskname)}}>
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
                                            <div>
                                                {(showButton(ts.taskappacro, tsa)).left? <button className="actionbutton" onClick={() => {movetasktostate(ts.taskname, tsa, "left"); window.location.reload(true);}}>{'<'}</button> : <></>}
                                                {(showButton(ts.taskappacro, tsa)).right? <button className="actionbutton" onClick={() => {movetasktostate(ts.taskname, tsa, "right"); window.location.reload(true);}}>{'>'}</button> : <></>}
                                            </div>
                                            {/* <button onClick={() => {console.log(showButton(ts.taskappacro, tsa))}}>hi</button> */}
                                            
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