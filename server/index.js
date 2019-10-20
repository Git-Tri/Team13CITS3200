
const fs = require('fs');
const inquirer = require('inquirer');

if(fs.existsSync("./.env"))
{

  require("./website")

}
else
{

    
  fs.open(".env", "w+", (err, fd) => {
  });

  fs.writeFile(".env", "#MYSQL DATA", err => {
    if (err) return console.log(err);
  });

  const promptList = [{
    type: 'input',
    message: 'Please input your Host:',
    name: 'HOST',
  },{
    type: 'input',
    message: 'Please input your Database user Username:',
    name: 'USER',
  },{
    type: 'input',
    message: 'Please input your Database user Password',
    name: 'PASSWORD',
  },{
    type: 'input',
    message: 'Please input your Secret',
    name: 'SECRET',
  },{
  type: 'input',
  message: 'Please input(paste) your API key',
  name: 'KEY',
  },{
  type: 'input',
  message: 'Please input your username for the website',
  name: 'WEBSITE_USER',
  },{
  type: 'input',
  message: 'Please input your password for the website',
  name: 'WEBSITE_PASSWORD',
  },{
    type: 'input',
    message: 'Please input your ssl passphrase (if not using ssl simply press enter)',
    name: 'SSL',
    }];
  inquirer.prompt(promptList).then(answers => {

    var append ="\n" + "HOST=" + '"'+ answers.HOST + '"' + "\n" +
                "USER=" + '"'+ answers.USER + '"' + "\n" +
                "PASSWORD=" + '"'+ answers.PASSWORD + '"' + "\n" +
                'DATABASE="football"'+ "\n" +
                'APIKEY=' + '"'  +  answers.KEY + '"' + "\n" +
                "SECRET="+ '"'+ answers.SECRET + '"' + "\n" +
                "SSLPASSPHRASE=" + answers.SSL;
    fs.appendFile(".env", append, function (err) {

        const envResult = require("dotenv").config();

        if (envResult.error) {
          throw envResult.error
        }

        const auth = require("../server/routes/auth")
        auth.createFirstUser(answers.WEBSITE_USER,answers.WEBSITE_PASSWORD)
        require("./website")
    });
    

  })


}


