/* SERVER.JS IS THE ENTRY POINT FOR BACKEND, RUNS ASYNC AND CONTINUOUSLY */

// Imports
const { pipeResponseAsAccountList} = require('./models/Account');
const { pipeResponseAsTaskList} = require('./models/Task');
const { pipeResponseAsApplicationList} = require('./models/Application');
const { pipeResponseAsPlanList} = require('./models/Plan');
const {convertToDDMMYYYY} = require('./utils/datehandler');
const exp = require('express');
const crs = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = exp();
const bcrypt = require('bcrypt');

// Express server use cors, bodyparser and start listening at port 3001
app.use(crs());
app.use(bodyParser.json());
app.listen(3001, () => console.log('[SUCCESS] Express server up and running'));

// RUN FOREVER PORTION
// Create MYSQL connection for db /host 'localhost', 'host.docker.internal' /port 3307, 3306
const conn = mysql.createConnection({host: 'localhost', user: 'root', password: 'conjugatebase', database: 'nodelogin'});
conn.connect((err) =>{
    if(err) throw err;
    console.log('[SUCCESS] MYSQL DB ready');
});

// For docker run backend:
// docker build -f Dockerfile -t server .
// docker run -it -p 3001:3001 server

// For docker run frontend:
// docker build -f Dockerfile -t client .
// docker run -it -p 4000:3000 client

// Begin receiving POST requests at endpoint /login
app.post('/login', (req, res)=>{
    let myquerystr = `SELECT * FROM accounts WHERE username = '${req.body.Uname}'`
    let query = conn.query(myquerystr, (err, result)=>{
        if(err) throw err;
        if(result.length === 1){
            if(bcrypt.compareSync(req.body.Pword, result[0].password)){
                let checkStatusQuery = `SELECT status FROM access WHERE username = '${req.body.Uname}'`
                let ww = conn.query(checkStatusQuery, (er, resu) => {
                    if(er){
                        throw er;
                    }else{
                        if(resu[0].status===1){
                            console.log("[SUCCESS] " + req.body.Uname + " has logged into the system");
                            res.send({token: {username: req.body.Uname}});
                        }else{
                            console.log("[FAIL] " + req.body.Uname + " logged in but is disabled");
                            res.send({undefined: undefined});
                        }
                    }
                })
            }else{
                console.log("[FAIL] Invalid Username or Password: "+ req.body.Uname);
                res.send({undefined: undefined});
            }
        }else{
            console.log("[FAIL] Invalid Username or Password: "+ req.body.Uname);
            res.send({undefined: undefined});
        }
    });
})

// Receive register POST request at endpoint /register
app.post('/register', (req, res)=>{
    const salt = 10;
    const hashedpassword = bcrypt.hashSync(req.body.PwordR, salt);
    let searchquery = `SELECT * FROM accounts WHERE username = '${req.body.UnameR}'`
    let thisquery = conn.query(searchquery, (err, result)=>{
        if(err) throw err;
        if(result.length === 0){
            let myquerystr = `INSERT INTO accounts (username, password, email) VALUES ('${req.body.UnameR}', '${hashedpassword}', '${req.body.EmailR}')`
            let query = conn.query(myquerystr, (err, result)=>{
                if(err){
                    throw err;
                }else{
                    let aquery = `INSERT INTO access (username, accessGroups, status) VALUES ('${req.body.UnameR}', 'user', 1)`
                    let q = conn.query(aquery, (er, resu) => {
                        if(er){
                            throw er;
                        }else{
                            console.log(req.body.UnameR + " has registered in the system");
                            res.send({token: {username: req.body.UnameR}});
                        }
                    })
                }
            });
        }else{
            console.log("[ERROR] Username " + req.body.UnameR + " already exists in system");
            res.send({undefined: undefined});
        }
    });
})

// check the access group oof this user in db
app.post('/checkgroup', (req, res)=>{
    let myquerystr = `SELECT * FROM accounts INNER JOIN access ON accounts.username = access.username WHERE accounts.username = '${req.body.username}'`
    let query = conn.query(myquerystr, (err, result)=>{
        if(err){
            throw err;
        }else{
            res.send(pipeResponseAsAccountList(result)[0])
        }
    });
})

