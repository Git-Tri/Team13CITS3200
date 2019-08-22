const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const routes = require("./routes.js");


const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

routes.createRoutes(app)

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);