import QueryService from '../services/QueryService';
import { useNavigate } from 'react-router-dom';
import '../styles/global.css';

export default function Applications(){
    // Services
    const queryService = new QueryService();

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

    // JSX
    return(
        <div className="page">
            <div>This is applist page</div>
            <div className='buttonset-1line'>
                <button onClick={gototaskmanagement}>Back</button>
                <button onClick={gotoaddapp}>Add App</button>
                <button onClick={gotoaddtask}>Add Task</button>
                <button onClick={gotoaddplan}>Add Plan</button>
            </div>
        </div>
    );
}