const middleware = require("../middleware.js");
const getAll = require("../database-access/get-all-data");
const errorHandler = require("./errorHandler");

exports.createRoutes = function(app)
{


    //Route to get all competitions (GET)
    middleware.get(app, "/competitions", (req, res) => {

        getAll.getAllComps((result => {

            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(result));


        }), (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, req));

    });


}
