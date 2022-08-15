/* ACCOUNT OBJECT MODEL CLASS AND HELPER FUNCTIONS */

const e = require("express");

// Class object creation, accessGroups is a array of strings
class Account{
    constructor(_id, _username, _password, _email, _accessGroups, _status){
        this.id = _id;
        this.username = _username;
        this.password = _password;
        this.email = _email;
        this.accessGroups = _accessGroups;
        this.status = _status
    }
}

// function checks if username already in accountlist, this is to help pipeResponseAsAccountList
const usernameAlreadyExist = (alist, acc) => {
    if(alist.length===0) return false;
    alist.forEach(a => {
        if(a.username===acc.username){
            return true;
        }
    });
    return false;
}

// function changing list of rowDataPacket into list of account objects, bearing in mind accessGroups need to be merged into single string array in an account
function pipeResponseAsAccountList(objlist){
    const mylist = [];
    const ranusernames = [];
    objlist.forEach(obj => {
        const account = new Account(obj.id, obj.username, obj.password, obj.email, [obj.accessGroups], obj.status);
        if(!ranusernames.includes(account.username)){
            mylist.push(account);
            ranusernames.push(account.username);
        }else{
            mylist.forEach(acc => {
                if(acc.username===obj.username){
                    acc.accessGroups.push(obj.accessGroups);
                }
            })
        }
    });
    return mylist;
}

// Function converting generic roledatapacket obj into Account object
function pipeGenericObjToAccountObj(someobj){
    return new Account(someobj.id, someobj.username, someobj.password, someobj.email, [someobj.accessGroups], someobj.status)
}

module.exports = {pipeResponseAsAccountList:pipeResponseAsAccountList, pipeGenericObjToAccountObj: pipeGenericObjToAccountObj};