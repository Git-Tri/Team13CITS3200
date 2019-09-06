const mysqlx = require("@mysql/xdevapi");  

const connectionString = "mysqlx://" + process.env.USER +  ":" + process.env.PASSWORD + "@" + process.env.HOST + ":33060/" + process.env.DATABASE

const client = mysqlx.getClient(connectionString, { pooling: { maxSize: 50, maxIdleTime: 1000, queueTimeout: 2000 } });

const dataBinding = require("./dataBinding");

/**
 * Querys the database with the given query and then callback on error or success
 * noConnectionCallback is used when you want to handle a failded connection
 * testConnectionString is for failure testing only. 
 */
function query(query,callback,errorCallback,noConnectionCallback,testConnectionString)
{   


   let results = [];

   let localConnectionString = testConnectionString != undefined && testConnectionString != null ? testConnectionString : connectionString;

   let localNoConnectionCallback = noConnectionCallback != undefined ? noConnectionCallback : console.log
   
   let session = client.getSession(localConnectionString)

        session.then(session => session.sql(query) //execute query
        .execute(result => results.push(result)) //get results for each row
        .catch(err => errorCallback(err))) //the error for any given row 
        .then(() =>  
                {
                        callback(results);
                        session.then((session) => session.close());
                }) //collect results
        .catch(err => localNoConnectionCallback(err))

}
/**
 * Querys the database with the given list of queries and then callback on error or success
 * Do not use for select queries, it's meant for easier batch inserts only. 
 * Only meta data is returned to the callback function
 * noConnectionCallback is used when you want to handle a failded connection
 * testConnectionString is for failure testing only. 
 */
function multiInsertQuery(querys,callback,errorCallback,noConnectionCallback,testConnectionString)
{   

   let results = [];

   let localConnectionString = testConnectionString != undefined && testConnectionString != null ? testConnectionString : connectionString;

   let localNoConnectionCallback = noConnectionCallback != undefined ? noConnectionCallback : console.log
   
   let promises = []

   let session = client.getSession(localConnectionString)
    session.then(session => {
        querys.forEach((item,index) => promises.push(session.sql(item).execute()))
        return Promise
            .all(promises)
            .then((result => 
                {
                        callback(result)
                        session.close();      
                }))
            .catch(err => errorCallback(err))
    }).catch(err => localNoConnectionCallback(err))

}
/**
 * Get all structured data from the database
 * @param {*} callback the callback for the result
 * @param {*} errorCallback  the callback used on error
 * @param {*} noConnectionCallback  callback if there is no connection
 */
function getAllStructuredData(callback,errorCallback,noConnectionCallback)
{

        query("select * from structured_data;",(result) => 
        {

                callback(dataBinding.bindStructredData(result));

        },errorCallback,noConnectionCallback);

}

/**
 * geet all unstructured data from the databasee
 * @param {*} callback the callback for the result
 * @param {*} errorCallback th callback used on error
 * @param {*} noConnectionCallback thee call if there is no connection
 */
function getAllUnstrucredData(callback,errorCallback,noConnectionCallback)
{

        query("select * from football.unstructured_data;",(result) => 
        {

                callback(dataBinding.bindUnstructuredData(result));

        },errorCallback,noConnectionCallback);

} 

module.exports = { query, multiInsertQuery, getAllStructuredData, getAllUnstrucredData }
