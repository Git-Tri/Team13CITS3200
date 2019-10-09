
const jwt = require('jsonwebtoken')
const secret = process.env.secret;

function routingFunctionWrapper(routingFunction)
{

    return (req,res) => 
    {
        try {
            const token = req.header('Authorization').replace('Bearer ', '')
            const decoded = jwt.verify(token, secret)
        } catch (e) {
            res.sendStatus(401);
        }
        //authentication check goes here
        
        try
        {

            routingFunction(req,res);

        }
        catch(e)
        {

            res.sendStatus(500);

            console.error(e)

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