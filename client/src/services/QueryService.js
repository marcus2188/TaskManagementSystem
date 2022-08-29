/* QUERYSERVICE IS A SERVICE CLASS THAT HANDLES ALL API QUERIES TO DB*/
export default class QueryService{
    // POST request at endpoint /checkgroup to find access groups for current person in DB
    checkAccessLevel = async credentials => {
        return fetch('http://localhost:3001/checkgroup', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(credentials)}).then(data => data.json())
    }

    // POST request at endpoint /getAll to retrieve entire accounts db
    getAllAccounts = async credentials => {
        return fetch('http://localhost:3001/getAll', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(credentials)}).then(data => data.json())
    }

    // POST request at endpoint /getAcc to retrieve account details
    getAccountDetails = async credentials => {
        return fetch('http://localhost:3001/getAcc', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(credentials)}).then(data => data.json())
    }

    // POST request at endpoint /updateAccount to update account details
    updateAccount = async credentials => {
        return fetch('http://localhost:3001/updateAcc', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(credentials)}).then(data => data.json())
    }

    // POST request at endpoint /getAllGroups to update account details
    getAllGroups = async credentials => {
        return fetch('http://localhost:3001/getAllGroups', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(credentials)}).then(data => data.json())
    }

    // POST request at endpoint /addGroup to update account details
    addGroup = async credentials => {
        return fetch('http://localhost:3001/addgroup', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(credentials)}).then(data => data.json())
    }

    // POST request at endpoint /getAllTasks to retrieve for task management
    retrieveAllTasks = async credentials => {
        return fetch('http://localhost:3001/getAllTasks', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(credentials)}).then(data => data.json())
    }

    // POST request at endpoint /getAllTasks to retrieve for task management
    retrieveAllApps = async credentials => {
        return fetch('http://localhost:3001/getAllApps', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(credentials)}).then(data => data.json())
    }

    // POST request at endpoint /getAllTasks to retrieve for task management
    retrieveAllPlans = async credentials => {
        return fetch('http://localhost:3001/getAllPlans', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(credentials)}).then(data => data.json())
    }
    
    // POST request at endpoint /getTask to retrieve task details
    getTaskDetails = async credentials => {
        return fetch('http://localhost:3001/getTask', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(credentials)}).then(data => data.json())
    }

    // POST request at endpoint /addApp to add new task
    addApp = async credentials => {
        return fetch('http://localhost:3001/addApp', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(credentials)}).then(data => data.json())
    }

    // POST request at endpoint /addTask to add new task
    addTask = async credentials => {
        return fetch('http://localhost:3001/addTask', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(credentials)}).then(data => data.json())
    }

    // POST request at endpoint /getgroup to add new task
    checkifingroup = async credentials => {
        return fetch('http://localhost:3001/getgroup', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(credentials)}).then(data => data.json())
    }

    // POST request at endpoint /getPlansInApp
    retrievePlansInApp = async credentials => {
        return fetch('http://localhost:3001/getPlansInApp', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(credentials)}).then(data => data.json())
    }
    // POST request at endpoint /addPlan 
    addPlan = async credentials => {
        return fetch('http://localhost:3001/addPlan', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(credentials)}).then(data => data.json())
    }
    // POST request at endpoint /shiftState
    shiftTaskState = async credentials => {
        return fetch('http://localhost:3001/shiftState', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(credentials)}).then(data => data.json())
    }
}

