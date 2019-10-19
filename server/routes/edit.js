
const middleware = require("../middleware.js");
const editAccess = require("../database-access/edit");
const unstructuredDataAccess = require("../database-access/unstructured-data");
const structuredDataAccess = require("../database-access/structured-data");
const errorHandler = require("./errorHandler");
const dataValidation = require("../data-validation");
const cache = require("../cache");
const dataPrep = require("../data-prep")

exports.createRoutes = function(app)
{
    //used for the choose data page
    middleware.get(app, "/allchooseableData", (req, res) => {

        res.setHeader("Content-Type", "application/json");

        let unstructuredDataList;
        let structuredDataList;

        cache.getAllStructuredData((result => {

            structuredDataList = result;

            cache.getAllUnstrucredData(result => {

                unstructuredDataList = result;

                let responseObject = { structuredData: structuredDataList, unstructuredData: unstructuredDataList }

                res.send(JSON.stringify(responseObject));

            }, errorHandler.standard, errorHandler.standard)

        }), (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, res));

    });

    //get an edit by id 
    middleware.get(app, "/edit", (req, res) => {

        let editId = Number.parseInt(req.query.id);

        if(Number.isInteger(editId) == false)
        {

            res.sendStatus(400);

            return;

        }

        res.setHeader("Content-Type", "application/json");

        editAccess.getEditById(editId, (editResult) => {

            if (editResult.length > 1) {

                errorHandler.standard(new Error("More then 1 edit with same id"), res);

            }
            if (editResult.length == 0) {

                res.sendStatus(404);

            }
            else {


                let edit = editResult[0];

                let sid = Number.isInteger(edit.structuredDataID) ? [edit.structuredDataID] : [];

                let usid = Number.isInteger(edit.unstructuredDataID) ? [edit.unstructuredDataID] : [];

                unstructuredDataAccess.getUnstructuredDataByIds(usid, (unstructuredResult) => {

                    let unstructuredData = unstructuredResult.length > 0 ? unstructuredResult[0] : null;

                    structuredDataAccess.getStructuredDataByIds(sid, (structuredResult) => {

                        let structuredData = structuredResult.length > 0 ? structuredResult[0] : null;

                        let responseObject = {
                            edit: edit,
                            unstructuredData: unstructuredData,
                            structuredData: structuredData
                        }

                        res.send(JSON.stringify(responseObject));

                    }, (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, req));

                }, (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, req));

            }

        }, (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, res))

    })

    //updates an edit 
    middleware.put(app, "/edit", (req, res) => {

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

        let edit = req.body;

        if(dataValidation.validateEdit(edit) === false)
        {

            res.sendStatus(400)

            return;

        }

        editAccess.updateEdit(edit, () => {

            res.sendStatus(200);

        },
            (err) => putErrorHandler(err),
            (err) => putErrorHandler(err));

    })

    //inserts an edit 
    middleware.post(app, "/edit", (req, res) => {

        res.setHeader("Content-Type", "application/json");

        let edit = req.body;

        if(dataValidation.validateEdit(edit) === false)
        {

            res.sendStatus(400)

            return;

        }

        let postErrorHandler = (err) => {

            if (err.message.toLowerCase().includes("cannot add or update a child row")) {

                res.sendStatus(400);

            }
            else {

                errorHandler.standard(err, res);

            }
        }

        editAccess.insertEdit(edit, () => {

            res.sendStatus(200);

        },
            (err) => postErrorHandler(err, res),
            (err) => postErrorHandler(err, res));

    })

    middleware.delete(app, "/edit", (req, res) => {

        let editId = Number.parseInt(req.query.id);

        if(Number.isInteger(editId) == false)
        {

            res.sendStatus(400);

            return;

        }

        editAccess.getEditById(editId, (result) => {


            if (result.length > 1) {

                errorHandler.standard(new Error("mutiple entry with single id"), res);

            }
            else if (result.length < 1) {

                res.sendStatus(404);

            }
            else {

                res.setHeader("Content-Type", "application/json");

                editAccess.deleteEditById(editId, (result) => {

                    res.sendStatus(200);

                }, (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, res))

            }

        }, (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, res));


    });

    //used for the edit list page with searches 
    middleware.post(app, "/editList", (req, res) => {

        let page = Number.parseInt(req.query.page);

        let editSearches = req.body.editSearches;
        let unstructuredDataSearches = req.body.unstructuredDataSearches;
        let structuredDataSearches = req.body.structuredDataSearches; 

        res.setHeader("Content-Type", "application/json");

        cache.getAllEdits((result => {           

            let editList = dataPrep.search(result,editSearches);
            
            let sids = result.filter(edit => edit.structuredDataID !== null && edit.structuredDataID !== undefined)
                .map(edit => edit.structuredDataID)

            let usids = result.filter(edit => edit.unstructuredDataID !== null && edit.unstructuredDataID !== undefined)
                .map(edit => edit.unstructuredDataID)

            unstructuredDataAccess.getUnstructuredDataByIds(usids, (unstructuredResult) => {

                let unstructuredDataList = unstructuredResult;

                structuredDataAccess.getStructuredDataByIds(sids, (structuredResult) => {

                    let structuredDataList = structuredResult;

                    let responseObject = dataPrep.paginateEditSearchResults(editList,editSearches,
                        unstructuredDataList,unstructuredDataSearches,
                        structuredDataList,structuredDataSearches,page);

                    res.send(JSON.stringify(responseObject));

                }, (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, res));

            }, (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, res));

        }), (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, res));

    });


    //used for the edit list page 
    middleware.get(app, "/editList", (req, res) => {

        let page = Number.parseInt(req.query.page);

        res.setHeader("Content-Type", "application/json");

        cache.getAllEdits((result => {           

            let editList = result   

            let pages = dataPrep.totalPages(editList);

            editList = dataPrep.paginate(editList,page)
            
            let sids = result.filter(edit => edit.structuredDataID !== null && edit.structuredDataID !== undefined)
                .map(edit => edit.structuredDataID)

            let usids = result.filter(edit => edit.unstructuredDataID !== null && edit.unstructuredDataID !== undefined)
                .map(edit => edit.unstructuredDataID)

            unstructuredDataAccess.getUnstructuredDataByIds(usids, (unstructuredResult) => {

                let unstructuredDataList = unstructuredResult;

                structuredDataAccess.getStructuredDataByIds(sids, (structuredResult) => {

                    let structuredDataList = structuredResult;

                    let responseObject = {
                        editList: editList,
                        unstructuredData: unstructuredDataList,
                        structuredData: structuredDataList,
                        pages:pages
                    }

                    res.send(JSON.stringify(responseObject));

                }, (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, req));

            }, (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, req));

        }), (err) => errorHandler.standard(err, res), (err) => errorHandler.standard(err, req));

    });



    middleware.post(app,"/reorder_edit",(req,res) => 
    {

        let edit = req.body.edit;

        let isUp = req.body.isUp;

        

        cache.getAllEdits((edits) => 
        {

                
            let curEdit = edits.filter((e) => e.editID == edit.editID)[0];

            let curIndex = edits.indexOf(curEdit); 
            
            let swapIndex = isUp ? curIndex - 1 : curIndex + 1;

            if(edits[swapIndex] == undefined || edits[swapIndex] == null)
            {

                res.sendStatus(200);
                return;

            }
            else
            {

                //time to juggle

                let swapEdit = edits[swapIndex];

                let tempOrder = curEdit.order; 

                curEdit.order = swapEdit.order;

                swapEdit.order = tempOrder; 

                editAccess.updateEdit(curEdit,() => 
                {
  
                    editAccess.updateEdit(swapEdit,() => 
                    {

                        res.sendStatus(200);
                        return;

                    },errorHandler.standard,errorHandler.standard)

                },errorHandler.standard,errorHandler.standard)

            }

            });

    })
}