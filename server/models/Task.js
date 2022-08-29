/* CREATE MODEL FOR Task */
class Task{
    constructor(_taskname, _taskdesc, _tasknotes, _taskid, _taskplan, _taskappacro, _taskstate, _taskcreator, _taskowner, _taskcreatedate){
        this.taskname = _taskname;
        this.taskdesc = _taskdesc;
        this.tasknotes = _tasknotes;
        this.taskid = _taskid;
        this.taskplan = _taskplan;
        this.taskappacro = _taskappacro;
        this.taskstate = _taskstate;
        this.taskcreator = _taskcreator;
        this.taskowner = _taskowner;
        this.taskcreatedate = _taskcreatedate;
    }
}

// function changing list of rowDataPacket into list of Task objects
function pipeResponseAsTaskList(objlist){
    const mylist = [];
    objlist.forEach(obj => {
        const tt = new Task(obj.Task_name, obj.Task_description, obj.Task_notes, obj.Task_id, obj.Task_plan, obj.Task_App_Acronym, obj.Task_state, obj.Task_creator, obj.Task_owner, obj.Task_createDate);
        mylist.push(tt);
    });
    return mylist;
}

module.exports = {pipeResponseAsTaskList: pipeResponseAsTaskList};