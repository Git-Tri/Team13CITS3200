const request = require('request');


const baseUrl = 'https://apiv2.apifootball.com/';
const apiKey = process.env.APIKEY;


function getAllMatchesForComp(compID, callbackFunction) {

  let customURL = baseUrl + "?action=get_events&league_id=" + compID + "&APIkey=" + apiKey;

  request({
    headers: { 'X-Auth-Token': apiKey },
    url: customURL,
    dataType: 'json',
    type: 'GET'
  }, (error, response) => {
    if (error != null) {
      throw Error(error);
    }
    callbackFunction(response.body);

  });
}


//https://apiv2.apifootball.com/?action=get_events&from=2019-04-01&to=2019-04-03&league_id=148&APIkey=xxxxxxxxxxxxxx
//date in format 'YYYY-MM-DD'
function getAllMatchesBetween(compID, startDate, endDate, callbackFunction) {
  
  let customURL = baseUrl + '?action=get_events&from=' + startDate + "&to=" + endDate + "&league_id=" + compID + "&APIkey=" + apiKey;

  request({
    url: customURL,
    dataType: 'json',
    type: 'GET'
  }, (error, response) => {
    if (error != null) {
      throw Error(error);
    }
    callbackFunction(response.body);

  });
}

function getAllCompetitions(callbackFunction) {
  let customURL = baseUrl + '?action=get_leagues&APIkey=' + apiKey;
  request({
    url: customURL,
    dataType: 'json',
    type: 'GET'
  }, (error, response) => {
    if (error != null) {
      throw Error(error);
    }
    callbackFunction(response.body);

  });
}



module.exports = { getAllMatchesForComp, getAllMatchesBetween, getAllCompetitions };

