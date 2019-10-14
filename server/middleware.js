
const jwt = require('jsonwebtoken')
const errorHandler = require("./routes/errorHandler");
const domain = require("./domain");
const db = require("./database-access/users");
const nodeCookie = require('node-cookie')

//Load .env file
const envResult = require("dotenv").config();

if (envResult.error) {
  throw envResult.error
}

const secret = process.env.secret !== undefined && process.env.secret !== null ? process.env.secret : process.env.SECRET; 

if (secret == null) {
    throw new Error(".env file missing secret key! e.g SECRET=\"randomstring\"")
}

function routingFunctionWrapper(routingFunction)
{

    return (req,res) => 
    {
        try {
            
            console.log("cookies = ", nodeCookie.parse(req, secret));
            let cookie = nodeCookie.get(req, 'authToken', secret);
            
            if (cookie == null) {
                throw new Error("No authToken cookie in request")
            }
            console.log("authToken in cookie is: ", cookie);
            const decoded = jwt.verify(cookie, secret)
            console.log(decoded);
            db.getUserByToken(cookie, (user) => {
                if (user[0] == null) {
                    throw new Error("No user found for token")
                }

                try {
                    req.user = user[0]
                    routingFunction(req,res);
                } catch(e) {
                    res.sendStatus(500);
                    console.error(e)
                }
            }, (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, res))

        } catch (e) {
            console.log(e);
            res.sendStatus(401);
        }
        //authentication check goes here
        
        



    }


}


exports.get = function(app,route,routingFunction)
{

    app.get(route,routingFunctionWrapper(routingFunction))

}

exports.post = function(app,route,routingFunction)
{

    app.post(route,routingFunctionWrapper(routingFunction))

}

exports.put = function(app,route,routingFunction)
{

    app.put(route,routingFunctionWrapper(routingFunction))

}

exports.delete = function(app,route,routingFunction)
{

    app.delete(route,routingFunctionWrapper(routingFunction))

}