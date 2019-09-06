const request = require('request');


const url = 'https://api.football-data.org/v2/competitions/';
const apiKey = process.env.APIKEY;

//between start date, end date (optional)
//League



module.exports.test = function() {
    console.log('Using API key: ' + apiKey);
}

var options = {
    headers: {'X-Auth-Token': apiKey}
};


request({ headers: {'X-Auth-Token': apiKey}, url: url + '2019' }, (error, response) => {
    console.log(error);
    console.log(response.body);

});


// Available Subresources:

//     Matches (shows all matches of that competition. Defaults to the current season; use ?season=YYYY to retrieve former seasons)

//     Teams (shows all teams of that competition. Defaults to the current season by default; use ?season=YYYY to retrieve former seasons))

//     Standings (shows latest tables (total, home, away) for the current season; not yet available for former seasons)

//     Scorers (shows all goal scorers by shot goals descending for the current season)
