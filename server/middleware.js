
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

const secret = process.env.SECRET; 

if (secret == null) {
    throw new Error(".env file missing secret key! e.g SECRET=\"randomstring\"")
}

function handleUnauthorised(res)
{

    res.sendStatus(401)

}

function routingFunctionWrapper(routingFunction)
{
    
    //return routingFunction
    return (req,res) =>     
    {

        try {
            
            console.log("cookies = ", nodeCookie.parse(req, secret));
            let cookie = nodeCookie.get(req, 'authToken', secret);


            
            if (cookie == null) {
                let apikey = req.header('apikey')
                if (apikey == null) {
                    handleUnauthorised(res)
                    return
                } else {
                    console.log("no cookie but found apikey in header");
                    console.log("api key: " + apikey);
                    db.getUserByAPIKey(apikey, (user) => {
                        if (user[0] == null) {
                            handleUnauthorised(res)
                            return
                        }
        
                        try {
                            req.user = user[0]
                            routingFunction(req,res);
                        } catch(e) {
                            res.sendStatus(500);
                            console.error(e)
                        }
                    }, (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, res))

                                        

                }
                
            } else {
            console.log("authToken in cookie is: ", cookie);
            const decoded = jwt.verify(cookie, secret)
            console.log(decoded);
            db.getUserByToken(cookie, (user) => {
                if (user[0] == null) {
                    handleUnauthorised(res)
                    return;
                }

                try {
                    req.user = user[0]
                    routingFunction(req,res);
                } catch(e) {
                    res.sendStatus(500);
                    console.error(e)
                }
            }, (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, res))
        }
        } catch (e) {
            console.log(e);
            handleUnauthorised(res)
        }
             
        



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