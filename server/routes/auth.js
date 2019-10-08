const middleware = require("../middleware.js");
const errorHandler = require("./errorHandler");
const bcrypt = require('bcryptjs');
const domain = require("../domain");


exports.createRoutes = function(app) {

    //Route to get all competitions (GET)
    middleware.post(app, "/login", (req, res) => {

        let username = req.body.username;
        let password = req.body.password;
        
        if (username === null || password === null) {
            console.log("Invalid login request");
            res.sendStatus(400);
        } else {

        }

        

    });


}