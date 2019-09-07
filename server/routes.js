const middleware = require("./middleware.js")
const dbAccess = require("./databaseAccess")

exports.createRoutes = function(app)
{
    //A standard error handler for routes
    //prints err to console & sends a 500 error message to the client
    let standardServerErrorHandler = (err,res) => 
    {

      if(err != undefined && err != null)
      {

        console.log(err)

      }

      res.sendStatus(500);

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

        }),() => standardServerErrorHandler(req,res),() => standardServerErrorHandler(res,req));  
     
    });

      //used for the structured data list page 
      middleware.get(app,"/structuredDataList",(req,res) => 
      {

        res.setHeader("Content-Type","application/json");

        dbAccess.getAllStructuredData((result => 
          {

            let responseObject = {structuredData: result};

            res.send(JSON.stringify(responseObject));

          }),() => standardServerErrorHandler(req,res),() => standardServerErrorHandler(res,req));

      });

      middleware.get(app,"/edit",(req,res) => 
      {

        var editId = req.query.id;

        res.setHeader("Content-Type","application/json");

        dbAccess.getEditById(editId,(result) => 
        {

          if(result.length > 1)
          {

            standardServerErrorHandler(req,res);

          }
          if(result.length == 0)
          {

            res.sendStatus(404);

          }
          else
          {

            res.send(JSON.stringify(result[0]));

          }


        },() => standardServerErrorHandler, () => standardServerErrorHandler)

      })
}