/* SERVER.JS IS THE ENTRY POINT FOR BACKEND AND DATABASE */
const exp = require('express')
const crs = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = exp();
const bcrypt = require('bcrypt');
const { pipeResponseAsAccountList, pipeGenericObjToAccountObj } = require('./models/Account');
app.use(crs());
app.use(bodyParser.json());

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
                            console.log(req.body.Uname + " has logged into the system");
                            res.send({token: {username: req.body.Uname}});
                        }else{
                            console.log(req.body.Uname + " has been disabled sadly");
                            res.send({undefined: undefined});
                        }
                    }
                })
            }else{
                console.log("[ERROR] Invalid Username or Password: "+ req.body.Uname);
                res.send({undefined: undefined});
            }
        }else{
            console.log("[ERROR] Invalid Username or Password: "+ req.body.Uname);
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

app.listen(3001, () => console.log('API is running on http://localhost:3001/login'));

// create database connection
const conn = mysql.createConnection({host: 'localhost', user: 'root', password: 'conjugatebase', database: 'nodelogin'});
conn.connect((err) =>{
    if(err) throw err;
    console.log('Mysql Connected...');
});

// test manual insert a new account, bare in mind need to run this tgt with server startup
// let myquerystr = "INSERT INTO accounts (username, password, email) VALUES ('maxverstappen', 'stunns', 'max@gg.com')"
// let query = conn.query(myquerystr, (err, result)=>{
//     if(err) throw err;
// });
// let myquerystr = "INSERT INTO access (id, accessright) VALUES (12, 'user')"
// let query = conn.query(myquerystr, (err, result)=>{
//     if(err) throw err;
// });

// test variable insert
// accounts = [['maxverstappen', 'stunns', 'max@gg.com'], ['meganfox', 'ssns', 'mmg@gg.com'], ['marcus', 'ffdns', 'mrc@gg.com']];
// let myquerystr = "INSERT INTO accounts (username, password, email) VALUES ?"
// let query = conn.query(myquerystr, [accounts], (err, result)=>{
//     if(err) throw err;
// });

