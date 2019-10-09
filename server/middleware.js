
const jwt = require('jsonwebtoken')
const errorHandler = require("./routes/errorHandler");
const domain = require("./domain");
const db = require("./database-access/users");

const secret = process.env.secret;

function routingFunctionWrapper(routingFunction)
{

    return (req,res) => 
    {
        try {
            const token = req.header('Authorization').replace('Bearer ', '')
            const decoded = jwt.verify(token, secret)
            db.getUserByToken(decoded, (user) => {
                if (user[0] == null) {
                    throw new Error()
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