const mysqlx = require("@mysql/xdevapi");  

const connectionString = "mysqlx://" + process.env.USER +  ":" + process.env.PASSWORD + "@" + process.env.HOST + ":33060/" + process.env.DATABASE

const client = mysqlx.getClient(connectionString, { pooling: { maxSize: 50, maxIdleTime: 1000, queueTimeout: 2000 } });

const dataBinding = require("./dataBinding");

const dataValidation = require("./dataValidation");


function __listToSQList(list)
{

        return JSON.stringify(list).replace("[","(").replace("]",")");

}

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

        let isError = false;

        let onError = (err) => 
        {

            isError = true;
            
            errorCallback(err)
            
        }

        session.then(session => session.sql(query) //execute query
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
 * @param {*} noConnectionCallback the call if there is no connection
 */
function getAllUnstrucredData(callback,errorCallback,noConnectionCallback)
{

        query("select * from football.unstructured_data;",(result) => 
        {

                callback(dataBinding.bindUnstructuredData(result));

        },errorCallback,noConnectionCallback);

} 

/**
 * geet unstructured data from the databasee
 * @param {*} usid the id of the unstrucredData which need to be selected
 * @param {*} callback the callback for the result
 * @param {*} errorCallback th callback used on error
 * @param {*} noConnectionCallback thee call if there is no connection
 */
function getUnstrucredData(usid,callback,errorCallback,noConnectionCallback)
{
         
        query("select * from football.unstructured_data where usid = "+ usid + ";",
        (result) => 
        {

                callback(dataBinding.bindUnstructuredData(result));

        },errorCallback,noConnectionCallback);

}

/**
 * geet unstructured data from the databasee
 * @param {*} usid the id of the match which need to be selected
 * @param {*} callback the callback for the result
 * @param {*} errorCallback th callback used on error
 * @param {*} noConnectionCallback thee call if there is no connection
 */
function getMatch(usid,callback,errorCallback,noConnectionCallback)
{
        
        query("select m.* from football.match m , football.unstructured_Data u where m.id=u.matchid and u.usid =" + usid +";",
        (result) => 
        {

                callback(dataBinding.bindMatch(result));

        },errorCallback,noConnectionCallback);

}

/**
 * Updates a given edit 
 * Fails slightly if id does not exist
 * @param {*} UnstructuredData  the edit update with
 * @param {*} callback the callback on success 
 * @param {*} errorCallback  the callback on error
 * @param {*} noConnectionCallback  the call back if connection fails
 */
function updateUnstructuredData(UnstructuredData,callback,errorCallback,noConnectionCallback)
{
                
        getUnstrucredData(UnstructuredData.id,(result) => 
        {
                        
                if(result.length !== 1)
                {

                        errorCallback(new Error("Could not find an edit with id " + UnstructuredData.id));
                        return;

                }

                UnstructuredData.published = new Date(UnstructuredData.published)

                UnstructuredData.extracted = new Date(UnstructuredData.extracted)

                let sqlquery = "update football.unstructured_data set " + 
                " matchid = " + UnstructuredData.matchid +
                ",title = '" + UnstructuredData.title + "'" +
                ",author = '" + UnstructuredData.author + "'" +
                ",url = '" + UnstructuredData.url + "'" + 
                ",published = '" + UnstructuredData.published.getFullYear() +"/" + (UnstructuredData.published.getMonth()) + "/" + (UnstructuredData.published.getDate()) + "'" +
                ",extracted = '" + UnstructuredData.extracted.getFullYear() +"/" + (UnstructuredData.extracted.getMonth()) + "/" + (UnstructuredData.extracted.getDate()) +"'" +
                ",data = '" + UnstructuredData.data + "'" +
                "where usid = " + UnstructuredData.id + ";"
        
                query(sqlquery,callback,errorCallback,noConnectionCallback);
        
        },errorCallback,noConnectionCallback)


}

/**
 * insert a given edit 
 * @param {*} edit  the edit to insert with
 * @param {*} callback the callback on success 
 * @param {*} errorCallback  the callback on error
 * @param {*} noConnectionCallback  the call back if connection fails
 */
function insertUnstructuredData(UnstructuredData,callback,errorCallback,noConnectionCallback)
{

        UnstructuredData.published = new Date(UnstructuredData.published)

        UnstructuredData.extracted = new Date(UnstructuredData.extracted)

        let sqlquery = "insert into football.unstructured_data(matchid,title,author,url,published,extracted,data) " + 
        "values('" + UnstructuredData.matchid + "','" + UnstructuredData.title + "','" + 
        UnstructuredData.author + "','" + UnstructuredData.url + "','" + 
        UnstructuredData.published.getFullYear() +"/" + (UnstructuredData.published.getMonth()) + "/" + (UnstructuredData.published.getDate()) + "','" + 
        UnstructuredData.extracted.getFullYear() +"/" + (UnstructuredData.extracted.getMonth()) + "/" + (UnstructuredData.extracted.getDate()) +"','" +
        UnstructuredData.data  + "')";

        query(sqlquery,callback,errorCallback,noConnectionCallback);

        

}

/**
 * Delete an unstructuredData by the id
 * @param {*} usid the id of the unstructuredData
 * @param {*} callback the callback function on success
 * @param {*} errorCallback the callback used on error
 * @param {*} noConnectionCallback the callback used if there is no connection
 */
function deleteUnstrucredData(usid,callback,errorCallback,noConnectionCallback)
{
        query("delete from football.unstructured_data where usid =" + usid + ";",
        (result) => 
        {
                callback(dataBinding.bindUnstructuredData(result));

        },errorCallback,noConnectionCallback)
}



/**
 * Gets an edit by the id  
 * @param {*} id the id of the edit to get must be a number
 * @param {*} callback the callback function on success
 * @param {*} errorCallback the callback used on error
 * @param {*} noConnectionCallback the callback used if there is no connection
 */
function getEditById(id,callback,errorCallback,noConnectionCallback)
{

        if(typeof(callback) != "function")
        {

                throw new Error("callback must be defined and be a function");

        }

        let parsedId = Number.parseInt(id);

        if(Number.isNaN(parsedId))
        {

                errorCallback(new Error("Id must be a number"));

                return;

        }
        else
        {

                query("select * from football.edit where editid =" + parsedId + ";",
                (result) => 
                {

                        callback(dataBinding.bindEdits(result));

                },errorCallback,noConnectionCallback)

        }
}

/**
 * Updates a given edit 
 * Fails slightly if id does not exist
 * @param {*} edit  the edit update with
 * @param {*} callback the callback on success 
 * @param {*} errorCallback  the callback on error
 * @param {*} noConnectionCallback  the call back if connection fails
 */
function updateEdit(edit,callback,errorCallback,noConnectionCallback)
{

        if(typeof(callback) != "function")
        {

                throw new Error("callback must be defined and be a function");

        }       


        let isEditValid = dataValidation.validateEdit(edit);

        if(isEditValid)
        {
                
                getEditById(edit.editID,(result) => 
                {
                        
                        if(result.length !== 1)
                        {

                                errorCallback(new Error("Could not find an edit with id " + edit.editID));
                                return;

                        }

                        let sqlquery = "update football.edit set " + 
                        " sid = " + edit.structuredDataID +
                        ",usid = " + edit.unstructuredDataID +
                        ",iscorpus = " + edit.isCorpus + 
                        ",settings = '" + JSON.stringify(edit.settings) + "'" + 
                        ",replace_text = '" + edit.replace + "'" +
                        ",replace_with = '" + edit.replaceWith + "'" + 
                        ",type = '" + edit.type + "'" +
                        "where editid = " + edit.editID + ";";
        
                        query(sqlquery,callback,errorCallback,noConnectionCallback);
        
                },errorCallback,noConnectionCallback)


        }
        else
        {

                errorCallback(new Error("bad input"));
                return;

        }

}

/**
 * insert a given edit 
 * @param {*} edit  the edit to insert with
 * @param {*} callback the callback on success 
 * @param {*} errorCallback  the callback on error
 * @param {*} noConnectionCallback  the call back if connection fails
 */
function insertEdit(edit,callback,errorCallback,noConnectionCallback)
{

        if(typeof(callback) != "function")
        {

                throw new Error("callback must be defined and be a function");

        }       

        let isEditValid = dataValidation.validateEdit(edit);

        if(isEditValid)
        {

                let sqlquery = "insert into football.edit(sid,usid,iscorpus,settings,replace_text,replace_with,type) " + 
                "values(" + edit.structuredDataID + "," + edit.unstructuredDataID + "," + 
                        edit.isCorpus + ",'" + JSON.stringify(edit.settings) + "','" + 
                        edit.replace + "','" + edit.replaceWith + "','" + edit.type + "')";

                query(sqlquery,callback,errorCallback,noConnectionCallback);

        }
        else
        {

                errorCallback(new Error("bad input"));
                return;

        }

}

/**
 * Deletes a given edit by id if it exists
 * @param {*} id the id to delete by 
 * @param {*} callback the callback on success
 * @param {*} errorCallback the callback on error
 * @param {*} noConnectionCallback the callback for no connection
 */
function deleteEditById(id,callback,errorCallback,noConnectionCallback)
{

        if(typeof(callback) != "function")
        {

                throw new Error("callback must be defined and be a function");

        }

        let parsedId = Number.parseInt(id);

        if(Number.isNaN(parsedId))
        {

                errorCallback(new Error("Id must be a number"));

                return;

        }
        else
        {

                query("delete from football.edit where editid =" + parsedId + ";",
                (result) => 
                {

                        callback(dataBinding.bindEdits(result));

                },errorCallback,noConnectionCallback)

        }
}

/**
 * Get's all edits in the database
 * @param {*} callback the callback to pass data
 * @param {*} errorCallback the callback used on error
 * @param {*} noConnectionCallback the callback used on no connection
 */
function getAllEdits(callback,errorCallback,noConnectionCallback)
{

        query("select * from football.edit;",(result) => 
        {

                callback(dataBinding.bindEdits(result));

        },errorCallback,noConnectionCallback);

}

/**
 * Gets all unstructured data which matches a given idea 
 * @param {*} matchid the idea to matchid to get all unstructured data matching of
 * @param {*} callback the call back on success 
 * @param {*} errorCallback the callback on error
 * @param {*} noConnectionCallback the call back on no connection
 */
function getUnstructuredDataByMatchId(matchid,callback,errorCallback,noConnectionCallback)
{

        if(typeof(callback) != "function")
        {

                throw new Error("callback must be defined and be a function");

        }

        let parsedId = Number.parseInt(matchid);

        if(Number.isNaN(parsedId))
        {

                errorCallback(new Error("bad input"));

                return;

        }

        query("select * from football.unstructured_data where matchid = " + matchid + " ;",(result) => 
        {

                callback(dataBinding.bindUnstructuredData(result));

        },errorCallback,noConnectionCallback);

}

/**
 * geet all matches from the databasee
 * @param {*} callback the callback for the result
 * @param {*} errorCallback th callback used on error
 * @param {*} noConnectionCallback the callback if there is no connection
 */
function getAllMatches(callback,errorCallback,noConnectionCallback)
{

        query("select id,date,home,away,competitionID,name from football.structured_data;",(result) => 
        {

                callback(dataBinding.bindMatch(result));

        },errorCallback,noConnectionCallback);

} 

function getMatchById(matchId, callback,errorCallback,noConnectionCallback)
{

        query("select id,date,home,away,competitionID,name from football.structured_data where football.structured_data.id = + " + matchId + ";",(result) => 
        {

                callback(dataBinding.bindMatch(result));

        },errorCallback,noConnectionCallback);

} 


/**
 * Gets all unstructured data which have keys in the list of ids
 * @param {*} ids the ids 
 * @param {*} callback the callback on success
 * @param {*} errorCallback the callback on error
 * @param {*} noConnectionCallback the callback on no connection
 */
function getUnstructuredDataByIds(ids,callback,errorCallback,noConnectionCallback)
{

        if(ids.length == 0)
        {

                callback([]);

                return;

        }

        if(typeof(callback) != "function")
        {

                throw new Error("callback must be defined and be a function");

        }

        if(Array.isArray(ids) && ids.every((i) => Number.isInteger(Number.parseInt(i))) === false)
        {

                errorCallback(new Error("bad input"));

                return;

        };       

        query("select * from football.unstructured_data where usid in " + __listToSQList(ids) + " ;",(result) => 
        {

                callback(dataBinding.bindUnstructuredData(result));

        },errorCallback,noConnectionCallback);

}

/**
 * Get all structured data which are in a list oids 
 * @param {*} ids the list of ids
 * @param {*} callback the callback on success
 * @param {*} errorCallback the callback on error
 * @param {*} noConnectionCallback the callback on no connection
 */
function getStructuredDataByIds(ids,callback,errorCallback,noConnectionCallback)
{

        if(ids.length == 0)
        {

                callback([]);

                return;

        }

        if(typeof(callback) != "function")
        {

                throw new Error("callback must be defined and be a function");

        }

        if(Array.isArray(ids) && ids.every((i) => Number.isInteger(Number.parseInt(i))) === false)
        {

                errorCallback(new Error("bad input"));

                return;

        };       

        let sqlQuery = "select * from football.structured_data where id in " + __listToSQList(ids) + " ;" 

        query(sqlQuery,(result) => 
        {

                callback(dataBinding.bindStructredData(result));

        },errorCallback,noConnectionCallback);

}

/**
 * get structured data from the databasee
 * @param {*} usid the id of the strucredData which need to be selected
 * @param {*} callback the callback for the result
 * @param {*} errorCallback th callback used on error
 * @param {*} noConnectionCallback thee call if there is no connection
 */
function getStructuredData(id,callback,errorCallback,noConnectionCallback)
{
         
        query("select * from football.structured_data where id = " + id + ";",
        (result) => 
        {

                callback(dataBinding.bindStructredData(result));

        },errorCallback,noConnectionCallback);

}

function deleteStructuredData(id,callback,errorCallback,noConnectionCallback)
{

        if(typeof(callback) != "function")
        {

                throw new Error("callback must be defined and be a function");

        }

        let parsedId = Number.parseInt(id);

        if(Number.isNaN(parsedId))
        {

                errorCallback(new Error("Id must be a number"));

                return;

        }
        else
        {

                query("delete from football.match where id =" + parsedId + ";",
                (result) => 
                {

                        callback(result);

                },errorCallback,noConnectionCallback)

        }
}

function insertComps(comps,callback,errorCallback,noConnectionCallback)
{

        if(Array.isArray(comps) !== true)
        {

                throw new Error("comps must of type array")

        }

        if(typeof(callback) != "function")
        {

                throw new Error("callback must be defined and be a function");

        }

        let queries = comps.map((c) => "insert ignore into football.competition(id,name,countryName,countryId)" +
                                "values (" + c.id + ",'" + c.name  + "','" + c.countryName + "'," + c.countryId + ")");

        multiInsertQuery(queries,callback,errorCallback,noConnectionCallback);

}

function getAllComps(callback,errorCallback,noConnectionCallback)
{

        return query("select * from football.competition;",
                (r) => callback(dataBinding.bindCompetition(r)),
                errorCallback,noConnectionCallback);

}

function insertMatches(matches,callback,errorCallback,noConnectionCallback)
{

        if(Array.isArray(matches) !== true)
        {

                throw new Error("matches must of type array")

        }

        if(typeof(callback) != "function")
        {

                throw new Error("callback must be defined and be a function");

        }
        //id
        console.log(matches);
        let queries = matches.map((c) => "insert ignore into football.match(id,competitionID,date,home,away,data)" +
                                "values (" + c.id + "," + c.competitionID  + ",'" + c.date + "','" + c.home + "','" + c.away + "','" + c.data + "')");
        console.log(queries);

        multiInsertQuery(queries,callback,errorCallback,noConnectionCallback);

}

module.exports = { query, 
        multiInsertQuery, 
        getAllStructuredData, 
        getAllUnstrucredData, 
        getUnstrucredData,
        getMatch,
        updateUnstructuredData,
        insertUnstructuredData,
        deleteUnstrucredData,
        getEditById,
        updateEdit,
        insertEdit,
        deleteEditById,       
        getAllEdits,
        getUnstructuredDataByMatchId,
        getUnstructuredDataByIds,
        getStructuredDataByIds,
        deleteStructuredData,
        getStructuredData,
        insertComps,
        getAllComps,
        getAllMatches,
        getMatchById,
        insertMatches };

