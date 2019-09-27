
const middleware = require("../middleware.js");
const getAll = require("../database-access/get-all-data");
const unstructuredDataAccess = require("../database-access/unstructured-data");
const matchAccess = require("../database-access/match");
const errorHandler = require("./errorHandler");
const cache = require("../cache");

exports.createRoutes = function(app) 
{

    middleware.get(app, "/UnstructuredDataList", (req, res) => {

        res.setHeader("Content-Type", "application/json");

        cache.getAllUnstrucredData((result => {

            let responseObject = { UnstructuredData: result };

            res.send(JSON.stringify(responseObject));

        }), (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, req));

    });

    middleware.get(app, '/UnstructuredData', (req, res) => {
        var usid = req.query.id;


        res.setHeader("Content-Type", "application/json");

        unstructuredDataAccess.deleteEditById(usid, (result => {
            unstructuredDatabyId = result[0];

            matchAccess.getMatchById(unstructuredDatabyId.matchid, (result) => {

                matchDatabyId = result[0];

                let responseObject = { unstructuredData: unstructuredDatabyId, match: matchDatabyId }

                res.send(JSON.stringify(responseObject));
            }, (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, res))

        }), (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, res));
    });

    //updates an edit 
    middleware.put(app, "/UnstructuredData", (req, res) => {


        res.setHeader("Content-Type", "application/json");

        let putErrorHandler = (err) => {

            if (err.message.toLowerCase().includes("cannot add or update a child row")) {

                res.sendStatus(400);

            }
            else if (err.message.toLowerCase().includes("could not find an edit with")) {

                res.sendStatus(404);

            }
            else {

                errorHandler.standard(err, res);

            }

        }

        let UnstructuredData = req.body;

        unstructuredDataAccess.updateUnstructuredData(UnstructuredData, () => {

            res.sendStatus(200);

        },
            (err) => putErrorHandler(err),
            (err) => putErrorHandler(err));

    })

    middleware.post(app, "/UnstructuredData", (req, res) => {

        res.setHeader("Content-Type", "application/json");

        let UnstructuredData = req.body;

        let postErrorHandler = (err) => {

            if (err.message.toLowerCase().includes("cannot add or update a child row")) {

                res.sendStatus(400);

            }
            else {

                errorHandler.standard(err, res);

            }
        }

        unstructuredDataAccess.insertUnstructuredData(UnstructuredData, () => {

            res.sendStatus(200);

        },
            (err) => postErrorHandler(err, res),
            (err) => postErrorHandler(err, res));

    })

    middleware.delete(app, "/UnstructuredData", (req, res) => {

        var usid = req.query.id;

        res.setHeader("Content-Type", "application/json");

        unstructuredDataAccess.deleteUnstrucredData(usid, (result) => {

            res.sendStatus(200);

        }, (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, res))
    })


    //used for the structured data list page 
    middleware.get(app, "/getUnstructuredDataByMatchId", (req, res) => {

        var matchId = req.query.id;

        res.setHeader("Content-Type", "application/json");

        unstructuredDataAccess.getUnstructuredDataByMatchId(matchId, (result => {

            let responseObject = { unstructuredData: result };

            res.send(JSON.stringify(responseObject));

        }), (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, req));

    });
}