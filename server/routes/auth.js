const middleware = require("../middleware.js");
const errorHandler = require("./errorHandler");
const bcrypt = require('bcryptjs');
const domain = require("../domain");
const db = require("../database-access/users");
const errorHandler = require("./errorHandler");

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
        
        if (username === null || password === null) {
            console.log("Invalid login request");
            res.sendStatus(400);
        } else {
            db.getUserByUsername(username, (users) => {
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