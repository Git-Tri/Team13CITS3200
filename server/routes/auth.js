const middleware = require("../middleware.js");
const errorHandler = require("./errorHandler");
const bcrypt = require('bcryptjs');
const domain = require("../domain");
const db = require("../database-access/users")

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
            db.getUserByID()


        }

        

    });


}