const mysqlx = require("@mysql/xdevapi");  

const connectionString = "mysqlx://" + process.env.USER +  ":" + process.env.PASSWORD + "@" + process.env.HOST + ":33060/" + process.env.DATABASE

const client = mysqlx.getClient(connectionString, { pooling: { maxSize: 25, maxIdleTime: 1000, queueTimeout: 2000 } });

exports.query = (query,callback,errorCallback) => 
{   

    client.getSession(connectionString)
        .then(session => session.sql(query)
        .execute(result => callback(result))
        .catch(err => errorCallback(err)));

}

