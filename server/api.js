const request = require('request');


const url = 'https://api.football-data.org/v2/';
const apiKey = process.env.APIKEY;


var options = {
    headers: {
      'X-Auth-Token': apiKey
    }
  };

module.exports.test = function() {
    console.log('Using API key: ' + apiKey);
}




// request({ url: url }, (error, response) => {
//     console.log(response);

// });