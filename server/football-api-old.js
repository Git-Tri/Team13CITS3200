const request = require('request');


const baseUrl = 'https://api.football-data.org/v2/matches/';
const apiKey = process.env.APIKEY;


function getAllMatches(compID, callbackFunction) {

  request({
    headers: { 'X-Auth-Token': apiKey },
    url: baseUrl + compID + 'matches',
    dataType: 'json',
    type: 'GET'
  }, (error, response) => {
    if (error != null) {
      throw Error(error);
    }
    callbackFunction(response.body);

  });
}

//date in format 'YYYY-MM-DD'
function getAllMatchesBetween(compID, startDate, endDate, callbackFunction) {
  
  customURL = baseUrl + '?competitions=' + [2002] + '&dateFrom=' + startDate + "&dateTo=" + endDate

  request({
    headers: { 'X-Auth-Token': apiKey },
    url: customURL,
    dataType: 'json',
    type: 'GET'
  }, (error, response) => {
    if (error != null) {
      throw Error(error);
    }
    callbackFunction(compID, startDate, endDate, response.body);

  });
}



module.exports = { getAllMatches, getAllMatchesBetween };


// Available Subresources:

//     Matches (shows all matches of that competition. Defaults to the current season; use ?season=YYYY to retrieve former seasons)

//     Teams (shows all teams of that competition. Defaults to the current season by default; use ?season=YYYY to retrieve former seasons))

//     Standings (shows latest tables (total, home, away) for the current season; not yet available for former seasons)

//     Scorers (shows all goal scorers by shot goals descending for the current season)
