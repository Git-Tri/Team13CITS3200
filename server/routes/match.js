const middleware = require("../middleware.js");
const getAll = require("../database-access/get-all-data");
const matchAccess = require("../database-access/match");
const errorHandler = require("./errorHandler");


exports.createRoutes = function(app) 
{
    //Route to get all matches (GET)
    middleware.get(app, "/matchlist", (req, res) => {

        getAll.getAllMatches((result => {
            console.log("Sending all matches");

            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(result));


        }), (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, req));

    });


    //Route to get single match (GET)
    middleware.get(app, "/match", (req, res) => {

        var matchId = req.query.id;



        matchAccess.getMatchById(matchId, (result => {
            console.log("Sending just match" + matchId);

            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(result));


        }), (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, req));

    });
}