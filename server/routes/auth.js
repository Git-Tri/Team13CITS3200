const middleware = require("../middleware.js");
const errorHandler = require("./errorHandler");
const bcrypt = require('bcryptjs');
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

    //Route to get all competitions (GET)
    middleware.post(app, "/login", (req, res) => {

        let username = req.body.username;
        let password = req.body.password;
        console.log("Login attempt with: ");
        console.log(username);
        console.log(password);
        
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