// add a group to the groups db
app.post('/addgroup', (req, res)=>{
    let myquerystr = `INSERT INTO nodelogin.groups(accessGroups) VALUES('${req.body.groupname}')`
    let query = conn.query(myquerystr, (err, result)=>{
        if(err){
            throw err;
        }else{
            console.log("An admin has added a new group " + req.body.groupname);
            res.send({token: {groupname: req.body.groupname}})
        }
    });
})

// Update account details, one cannot change account status and accessGroup in here
app.post('/updateprofile', (req, res)=>{
    if(req.body.password.length===0 && req.body.email.length!=0){
        let myquerystr = `UPDATE accounts SET email = '${req.body.email}' WHERE username = '${req.body.username}'`
        let query = conn.query(myquerystr, (err, result)=>{
        if(err){
            throw err;
        }else{
            console.log(req.body.username + " updated their account details");
        }
        });
    }
    if(req.body.password.length!=0 && req.body.email.length===0){
        const salt = 10;
        const hashedpassword = bcrypt.hashSync(req.body.password, salt);
        let myquerystr = `UPDATE accounts SET password = '${hashedpassword}' WHERE username = '${req.body.username}'`
        let query = conn.query(myquerystr, (err, result)=>{
            if(err){
                throw err;
            }else{
                console.log(req.body.username + " updated their account details");
            }
        });
    }
    if(req.body.password.length!=0 && req.body.email.length!=0){
        const salt = 10;
        const hashedpassword = bcrypt.hashSync(req.body.password, salt);
        let myquerystr = `UPDATE accounts SET password = '${hashedpassword}', email = '${req.body.email}' WHERE username = '${req.body.username}'`
        let query = conn.query(myquerystr, (err, result)=>{
            if(err){
                throw err;
            }else{
                console.log(req.body.username + " updated their account details");
            }
        });
    }
    
})

// get all accounts and access for usermanagement page by inner joining 2 tables
app.post('/getAll', (req, res)=>{
    let thisquery = `SELECT * FROM accounts INNER JOIN access ON accounts.username = access.username`
    let query = conn.query(thisquery, (err, result)=>{
        if(err){
            throw err;
        }else{
            res.send(pipeResponseAsAccountList(result));

        }
    });
})

// get all possible groups in DB
app.post('/getAllGroups', (req, res)=>{
    let thisquery = `SELECT * FROM nodelogin.groups;`
    let query = conn.query(thisquery, (err, result)=>{
        if(err){
            throw err;
        }else{
            res.send(result);

        }
    });
})

// get account details
app.post('/getAcc', (req, res)=>{
    let thisquery = `SELECT * FROM accounts INNER JOIN access ON accounts.username = access.username WHERE id = ${req.body.id}`
    let query = conn.query(thisquery, (err, result)=>{
        if(err){
            throw err;
        }else{
            res.send(pipeResponseAsAccountList(result)[0]);
        }
    });
})

// update an account in db, do not allow same username inputted as the current account being editted
app.post('/updateAcc', (req, res)=>{
    // check if there is existing db row with same username, yes including current one being editted
    let checkquery = `SELECT * FROM accounts WHERE username = '${req.body.username}' AND id <> ${req.body.id}`
    conn.query(checkquery, (err, result) => {
        if(err){
            throw err;
        }else{
            if(result.length===0){
                const salt = 10;
                let updateaccountquery = req.body.password===undefined? `UPDATE accounts SET username = '${req.body.username}', email = '${req.body.email}' WHERE id = ${req.body.id}`
                    : `UPDATE accounts SET username = '${req.body.username}', password = '${bcrypt.hashSync(req.body.password, salt)}', email = '${req.body.email}' WHERE id = ${req.body.id}`
                conn.query(updateaccountquery, (e, r) => {if(e){throw e;}})
                let deleteaccessquery1 = `DELETE FROM access WHERE username = '${req.body.username}'`
                conn.query(deleteaccessquery1, (e, r) => {if(e){throw e;}})
                let deleteaccessquery2 = `DELETE FROM access WHERE username = '${req.body.oldusername}'`
                conn.query(deleteaccessquery2, (e, r) => {if(e){throw e;}})
                req.body.accessGroups.forEach(acc => {
                    let updateaccessquery = `INSERT INTO access(username, accessGroups, status) VALUES ('${req.body.username}', '${acc}', ${req.body.status})`;
                    conn.query(updateaccessquery, (e, r) => {if(e){throw e;}})
                })
                console.log("Account id " + req.body.id + " has been updated by an admin");
                res.send({token: {username: req.body.username}});
            }else{
                console.log("[ERROR]: Existing username already exist");
                res.send({undefined: undefined});
            }
        }
    });
})

