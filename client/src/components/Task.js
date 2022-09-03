import '../styles/Usermanagement.css';
import { useLocation, useNavigate} from 'react-router-dom';
import QueryService from "../services/QueryService";
import React, { useState } from 'react';

export default function Task(){
    // Services
    const queryService = new QueryService();
    
    // States for variables
    const [referencedTask, setReferencedTask] = useState({taskname:'', taskdesc: '', tasknotes: '', taskid: '', taskplan: '', taskappacro: '', taskstate: '', taskcreator: '', taskowner: '', taskcreatedate: ''})
    const [taskdata, setTaskData] = useState([]);
    const [userGroups, setUserGroups] = useState([]);

    // Navigation hooks and functions
    const location = useLocation();
    const navigate = useNavigate();
    const gototaskmanagement = () =>{
        navigate(-1);
    }

    // Function to get task detail asynchronously, by getting taskname from current route path
    const getTaskFromUrl = async () => {
        const currenttnamestr = location.pathname.substring(location.pathname.indexOf('=') + 1)
        const tdata = await queryService.getTaskDetails({taskname: currenttnamestr.replaceAll('%20', ' ')});
        setReferencedTask(tdata);
    }

    // Function to get task detail asynchronously from clicked notes on the left
    const getTask = async (tname) => {
        const tdata = await queryService.getTaskDetails({taskname: tname});
        setReferencedTask(tdata);
    }

     // Function to get all tasks asynchronously
     const getAllTasks = async () => {
        const alltaskdata = await queryService.retrieveAllTasks({});
        setTaskData(alltaskdata);
    }

     // Special hooked function to return access group array of strings for the current person logged in
     const checkGroup = async e => {
        const accountobj = await queryService.checkAccessLevel({username: JSON.parse(sessionStorage.getItem('token')).token.username});
        setUserGroups(accountobj.accessGroups);
    }

     // Call these on component startup
    React.useEffect(() => {
        getTaskFromUrl();
        getAllTasks();
        checkGroup();
    }, [])

    // JSX
    return(
        <div className="page">
            <div className="kanban-task">
                <div className="kanban-task-category">
                    <h2>{referencedTask.taskstate}</h2>
                    {taskdata.filter(tsk => tsk.taskstate===referencedTask.taskstate).sort(function(a, b){
                        var aa = a.taskcreatedate.split('/').reverse().join(),
                            bb = b.taskcreatedate.split('/').reverse().join();
                        return aa < bb ? -1 : (aa > bb ? 1 : 0);
                        }).map(ts => {
                            return(
                                <div className={referencedTask.taskname===ts.taskname? 'task-note-active' : 'task-note'} onClick={() => {getTask(ts.taskname);}}>
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
                                </div>
                            )}
                        )
                    }
                </div>
                <div className='expandedtaskpane'>
                    <div className='expandedtask'>
                        <div className="task-note-title"><h2>{referencedTask.taskname}</h2></div>
                        <div className='task-note-sup'>
                            <div><label>Task Desc: {referencedTask.taskdesc}</label></div>
                            <div><label>Task App: {referencedTask.taskappacro}</label></div>
                            <div><label>Task Plan: {referencedTask.taskplan}</label></div>
                            <div><label>Task Creator: {referencedTask.taskcreator}</label></div>
                            <div><label>Task Owner: {referencedTask.taskowner}</label></div>
                            <div><label>Task Date Created: {referencedTask.taskcreatedate}</label></div>
                            <div><label>Task Audit Trail: {referencedTask.taskaudittrail}</label></div>
                        </div>
                        <div><h4>{referencedTask.tasknotes}</h4></div>
                    </div>
                </div>
                <div className='buttonsetv'>
                    {userGroups.includes('PL')? 
                        (referencedTask.taskstate==='open'? 
                            <button>Edit</button> 
                        : 
                            (referencedTask.taskstate==='done'?
                                <div>
                                    <button>Not done</button>
                                    <button>Close it</button>
                                </div>
                            :
                                <></>
                            )
                        ) 
                    : 
                        <></>
                    }
                    {userGroups.includes('PM')? 
                        (referencedTask.taskstate==='open'? 
                            <button>Make Todo</button> 
                        : 
                            <></>
                        ) 
                    : 
                        <></>
                    }
                    {userGroups.includes('M')? 
                        (referencedTask.taskstate==='todo'? 
                            <button>I'm doing</button> 
                        : 
                            (referencedTask.taskstate==='doing'?
                                <div>
                                    <button>I'm done</button>
                                    <button>Cancel doing</button>
                                </div>
                            :
                                <></>
                            )
                        ) 
                    : 
                        <></>
                    }
                    <button onClick={() => {gototaskmanagement();}}>Back</button>
                </div>
            </div>
        </div>
    );
}