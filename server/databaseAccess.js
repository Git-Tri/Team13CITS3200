const mysqlx = require("@mysql/xdevapi");  

const connectionString = "mysqlx://" + process.env.USER +  ":" + process.env.PASSWORD + "@" + process.env.HOST + ":33060/" + process.env.DATABASE

const client = mysqlx.getClient(connectionString, { pooling: { maxSize: 50, maxIdleTime: 1000, queueTimeout: 2000 } });

const dataBinding = require("./dataBinding");

const dataValidation = require("./dataValidation");

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

module.exports = { query, 
        multiInsertQuery, 
        getAllStructuredData, 
        getAllUnstrucredData, 
        getEditById,
        updateEdit,
        insertEdit,
        deleteEditById };

