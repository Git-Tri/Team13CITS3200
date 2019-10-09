const middleware = require("../middleware.js");
const bcrypt = require('bcryptjs');
const errorHandler = require("./errorHandler");
const domain = require("../domain");
const db = require("../database-access/users");
const jwt = require('jsonwebtoken')


// class User
// {

//     constructor(id, username, hash, admin, regkey)
//     {

//         this.id = id; 
//         this.username = username; 
//         this.hash = hash;
//         this.admin = admin;
//         this.regkey = regkey;

//     }

// }


exports.createRoutes = function(app) {

    
    app.post("/login", (req, res) => {

        let username = req.body.username;
        let password = req.body.password;
        console.log("Login attempt with: ");
        console.log(username, password);
        
        
        if (username == null || password == null) {
            console.log("Invalid login request");
            res.sendStatus(400);
        } else {
            db.getUserByUsername(username, async (users) => {
                if (users[0] == null) {
                    res.sendStatus(400);
                } else {
                    
                    let hash = users[0].hash;
                    let match = await bcrypt.compare(password, hash);
                    if (match) {
                        let token = jwt.sign({_id:users[0].id}, 'secretfootball')
                        res.send(token);
                        db.editTokenByUsername(username, token, () => {
                            console.log(username + " changed token to " + token);
                        }, (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, res))
                    }
                    console.log("is match: ", match);


                }
            }, (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, res))

        }

    });

    app.post("/register", (req, res) => {

        let username = req.body.username;
        let password = req.body.password;
        let regkey = req.body.regkey;
        console.log("Register attempt with: ");
        console.log(username, password, regkey);
        
        //let hash = await bcrypt.hash(password, 8)
        if (username == null || password == null || regkey == null) {
            console.log("Invalid login request");
            res.sendStatus(400);
        } else {
            db.getUserByUsername(username, async (users) => {
                if (users[0] == null) {
                    console.log("could not find user: " + username);
                    res.sendStatus(400);
                } else {
                    if (users[0].regkey == regkey) {

                        db.editPasswordByUsername()
                        
                    } else {
                        console.log("regkey does not match:" + users[0].regkey + " vs " + regkey);
                        res.sendStatus(400);
                    }
                    

                    if (match) {
                        let token = jwt.sign({_id:users[0].id}, 'secretfootball')
                        res.send(token);
                        db.editTokenByUsername(username, token, () => {
                            console.log(username + " changed token to " + token);
                        }, (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, res))
                    }
                    console.log("is match: ", match);


                }
            }, (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, res))

        }

    });
    



    middleware.post(app, "/createuser", (req, res) => {

        let username = req.body.username;
        let regkey = req.body.regkey;
        let admin = req.body.admin;

        
        
        if (username == null || regkey == null || admin == null) {
            console.log("Invalid create user");
            res.sendStatus(400);
        } else {
            db.getUserByUsername(username, async (users) => {
                if (users[0] == null) {
                    res.sendStatus(400);
                } else {
                    
                    let hash = users[0].hash;
                    let match = await bcrypt.compare(password, hash);
                    console.log("is match: ", match);


                }
            }, (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, res))


        }

        

        

    });


}