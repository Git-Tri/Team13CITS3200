const middleware = require("./middleware.js");
const dbAccess = require("./database-access/access");
const getAll = require("./database-access/get-all-data");
const editAccess = require("./database-access/edit");
const unstructuredDataAccess = require("./database-access/unstructured-data");
const structuredDataAccess = require("./database-access/structured-data");
const matchAccess = require("./database-access/match");
const api = require("./football-api");
const domain = require("./domain");
const editEngine = require("./editEngine");
var o2x = require('object-to-xml')

exports.createRoutes = function(app)
{
    //A standard error handler for routes
    //prints err to console & sends a 500 error message to the client
    let standardServerErrorHandler = (err,res) => 
    {

      if(err.message == "bad input")
      {

        res.sendStatus(400);

      }
      else if(err != undefined && err != null)
      {

        console.error(err);

        res.sendStatus(500);

      }
      else
      {

        res.sendStatus(500);

      }


    }

    

    middleware.get(app,"/UnstructuredDataList",(req,res) => 
      {

        res.setHeader("Content-Type","application/json");

        getAll.getAllUnstrucredData((result => 
          {

            let responseObject = {UnstructuredData: result};

            res.send(JSON.stringify(responseObject));

          }),(err) => standardServerErrorHandler(err,res),(err) => standardServerErrorHandler(err,req));

      });

      middleware.get(app,'/UnstructuredData',(req, res)=>
    {
      var usid=req.query.id;
      

      res.setHeader("Content-Type","application/json");
      //var data="'usid'";
      let unstructuredData;
      let matchData;
      
      unstructuredDataAccess.deleteEditById(usid,(result =>
      {
        unstructuredDatabyId = result[0];
        
        matchAccess.getMatchById(unstructuredDatabyId.matchid,(result)=>
          {

            matchDatabyId = result[0];

            let responseObject = {unstructuredData:unstructuredDatabyId , match:matchDatabyId}

            res.send(JSON.stringify(responseObject));
          },(err) => standardServerErrorHandler(err,res),(err) => standardServerErrorHandler(err,res))
        
      }),(err) => standardServerErrorHandler(err,res),(err) => standardServerErrorHandler(err,res)); 
    });

    //updates an edit 
    middleware.put(app,"/UnstructuredData",(req,res) => 
    {

      
      res.setHeader("Content-Type","application/json");

      let putErrorHandler = (err) => 
      {

        if(err.message.toLowerCase().includes("cannot add or update a child row"))
        {

          res.sendStatus(400);

        }
        else if(err.message.toLowerCase().includes("could not find an edit with"))
        {

          res.sendStatus(404);

        }
        else
        {

          standardServerErrorHandler(err,res);

        }

      }

      let UnstructuredData = req.body;

      unstructuredDataAccess.updateUnstructuredData(UnstructuredData,() => 
      {                

        res.sendStatus(200);          

      },
      (err) => putErrorHandler(err), 
      (err) => putErrorHandler(err));

    })

    middleware.post(app,"/UnstructuredData",(req,res) => 
    {

      res.setHeader("Content-Type","application/json");

      let UnstructuredData = req.body;

      let postErrorHandler = (err) => 
      {

        if(err.message.toLowerCase().includes("cannot add or update a child row"))
        {

          res.sendStatus(400);

        }
        else 
        {

          standardServerErrorHandler(err,res);

        }
      }

      unstructuredDataAccess.insertUnstructuredData(UnstructuredData,() => 
      {

        res.sendStatus(200);

      },
      (err) => postErrorHandler(err,res),
      (err) => postErrorHandler(err,res));
      
    })

    middleware.delete(app,"/UnstructuredData",(req,res) => 
    {

      var usid = req.query.id;
          
      res.setHeader("Content-Type","application/json");

      unstructuredDataAccess.deleteUnstrucredData(usid,(result) => 
      {

      res.sendStatus(200);

      },(err) => standardServerErrorHandler(err,res), (err) => standardServerErrorHandler(err,res))
    })

    //used for the choose data page
    middleware.get(app,"/allchooseableData",(req,res) => 
    {

      res.setHeader("Content-Type","application/json");

      let unstructuredDataList;
      let structuredDataList; 

      getAll.getAllStructuredData((result => 
        {

          structuredDataList = result;

          getAll.getAllUnstrucredData(result => 
            {

              unstructuredDataList = result; 

              let responseObject = {structuredData: structuredDataList, unstructuredData: unstructuredDataList}

              res.send(JSON.stringify(responseObject));

            },standardServerErrorHandler,standardServerErrorHandler)

        }),(err) => standardServerErrorHandler(err,res),(err) => standardServerErrorHandler(err,res));  
     
    });

      //used for the structured data list page 
      middleware.get(app,"/structuredDataList",(req,res) => 
      {

        res.setHeader("Content-Type","application/json");

        getAll.getAllStructuredData((result => 
          {

            let responseObject = {structuredData: result};

            res.send(JSON.stringify(responseObject));

          }),(err) => standardServerErrorHandler(err,res),(err) => standardServerErrorHandler(err,req));

      });

      //get an edit by id 
      middleware.get(app,"/edit",(req,res) => 
      {

        var editId = req.query.id;

        res.setHeader("Content-Type","application/json");

        editAccess.getEditById(editId,(editResult) => 
        {

          if(editResult.length > 1)
          {

            standardServerErrorHandler(new Error("More then 1 edit with same id"),res);

          }
          if(editResult.length == 0)
          {

            res.sendStatus(404);

          }
          else
          {
           

            let edit = editResult[0];

            let sid = Number.isInteger(edit.structuredDataID) ? [edit.structuredDataID] : [];

            let usid = Number.isInteger(edit.unstructuredDataID) ? [edit.unstructuredDataID] : [];

            unstructuredDataAccess.getUnstructuredDataByIds(usid,(unstructuredResult) => 
            {

              let unstructuredData = unstructuredResult.length > 0 ? unstructuredResult[0] : null;

              structuredDataAccess.getStructuredDataByIds(sid,(structuredResult) => 
              {

                let structuredData =  structuredResult.length > 0 ? structuredResult[0] : null;

                let responseObject = {edit:edit,
                                      unstructuredData:unstructuredData,
                                      structuredData:structuredData}

                res.send(JSON.stringify(responseObject));

              },(err) => standardServerErrorHandler(err,res),(err) => standardServerErrorHandler(err,req));

            },(err) => standardServerErrorHandler(err,res),(err) => standardServerErrorHandler(err,req));

          }         

        },(err) => standardServerErrorHandler(err,res), (err) => standardServerErrorHandler(err,res))

      })

      //updates an edit 
      middleware.put(app,"/edit",(req,res) => 
      {
        
        res.setHeader("Content-Type","application/json");

        let putErrorHandler = (err) => 
        {

          if(err.message.toLowerCase().includes("cannot add or update a child row"))
          {

            res.sendStatus(400);

          }
          else if(err.message.toLowerCase().includes("could not find an edit with"))
          {

            res.sendStatus(404);

          }
          else
          {

            standardServerErrorHandler(err,res);

          }

        }

        let edit = req.body;

        editAccess.updateEdit(edit,() => 
        {                

          res.sendStatus(200);          

        },
        (err) => putErrorHandler(err), 
        (err) => putErrorHandler(err));

      })

    //inserts an edit 
    middleware.post(app,"/edit",(req,res) => 
    {

      res.setHeader("Content-Type","application/json");

      let edit = req.body;

      let postErrorHandler = (err) => 
      {

        if(err.message.toLowerCase().includes("cannot add or update a child row"))
        {

          res.sendStatus(400);

        }
        else 
        {

          standardServerErrorHandler(err,res);

        }
      }

      editAccess.insertEdit(edit,() => 
      {

        res.sendStatus(200);

      },
      (err) => postErrorHandler(err,res),
      (err) => postErrorHandler(err,res));
      
    })

    middleware.delete(app,"/edit",(req,res) => 
    {

      var editId = req.query.id;

      editAccess.getEditById(editId,(result) => 
      {


        if(result.length > 1)
        {

          standardServerErrorHandler(new Error("mutiple entry with single id"),res);

        }
        else if(result.length < 1)
        {

          res.sendStatus(404);

        }
        else
        {
          
          res.setHeader("Content-Type","application/json");

          editAccess.deleteEditById(editId,(result) => 
          {
    
          res.sendStatus(200);
    
          },(err) => standardServerErrorHandler(err,res), (err) => standardServerErrorHandler(err,res))
   
        }

      },(err) => standardServerErrorHandler(err,res),(err) => standardServerErrorHandler(err,res));

     
    });

    //used for the edit list page 
    middleware.get(app,"/editList",(req,res) => 
    {

      res.setHeader("Content-Type","application/json");

      getAll.getAllEdits((result => 
        {

          let editList = result;

          let sids = result.filter(edit => edit.structuredDataID !== null && edit.structuredDataID !== undefined)
                          .map(edit => edit.structuredDataID)

          let usids = result.filter(edit => edit.unstructuredDataID !== null && edit.unstructuredDataID !== undefined)
                          .map(edit => edit.unstructuredDataID)

          unstructuredDataAccess.getUnstructuredDataByIds(usids,(unstructuredResult) => 
          {

            let unstructuredDataList = unstructuredResult;

            structuredDataAccess.getStructuredDataByIds(sids,(structuredResult) => 
            {

              let structuredDataList = structuredResult; 

              let responseObject = {editList:editList,
                                    unstructuredData:unstructuredDataList,
                                    structuredData:structuredDataList}

              res.send(JSON.stringify(responseObject));

            },(err) => standardServerErrorHandler(err,res),(err) => standardServerErrorHandler(err,req));

          },(err) => standardServerErrorHandler(err,res),(err) => standardServerErrorHandler(err,req));

        }),(err) => standardServerErrorHandler(err,res),(err) => standardServerErrorHandler(err,req));

    });

    //used for the structured data list page 
    middleware.get(app,"/getUnstructuredDataByMatchId",(req,res) => 
    {

      var matchId = req.query.id;

      res.setHeader("Content-Type","application/json");

      unstructuredDataAccess.getUnstructuredDataByMatchId(matchId,(result => 
        {          

          let responseObject = {unstructuredData: result};

          res.send(JSON.stringify(responseObject));

        }),(err) => standardServerErrorHandler(err,res),(err) => standardServerErrorHandler(err,req));

    });

    //Route to get all matches (GET)
    middleware.get(app,"/matchlist",(req,res) =>  {

      getAll.getAllMatches((result => {
          console.log("Sending all matches");
          
          res.setHeader("Content-Type","application/json");
          res.send(JSON.stringify(result));
          

        }),(err) => standardServerErrorHandler(err,res),(err) => standardServerErrorHandler(err,req));  
     
    });

    //Route to get all competitions (GET)
    middleware.get(app,"/competitions",(req,res) =>  {
     
      getAll.getAllComps((result => {
          
          res.setHeader("Content-Type","application/json");
          res.send(JSON.stringify(result));
          

        }),(err) => standardServerErrorHandler(err,res),(err) => standardServerErrorHandler(err,req));  
     
    });

    //Route to get single match (GET)
    middleware.get(app,"/match",(req,res) =>  {

      var matchId = req.query.id;

      

      matchAccess.getMatchById(matchId, (result => {
          console.log("Sending just match" + matchId);
          
          res.setHeader("Content-Type","application/json");
          res.send(JSON.stringify(result));
          

        }),(err) => standardServerErrorHandler(err,res),(err) => standardServerErrorHandler(err,req));  
     
    });

    middleware.post(app,"/importdata",(req,res) =>  {
      
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
        

          matchAccess.insertMatches(matches, (result) =>{
            res.sendStatus(200);
          }, (err) => standardServerErrorHandler(err,res),(err) => standardServerErrorHandler(err,req))
        });
      }

    });
     
    middleware.delete(app,"/structuredData",(req,res) => 
    {

      var id = req.query.id;

      structuredDataAccess.getStructuredData(id,(result) => 
      {


        if(result.length > 1)
        {

          standardServerErrorHandler(new Error("mutiple entry with single id"),res);

        }
        else if(result.length < 1)
        {

          res.sendStatus(404);

        }
        else
        {
          
          res.setHeader("Content-Type","application/json");

          structuredDataAccess.deleteStructuredData(id,(result) => 
          {
    
          res.sendStatus(200);
    
          },(err) => standardServerErrorHandler(err,res), (err) => standardServerErrorHandler(err,res))
   
        }

      },(err) => standardServerErrorHandler(err,res),(err) => standardServerErrorHandler(err,res));

    })

    middleware.get(app,'/StructuredData',(req, res)=>
    {
      var id=req.query.id;
      

      res.setHeader("Content-Type","application/json");
      
      structuredDataAccess.getStructuredData(id,(result =>
      {
        
        if(result.length < 1)
        {

          res.sendStatus(404);

        }
        else
        {

          res.send(JSON.stringify(result[0]));

        }              
        
      }),(err) => standardServerErrorHandler(err,res),(err) => standardServerErrorHandler(err,res)); 
    });

    
    middleware.get(app,"/export",(req,res)=>
    {
      var export_type = req.query.type;
      var filename = "data";

      var unstructuredDataArray;
      var structuredDataArray;
      var unstructuredDataResult;
      var structuredDataResult;

      getAll.getAllStructuredData((result =>
        {

          structuredDataArray = result;

          editEngine.applyRulesMutiInputs(structuredDataArray,result=>
            {
              structuredDataResult = result;
            

          getAll.getAllUnstrucredData(result=>
            {
              unstructuredDataArray = result;

              editEngine.applyRulesMutiInputs(unstructuredDataArray,result=>
                {
                  unstructuredDataResult = result;
                

                let responseObject = {structuredData: structuredDataResult, UnstructuredData: unstructuredDataResult}
                let xml = o2x(responseObject);

                if(export_type == "xml"){
                  res.setHeader("Content_Type","application/xml");
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
                else if(export_type == "json"){
                  res.setHeader("Content-Type","application/json");
                  /*var savedFilePath = '/temp/' + filename;
                  fs.writeFile(savedFilePath, fileContents, function() {
                    res.status(200).download(savedFilePath, filename);
                  });*/
                  res.send(JSON.stringify(responseObject));
                }
                else{
                  standardServerErrorHandler(new Error("need a type"),res);
                }
            })
            },standardServerErrorHandler,standardServerErrorHandler);
          })
        }),(err) => standardServerErrorHandler(err,res),(err) => standardServerErrorHandler(err,res));
    })    


}