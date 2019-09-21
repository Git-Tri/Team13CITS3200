
const mysqlx = require("@mysql/xdevapi");  

const connectionString = "mysqlx://" + process.env.USER +  ":" + process.env.PASSWORD + "@" + process.env.HOST + ":33060/" + process.env.DATABASE

const client = mysqlx.getClient(connectionString, { pooling: { maxSize: 50, maxIdleTime: 1000, queueTimeout: 2000 } });




/**
 * Querys the database with the given query and then callback on error or success
 * noConnectionCallback is used when you want to handle a failded connection
 * testConnectionString is for failure testing only. 
 */
function query(query,params,callback,errorCallback,noConnectionCallback,testConnectionString)
{   

        if(params.some(p => ! Number.isInteger(p) && typeof(p) != "string" && typeof(p) != "boolean" && p != null && p != undefined))
        {

                throw new Error("bad input");

        }

        let results = [];

        let localConnectionString = testConnectionString != undefined && testConnectionString != null ? testConnectionString : connectionString;

        let localNoConnectionCallback = noConnectionCallback != undefined ? noConnectionCallback : console.log

        let session = client.getSession(localConnectionString)

        let isError = false;

        let onError = (err) => 
        {

            isError = true;
            
            errorCallback(err)
            
        }

        session.then(session => session.sql(query).bind(params) //execute query
        .execute(result => results.push(result)) //get results for each row
        .catch(err => onError(err))) //the error for any given row 
        .then(() =>  
                {
                if(! isError)
                {
                
                        
                        callback(results);


                }
                session.then((session) => session.close());
                }) //collect results
        .catch(err => localNoConnectionCallback(err))

}
exports.query = query;
/**
 * Querys the database with the given list of queries and then callback on error or success
 * Do not use for select queries, it's meant for easier batch inserts only. 
 * Only meta data is returned to the callback function
 * noConnectionCallback is used when you want to handle a failded connection
 * testConnectionString is for failure testing only. 
 */
function multiInsertQuery(querys,params,callback,errorCallback,noConnectionCallback,testConnectionString)
{   
        //every parameter of every list of parameters should be an integer or string or boolean
        if(params.some(pl => pl.some(p => ! Number.isInteger(p) && typeof(p) != "string" && typeof(p) != "boolean" && p != null && p != undefined)))
        {

                console.error(params);

                throw new Error("bad input");

        }

        let localConnectionString = testConnectionString != undefined && testConnectionString != null ? testConnectionString : connectionString;

        let localNoConnectionCallback = noConnectionCallback != undefined ? noConnectionCallback : console.log

        let promises = [];

        let session = client.getSession(localConnectionString)
        session.then(session => {
        querys.forEach((item,index) => promises.push(session.sql(item).bind(params[index] != undefined ? params[index] : []).execute()))
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

module.exports = { query, 
        multiInsertQuery
         };

