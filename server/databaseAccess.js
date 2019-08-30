const mysqlx = require("@mysql/xdevapi");  

const connectionString = "mysqlx://" + process.env.USER +  ":" + process.env.PASSWORD + "@" + process.env.HOST + ":33060/" + process.env.DATABASE

const client = mysqlx.getClient(connectionString, { pooling: { maxSize: 25, maxIdleTime: 1000, queueTimeout: 2000 } });

/**
 * Querys the database with the given query and then callback on error or success
 * noConnectionCallback is used when you want to handle a failded connection
 * testConnectionString is for failure testing only. 
 */
exports.query = (query,callback,errorCallback,noConnectionCallback,testConnectionString) => 
{   

   let results = [];

   let localConnectionString = testConnectionString != undefined && testConnectionString != null ? testConnectionString : connectionString;

   let localNoConnectionCallback = noConnectionCallback != undefined ? noConnectionCallback : console.log
   
   client.getSession(localConnectionString)        
        .then(session => session.sql(query) //execute query
        .execute(result => results.push(result)) //get results for each row
        .catch(err => errorCallback(err))) //the error for any given row 
        .then(() =>  callback(results)) //collect results
        .catch(err => localNoConnectionCallback(err)); //used when there no connection

}
/**
 * Querys the database with the given list of queries and then callback on error or success
 * Do not use for select queries, it's meant for easier batch inserts only. 
 * Only meta data is returned to the callback function
 * noConnectionCallback is used when you want to handle a failded connection
 * testConnectionString is for failure testing only. 
 */
exports.multiInsertQuery = (querys,callback,errorCallback,noConnectionCallback,testConnectionString) => 
{   

   let results = [];

   let localConnectionString = testConnectionString != undefined && testConnectionString != null ? testConnectionString : connectionString;

   let localNoConnectionCallback = noConnectionCallback != undefined ? noConnectionCallback : console.log
   
   let promises = []

   client.getSession(localConnectionString)
    .then(session => {
        querys.forEach((item,index) => promises.push(session.sql(item).execute()))
        return Promise
            .all(promises)
            .then((result => callback(result)))
            .catch(err => errorCallback(err))
    }).catch(err => localNoConnectionCallback(err))



}