// get all tasks and their information
app.post('/getAllTasks', (req, res)=>{
    let thisquery = `SELECT * FROM task`
    let query = conn.query(thisquery, (err, result)=>{
        if(err){
            throw err;
        }else{
            res.send(pipeResponseAsTaskList(result));
        }
    });
})

// get all apps and their information
app.post('/getAllApps', (req, res)=>{
    let thisquery = `SELECT * FROM application`
    let query = conn.query(thisquery, (err, result)=>{
        if(err){
            throw err;
        }else{
            res.send(pipeResponseAsApplicationList(result));
        }
    });
})

// get all plans and their information
app.post('/getAllPlans', (req, res)=>{
    let thisquery = `SELECT * FROM plan`
    let query = conn.query(thisquery, (err, result)=>{
        if(err){
            throw err;
        }else{
            res.send(pipeResponseAsPlanList(result));
        }
    });
})

// get task details
app.post('/getTask', (req, res)=>{
    let thisquery = `SELECT * FROM task WHERE Task_name = '${req.body.taskname}'`
    let query = conn.query(thisquery, (err, result)=>{
        if(err){
            throw err;
        }else{
            res.send(pipeResponseAsTaskList(result)[0]);
        }
    });
})

// get plans in app
app.post('/getPlansInApp', (req, res)=>{
    let thisquery = `SELECT * FROM plan WHERE Plan_App_Acronym = '${req.body.appacro}'`
    let query = conn.query(thisquery, (err, result)=>{
        if(err){
            throw err;
        }else{
            res.send(pipeResponseAsPlanList(result));
        }
    });
})

// add apps
app.post('/addApp', (req, res)=>{
    let thisquery = `SELECT * FROM application WHERE App_Acronym = '${req.body.appAcro}'`
    let query = conn.query(thisquery, (err, result)=>{
        if(err){
            throw err;
        }else{
            if(result.length===0){
                let dequery = `INSERT INTO application(App_Acronym, App_Description, App_Rnumber, App_startDate, App_endDate, App_permit_Open, App_permit_toDoList, App_permit_Doing, App_permit_Done, App_permit_Create) VALUES('${req.body.appAcro}', '${req.body.appDesc}', '${req.body.apprno}', '${convertToDDMMYYYY(req.body.appStartDate)}', '${convertToDDMMYYYY(req.body.appEndDate)}', '${req.body.appPermitOpen}', '${req.body.appPermitTodo}', '${req.body.appPermitDoing}', '${req.body.appPermitDone}', '${req.body.appPermitCreate}')`
                let q = conn.query(dequery, (er, re) => {
                    if(er){
                        res.send({operationStatus: 'FAIL', reason: er.code});
                    }else{
                        console.log("[SUCCESS] Added an Application");
                        res.send({operationStatus: 'SUCCESS', reason: ''});
                    }
                })
            }else{
                console.log("[FAIL] App Acro already exists");
                res.send({operationStatus: 'failed', reason: 'appacro already exists'});
            }
        }
    });
})

