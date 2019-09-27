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
        var filename = "data";

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
                        let xml = o2x(responseObject);

                        if (export_type == "xml") {
                            res.setHeader("Content_Type", "application/xml");
                            //var fileContents = Buffer.from(xml, "base64");
                            //var readStream = new stream.PassThrough();
                            //readStream.end(fileContents);
                            //res.set('Content-disposition', 'attachment; filename=' + filename);
                            //res.set('Content-Type', 'text/plain');
                            //readStream.pipe(res);
                            /*var savedFilePath = '/temp/' + filename;
                            fs.writeFile(savedFilePath, fileContents, function() {
                              res.status(200).download(savedFilePath, filename);
                            });*/
                            res.send(xml);
                        }
                        else if (export_type == "json") {
                            res.setHeader("Content-Type", "application/json");
                            /*var savedFilePath = '/temp/' + filename;
                            fs.writeFile(savedFilePath, fileContents, function() {
                              res.status(200).download(savedFilePath, filename);
                            });*/
                            res.send(JSON.stringify(responseObject));
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