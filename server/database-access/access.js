const dbQuery = require("./database-query");

const cache = require("../cache");

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

        cache.invalidBySQL(query)
        
        dbQuery.query(query,params,(result) => 
        {
        
                cache.revalidBySQL(query); 

                callback(result)

        },errorCallback,noConnectionCallback,testConnectionString);

}
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

        let sql = querys.reduce((a,b) => a.concat(b));

        cache.invalidBySQL(sql)

        dbQuery.multiInsertQuery(querys,params,(result) => 
        {
        
                cache.revalidBySQL(sql);
                
                callback(result)

        },errorCallback,noConnectionCallback,testConnectionString);

}



module.exports = { query, 
        multiInsertQuery
         };
