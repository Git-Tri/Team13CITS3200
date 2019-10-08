const middleware = require("../middleware.js");
const errorHandler = require("./errorHandler");


exports.createRoutes = function(app) {

    //Route to get all competitions (GET)
    middleware.post(app, "/login", (req, res) => {

        cache.getAllComps((result => {

            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(result));


        }), (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, req));

    });


}