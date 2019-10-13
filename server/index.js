const website = require("./website")
const fs = require('fs');
const inquirer = require('inquirer');
const auth = require("../server/routes/auth")

fs.open(".env", "w+", (err, fd) => {
    console.log(fd);
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
    message: 'Please input your Username:',
    name: 'USER',
},{
    type: 'input',
    message: 'Please input your Password',
    name: 'PASSWORD',
},{
    type: 'input',
    message: 'Please input your Secret',
    name: 'SECRET',
}];
inquirer.prompt(promptList).then(answers => {
    //var string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; 
    //let OTP = ''; 
      
    // Find the length of string 
    /*var len = string.length; 
    for (let i = 0; i < 6; i++ ) { 
        OTP += string[Math.floor(Math.random() * len)]; 
    } */
    //console.log("Your one time password is :"+ OTP);
    auth.firstUser(answers.USER,answers.PASSWORD)
    var append ="\n" + "HOST=" + '"'+ answers.HOST + '"' + "\n" +
                "USER=" + '"'+ answers.USER + '"' + "\n" +
                "PASSWORD=" + '"'+ answers.PASSWORD + '"' + "\n" +
                'DATABASE="football"'+ "\n" +
                'APIKEY="8596208b168f5a11bde87614902d2b1d76ffc03f1e3122506f713820f74e528d"'+ "\n" +
                "SECRET="+ '"'+ answers.SECRET + '"';
    fs.appendFile(".env", append, function (err) {
        if (err) return console.log(err);
     });
})
