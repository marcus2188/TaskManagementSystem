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
}

