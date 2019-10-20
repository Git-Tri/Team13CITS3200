//Load .env file
const envResult = require("dotenv").config();
const fs = require("fs");

if (envResult.error) {
  throw envResult.error
}

//import libaries 
const express = require('express');
const bodyParser = require('body-parser');

const routes = require("./routes/routeSetup.js");
const compsAccess = require("./database-access/comps");
const api = require("./football-api");
const domain = require("./domain");
const path = require('path');
//start app
const app = express();


app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());

app.use(express.static(path.join(__dirname, 'build')));

routes.createRoutes(app)


app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


function getPort()
{

  if(process.env.PORT != null && process.env.PORT != undefined)
  {

    return process.env.PORT;

  } 
  else 
  {

    return 3001;

  }

}

if(fs.existsSync("./key.pem") && fs.existsSync("./key.pem"))
{

  https.createServer({
      key: fs.readFileSync('./key.pem'),
      cert: fs.readFileSync('./cert.pem'),
      passphrase: process.env.SSLPASSPHRASE
  }, app).listen(getPort())


}
else
{

  app.listen(getPort(), () =>
  console.log('Express server is running on localhost:3001')
);

}



if(process.env.APIKEY !== undefined && process.env.APIKEY !== "undefined")
{
  try
  {

    api.getAllCompetitions((result) => {
      
      try{

      let mappedComps = []
      
      let parsedResult = JSON.parse(result);

      console.log(parsedResult);
      if(! Array.isArray(parsedResult) || parsedResult.length < 1)
      {

        throw Error("no comps")

      }
    
    
      parsedResult.forEach((e) => {
        mappedComps.push(new domain.Competition(e.league_id, e.league_name, e.country_name, e.country_id));
      
      });
      compsAccess.insertComps(mappedComps, (result) => {
        console.log("Updated all competitions from API and updated database");
      }, (err) => {console.log(err);},(err) => {console.log(err);});
    }
    catch(error)
    {

      console.error("Issue connecting to the football api, please check your api key in the .env file and connection")

      process.exit();

    }
    });

  }
  catch(error)
  {

    console.error("Issue connecting to the football api, please check your api key in the .env file and connection")

    process.exit();

  }
  

}


module.exports = {getPort};