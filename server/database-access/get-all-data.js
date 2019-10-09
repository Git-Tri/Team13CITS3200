const dataBinding = require("../data-binding");
const access = require("./database-query");
/**
 * Get all structured data from the database
 * @param {*} callback the callback for the result
 * @param {*} errorCallback  the callback used on error
 * @param {*} noConnectionCallback  callback if there is no connection
 */
function getAllStructuredData(callback, errorCallback, noConnectionCallback) {
        access.query("select * from structured_data;", [], (result) => {
                callback(dataBinding.bindStructredData(result));
        }, errorCallback, noConnectionCallback);
}
/**
 * geet all unstructured data from the databasee
 * @param {*} callback the callback for the result
 * @param {*} errorCallback th callback used on error
 * @param {*} noConnectionCallback the call if there is no connection
 */
function getAllUnstrucredData(callback, errorCallback, noConnectionCallback) {
        access.query("select * from football.unstructured_data;", [], (result) => {
                callback(dataBinding.bindUnstructuredData(result));
        }, errorCallback, noConnectionCallback);
}


/**
 * Get's all edits in the database
 * @param {*} callback the callback to pass data
 * @param {*} errorCallback the callback used on error
 * @param {*} noConnectionCallback the callback used on no connection
 */
function getAllEdits(callback,errorCallback,noConnectionCallback)
{

        access.query("select * from football.edit;",[],(result) => 
        {

                callback(dataBinding.bindEdits(result));

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

        access.query("select id,date,home,away,competitionID,name from football.structured_data;",[],(result) => 
        {

                callback(dataBinding.bindMatch(result));

        },errorCallback,noConnectionCallback);

} 

function getAllComps(callback,errorCallback,noConnectionCallback)
{

        return access.query("select * from football.competition;",[],
                (r) => callback(dataBinding.bindCompetition(r)),
                errorCallback,noConnectionCallback);

}

function getAllUsers(callback,errorCallback,noConnectionCallback)
{

        return access.query("select * from football.user",[],
                (r) => callback(dataBinding.bindUsers(r)),errorCallback,noConnectionCallback)

}


module.exports =
{
        getAllStructuredData,
        getAllUnstrucredData,
        getAllEdits,
        getAllMatches,
        getAllComps,
        getAllUsers

};
