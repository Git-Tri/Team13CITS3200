const middleware = require("./middleware.js")

exports.createRoutes = function(app)
{

    middleware.get(app,'/api/greeting', (req, res) => {
        const name = req.query.name || 'World';
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
      });
      

}