exports.createRoutes = function (app) {

  require("./unstructured-data").createRoutes(app)
  require("./edit").createRoutes(app)
  require("./structured-data").createRoutes(app)
  require("./match").createRoutes(app)
  require("./comps").createRoutes(app)
  require("./export").createRoutes(app)
  require("./auth").createRoutes(app)


}