// add a task
app.post('/addTask', (req, res)=>{
    let rnumberquery = `SELECT App_Rnumber from application WHERE App_Acronym = '${req.body.taskAppAcro}'`
    let q = conn.query(rnumberquery, (er, re) =>{
        if(er){
            res.send({operationStatus: 'FAIL', reason: er.code});
        }else{
            var today = new Date();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            audittrailstr = req.body.curuser + " created this task at " + req.body.curdate + ", " + time;
            let disquery = `INSERT INTO task(Task_name, Task_description, Task_notes, Task_id, Task_plan, Task_App_Acronym, Task_state, Task_creator, Task_owner, Task_createDate, Task_auditTrail) VALUES ('${req.body.tname}', '${req.body.tdesc}', '${req.body.tnotes}', '${req.body.taskAppAcro+'_'+re[0].App_Rnumber}', '${req.body.taskPlan}', '${req.body.taskAppAcro}', 'open', '${req.body.curuser}', '', '${req.body.curdate}', '${audittrailstr}')`
            let qq = conn.query(disquery, (err, result) => {
                if(err){
                    console.log("[FAIL] Error caught: " + err.code);
                    res.send({operationStatus: 'FAIL', reason: err.code});
                }else{
                    let mequery = `UPDATE application SET App_Rnumber = ${re[0].App_Rnumber+1} WHERE App_Acronym = '${req.body.taskAppAcro}'`
                    let qqq = conn.query(mequery, (errr, ress) => {
                        if(errr){
                            res.send({operationStatus: 'FAIL', reason: errr.code});
                        }else{
                            console.log("[SUCCESS] New Task Added");
                            res.send({operationStatus: 'SUCCESS', reason: ''});
                        }
                    })
                }
            })
        }
    })
})

// check if user is in the group
app.post('/getgroup', (req, res)=>{
    let myquerystr = `SELECT * FROM access WHERE username = '${req.body.username}'`
    let query = conn.query(myquerystr, (err, result)=>{
        if(err){
            throw err;
        }else{
            const newlist = [];
            result.forEach(r => {
                newlist.push(r.accessGroups)
            })
            if(newlist.includes(req.body.group)){
                res.send({token: {found: true}})
            }else{
                res.send({token: {found: false}})
            }
        }
    });
})

// add Plans
app.post('/addPlan', (req, res)=>{
    if(req.body.planMvpName.length!==0 && req.body.planStartDate.length!==0 && req.body.planEndDate.length!==0 && req.body.planAppAcro.length!==0){
        conn.query(`SELECT * from plan WHERE Plan_MVP_Name = '${req.body.planMvpName}'`, (err, result)=>{
            if(result.length===0){
                conn.query(`INSERT INTO plan(Plan_MVP_Name, Plan_startDate, Plan_endDate, Plan_App_Acronym) VALUES('${req.body.planMvpName}', '${convertToDDMMYYYY(req.body.planStartDate)}', '${convertToDDMMYYYY(req.body.planEndDate)}', '${req.body.planAppAcro}')`, (err2, result2) => {
                    if(err2){
                        res.send({operationStatus: 'FAIL', reason: err2.code});
                    }else{
                        console.log("[SUCCESS] New Plan Added");
                        res.send({operationStatus: 'SUCCESS', reason: ''});
                    }
                })
            }else{
                console.log("[FAIL] Plan MVP name already exists during add plan");
                res.send({operationStatus: 'FAIL', reason: 'MVPNAMEALREADYEXIST'});
            }
        });
    }else{
        console.log("[FAIL] Invalid plan inputs during add plan");
        res.send({operationStatus: 'FAIL', reason: 'INVALIDINPUT'});
    }
    
})

// shift Task
app.post('/shiftState', (req, res)=>{
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    strtoadd = `\n\n Task moved to ${req.body.tostate} by ${req.body.curuser} on ${time}.`; 
    conn.query(`SELECT Task_auditTrail FROM task WHERE Task_name = '${req.body.taskname}'`, (er, resu) => {
        let thisquery = `UPDATE task SET Task_state = '${req.body.tostate}', Task_auditTrail = '${resu[0].Task_auditTrail + strtoadd}' WHERE Task_name = '${req.body.taskname}'`
        conn.query(thisquery, (err, result)=>{
            if(err){
                throw err;
            }else{
                console.log("[SUCCESS] A task state is updated");
            }
        });
    })
})