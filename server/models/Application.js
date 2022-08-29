/* CREATE MODEL FOR APPLICATION */
class Application{
    constructor(_appacro, _appdesc, _apprno, _appstartdate, _appenddate){
        this.app_acro = _appacro;
        this.appdesc = _appdesc;
        this.apprno = _apprno;
        this.appstartdate = _appstartdate;
        this.appenddate = _appenddate;
    }
}

// function changing list of rowDataPacket into list of application objects
function pipeResponseAsApplicationList(objlist){
    const mylist = [];
    objlist.forEach(obj => {
        const appl = new Application(obj.App_Acronym, obj.App_Description, obj.App_Rnumber, obj.App_startDate, obj.App_endDate);
        mylist.push(appl);
    });
    return mylist;
}

module.exports = {pipeResponseAsApplicationList: pipeResponseAsApplicationList};