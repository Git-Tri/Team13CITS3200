const middleware = require("../middleware.js");
const getAll = require("../database-access/get-all-data");
const matchAccess = require("../database-access/match");
const errorHandler = require("./errorHandler");
const cache = require("../cache");
const dataPrep = require("../data-prep")

exports.createRoutes = function(app) 
{

     //Route to get all matches with search
     middleware.post(app, "/matchlist", (req, res) => {

        cache.getAllMatches((result => {        

            let searches = req.body.searches; 

            let page = Number.parseInt(req.query.page);

            result = dataPrep.search(result,searches)

            let pages = dataPrep.totalPages(result)

            let responseObject = {matches: dataPrep.paginate(result,page),
                                 pages:pages}

            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(responseObject));


        }), (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, req));

    });

    //Route to get all matches (GET)
    middleware.get(app, "/matchlist", (req, res) => {

        cache.getAllMatches((result => {
            
            let page = Number.parseInt(req.query.page);

            let pages = dataPrep.totalPages(result)

            let responseObject = {matches: dataPrep.paginate(result,page),
                                 pages:pages}

            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(responseObject));


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