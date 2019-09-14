const request = require('request');


const baseUrl = 'https://api.football-data.org/v2/competitions/';
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
  console.log("Trying to get all matches from: " + baseUrl + compID + 'matches' + '/?dateFrom=' + startDate + "/?dateTo=" + endDate);
  request({
    headers: { 'X-Auth-Token': apiKey },
    url: baseUrl + compID + '/matches' + '/?dateFrom=' + startDate + "&dateTo=" + endDate,
    dataType: 'json',
    type: 'GET'
  }, (error, response) => {
    if (error != null) {
      throw Error(error);
    }
    callbackFunction(response.body);

  });
}



getAllMatchesBetween('WC', '2018-05-30', '2019-09-06', function (response) {
  //console.log(response);
  console.log("recieved matches between 2018-05-30 and 2019-09-06");
});


module.exports = { getAllMatches, getAllMatchesBetween };


// Available Subresources:

//     Matches (shows all matches of that competition. Defaults to the current season; use ?season=YYYY to retrieve former seasons)

//     Teams (shows all teams of that competition. Defaults to the current season by default; use ?season=YYYY to retrieve former seasons))

//     Standings (shows latest tables (total, home, away) for the current season; not yet available for former seasons)

//     Scorers (shows all goal scorers by shot goals descending for the current season)
