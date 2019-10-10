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

async function firstUser() {
    let hash = await bcrypt.hash("admin", 8)
    let user = new domain.User(1,"admin",hash,true,"adminkey",null)
    console.log(hash);
    db.insertUser(user, () => {

        console.log("user created", user);
    
    },(err) => {console.log(err);}, (err) => {console.log(err);})
}
firstUser()



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
                        let token = jwt.sign({_id:users[0].id}, process.env.secret)
                        let send = { "token": token}
                        res.send(JSON.stringify(send));
                        db.editTokenByUsername(username, token, () => {
                            console.log(username + " changed token to " + token);
                        }, (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, res))
                    } else {
                        res.sendStatus(400)
                        console.log("Wrong password but found user");
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
                        let hash = await bcrypt.hash(password, 8)
                        db.editPasswordByUsername(username, hash, () => {
                            console.log("user has registered " + username);
                            res.sendStatus(200);
                        }, (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, res))
                        
                    } else {
                        console.log("regkey does not match:" + users[0].regkey + " vs " + regkey);
                        res.sendStatus(400);
                    }
  
                }
            }, (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, res))

        }

    });

    middleware.post(app, "/logout", (req, res) => {

        let user = req.user;

                        
        if (user == null) {
            console.log("Invalid logout");
            res.sendStatus(400);
        } else {
            db.editTokenByUsername(user.username, null, () => {
                console.log(user.username + " has logged out");
            },(err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, res))
        }
    });
    



    middleware.post(app, "/createuser", (req, res) => {

        let username = req.body.username;
        let regkey = req.body.regkey;
        let admin = req.body.admin;

        if (req.user.admin == false) {
            res.sendStatus(403)
            console.log("non admin user tried to create user");
            return
        }
                
        if (username == null || regkey == null || admin == null) {
            console.log("Invalid create user");
            res.sendStatus(400);
        } else {
            db.checkUsernameInUse(username, (inUse) => {
                if (inUse) {
                    console.log("Tried to create username already in use: " + username);
                    res.sendStatus(418)
                } else {
                    let user = new domain.User(null,username,null,admin,regkey,null)
                    db.insertUser(user, () => {
                        console.log("user created", user);
                        res.sendStatus(200)

                    },(err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, res))
                }

            },(err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, res))
        }
    });


}