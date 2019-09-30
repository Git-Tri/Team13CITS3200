const middleware = require("../middleware.js");
const getAll = require("../database-access/get-all-data");
const structuredDataAccess = require("../database-access/structured-data");
const matchAccess = require("../database-access/match");
const api = require("../football-api");
const domain = require("../domain");
const errorHandler = require("./errorHandler");
const cache = require("../cache");
const dataPrep = require("../data-prep")

exports.createRoutes = function(app) 
{

    middleware.post(app, "/importdata", (req, res) => {

        let compId = req.body.compId;
        let begin = req.body.begin;
        let end = req.body.end;

        if (begin == null || end == null || compId == null) {
            console.log("Invalid request to import matches");
            res.sendStatus(400);
        } else {
            api.getAllMatchesBetween(compId, begin, end, (result) => {
                console.log("Got matches for id: " + compId + " between " + begin + " and " + end);
                //delete this when we fix the issue          
                result = result.split("'").join("")
                let parsed = JSON.parse(result);
                console.log(parsed);
                let matches = []

                parsed.forEach(e => {
                    matches.push(new domain.InsertMatch(e.match_id, e.league_id, e.match_date, e.match_hometeam_name, e.match_awayteam_name, JSON.stringify(e)));
                });


                matchAccess.insertMatches(matches, (result) => {
                    res.sendStatus(200);
                }, (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, req))
            });
        }

    });

    //used for the structured data list page 
    middleware.post(app, "/structuredDataList", (req, res) => {

        res.setHeader("Content-Type", "application/json");

        let searches = req.body.searches; 

        let page = Number.parseInt(req.query.page);       

        cache.getAllStructuredData((result => {

            let pages = dataPrep.totalPages(result)

            result = dataPrep.search(result,searches)

            let responseObject = {structuredData: dataPrep.paginate(result,page)
                                ,pages:pages
                                 };

            res.send(JSON.stringify(responseObject));

        }), (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, req));

    });

    //used for the structured data list page 
    middleware.get(app, "/structuredDataList", (req, res) => {

        res.setHeader("Content-Type", "application/json");

        let page = Number.parseInt(req.query.page);       

        cache.getAllStructuredData((result => {

            let pages = dataPrep.totalPages(result);

            let responseObject = {structuredData: dataPrep.paginate(result,page)
                                ,pages:pages
                                 };

            res.send(JSON.stringify(responseObject));

        }), (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, req));

    });


    middleware.delete(app, "/structuredData", (req, res) => {

        var id = req.query.id;

        structuredDataAccess.getStructuredData(id, (result) => {


            if (result.length > 1) {

                errorHandler.standard(new Error("mutiple entry with single id"), res);

            }
            else if (result.length < 1) {

                res.sendStatus(404);

            }
            else {

                res.setHeader("Content-Type", "application/json");

                structuredDataAccess.deleteStructuredData(id, (result) => {

                    res.sendStatus(200);

                }, (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, res))

            }

        }, (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, res));

    })

    middleware.get(app, '/StructuredData', (req, res) => {
        var id = req.query.id;


        res.setHeader("Content-Type", "application/json");

        structuredDataAccess.getStructuredData(id, (result => {

            if (result.length < 1) {

                res.sendStatus(404);

            }
            else {

                res.send(JSON.stringify(result[0]));

            }

        }), (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, res));
    });
}