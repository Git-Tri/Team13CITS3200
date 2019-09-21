    //A standard error handler for routes
    //prints err to console & sends a 500 error message to the client
    exports.standard = function(err,res) 
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
