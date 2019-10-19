const middleware = require("../middleware.js");
const getAll = require("../database-access/get-all-data");
const editEngine = require("../edit-engine");
var o2x = require('object-to-xml')
const errorHandler = require("./errorHandler");
const cache = require("../cache");

exports.createRoutes = function(app)
{

    middleware.get(app, "/export", (req, res) => {
        var export_type = req.query.type;

        var unstructuredDataArray;
        var structuredDataArray;
        var unstructuredDataResult;
        var structuredDataResult;

        cache.getAllStructuredData((result => {

            structuredDataArray = result;

            editEngine.applyRulesMutiInputs(structuredDataArray, result => {
                structuredDataResult = result;

                cache.getAllUnstrucredData(result => {
                    unstructuredDataArray = result;

                    editEngine.applyRulesMutiInputs(unstructuredDataArray, result => {
                        unstructuredDataResult = result;


                        let responseObject = { structuredData: structuredDataResult, UnstructuredData: unstructuredDataResult }
                        let xml=o2x(responseObject);

                        if (export_type == "xml") {
                            var fileName="data.xml";
                            res.set('Content-Type', 'text/xml');
                            res.set("content-disposition", "attachment; filename=" + fileName);
                            res.write(xml);
                            res.end('');
                        }
                        else if (export_type == "json") {
                            var fileName = 'data.json';
                            res.set('Content-Type', 'text/json');
                            res.set("content-disposition", "attachment; filename=" + fileName);
                            res.write(JSON.stringify(responseObject));
                            res.end('');
                        }
                        else {
                            errorHandler.standard(new Error("need a type"), res);
                        }
                    })
                }, errorHandler.standard, errorHandler.standard);
            })
        }), (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, res));
    })

}