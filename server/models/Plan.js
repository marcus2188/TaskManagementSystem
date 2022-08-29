/* CREATE MODEL FOR Plan */
class Plan{
    constructor(_mvpname, _startdate, _enddate, _appacro){
        this.mvpname = _mvpname;
        this.startdate = _startdate;
        this.enddate = _enddate;
        this.app_acro = _appacro;
    }
}

// function changing list of rowDataPacket into list of Plan objects
function pipeResponseAsPlanList(objlist){
    const mylist = [];
    objlist.forEach(obj => {
        const pp = new Plan(obj.Plan_MVP_Name, obj.Plan_startDate, obj.Plan_endDate, obj.Plan_App_Acronym);
        mylist.push(pp);
    });
    return mylist;
}

module.exports = {pipeResponseAsPlanList: pipeResponseAsPlanList};