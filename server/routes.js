const middleware = require("./middleware.js")
const dbAccess = require("./databaseAccess")
const api = require("./football-api")

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

        console.log(err)

      }
      else
      {

        res.sendStatus(500);

      }


    }

    //used for the choose data page
    middleware.get(app,"/allchooseableData",(req,res) => 
    {

      res.setHeader("Content-Type","application/json");

      let unstructuredDataList;
      let structuredDataList; 

      dbAccess.getAllStructuredData((result => 
        {

          structuredDataList = result;

          dbAccess.getAllUnstrucredData(result => 
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

        dbAccess.getAllStructuredData((result => 
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

        dbAccess.getEditById(editId,(result) => 
        {

          if(result.length > 1)
          {

            standardServerErrorHandler(new Error("More then 1 edit with same id"),res);

          }
          if(result.length == 0)
          {

            res.sendStatus(404);

          }
          else
          {

            res.send(JSON.stringify(result[0]));

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

        dbAccess.updateEdit(edit,() => 
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

      dbAccess.insertEdit(edit,() => 
      {

        res.sendStatus(200);

      },
      (err) => postErrorHandler(err,res),
      (err) => postErrorHandler(err,res));
      
    })

    middleware.delete(app,"/edit",(req,res) => 
    {

      var editId = req.query.id;

      dbAccess.getEditById(editId,(result) => 
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

          dbAccess.deleteEditById(editId,(result) => 
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

      dbAccess.getAllEdits((result => 
        {

          let responseObject = {editList: result};

          res.send(JSON.stringify(responseObject));

        }),(err) => standardServerErrorHandler(err,res),(err) => standardServerErrorHandler(err,req));

    });

    //used for the structured data list page 
    middleware.get(app,"/getUnstructuredDataByMatchId",(req,res) => 
    {

      var matchId = req.query.id;

      res.setHeader("Content-Type","application/json");

      dbAccess.getUnstructuredDataByMatchId(matchId,(result => 
        {          

          let responseObject = {unstructuredData: result};

          res.send(JSON.stringify(responseObject));

        }),(err) => standardServerErrorHandler(err,res),(err) => standardServerErrorHandler(err,req));

    });

    //Route to get all matches (GET)
    middleware.get(app,"/matchlist",(req,res) =>  {

      res.setHeader("Content-Type","application/json");

      dbAccess.getAllMatches((result => {

          res.send(JSON.stringify(result));
          res.sendStatus(200);
          
          

       }),(err) => standardServerErrorHandler(err,res),(err) => standardServerErrorHandler(err,req));  
     
    });

    middleware.post(app,"/importdata",(req,res) =>  {

      console.log(req.body);
      console.log(req.body.importRequest.compId);
      api.getAllMatchesBetween(req.body.importRequest.compId, req.body.importRequest.begin, req.body.importRequest.end, (id, start, end, result) => {
        console.log("Got matches for id: " + id + " between " + start + " and " + end);
        console.log(result);
      });
      res.sendStatus(200);

      
     
    });

}