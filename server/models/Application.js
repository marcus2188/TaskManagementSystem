/* CREATE MODEL FOR APPLICATION */
class Application{
    constructor(_appacro, _appdesc, _apprno, _appstartdate, _appenddate, _apppermitopen, _apppermittodo, _apppermitdoing, _apppermitdone, _apppermitcreate){
        this.app_acro = _appacro;
        this.appdesc = _appdesc;
        this.apprno = _apprno;
        this.appstartdate = _appstartdate;
        this.appenddate = _appenddate;
        this.app_permit_open = _apppermitopen;
        this.app_permit_todo = _apppermittodo;
        this.app_permit_doing = _apppermitdoing;
        this.app_permit_done = _apppermitdone;
        this.app_permit_create = _apppermitcreate;
    }
}

// function changing list of rowDataPacket into list of application objects
function pipeResponseAsApplicationList(objlist){
    const mylist = [];
    objlist.forEach(obj => {
        const appl = new Application(obj.App_Acronym, obj.App_Description, obj.App_Rnumber, obj.App_startDate, obj.App_endDate, obj.App_permit_Open, obj.App_permit_toDoList, obj.App_permit_Doing, obj.App_permit_Done, obj.App_permit_Create);
        mylist.push(appl);
    });
    return mylist;
}

module.exports = {pipeResponseAsApplicationList: pipeResponseAsApplicationList};