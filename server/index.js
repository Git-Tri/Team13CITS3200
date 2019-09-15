//Load .env file
const envResult = require("dotenv").config();

if (envResult.error) {
  throw envResult.error
}

//import libaries 
const express = require('express');
const bodyParser = require('body-parser');

const routes = require("./routes.js");
const dbAccess = require("./databaseAccess");
const api = require("./football-api");
const domain = require("./domain");

//start app
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());

routes.createRoutes(app)

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


app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);

if(process.env.APIKEY !== undefined)
{
  
  api.getAllCompetitions((result) => {
    
    let mappedComps = []
    
    let parsedResult = JSON.parse(result);
    
    parsedResult.forEach((e) => {
      mappedComps.push(new domain.Competition(e.league_id, e.league_name, e.country_name, e.country_id));
    
    });
    dbAccess.insertComps(mappedComps, (result) => {
      console.log("Updated all competitions from API and updated database");
    }, (err) => {console.log(err);},(err) => {console.log(err);});
  });

}


module.exports = {getPort};