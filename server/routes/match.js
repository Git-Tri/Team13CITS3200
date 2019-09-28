const middleware = require("../middleware.js");
const getAll = require("../database-access/get-all-data");
const matchAccess = require("../database-access/match");
const errorHandler = require("./errorHandler");
const cache = require("../cache");
const dataPrep = require("../data-prep")

exports.createRoutes = function(app) 
{
    //Route to get all matches (GET)
    middleware.get(app, "/matchlist", (req, res) => {

        cache.getAllMatches((result => {
            console.log("Sending all matches");

            let searches = req.body.searches; 

            let page = Number.parseInt(req.query.page);

            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(dataPrep.searchAndPaginate(result,page,searches)));


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