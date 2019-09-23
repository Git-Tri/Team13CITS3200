const dataBinding = require("../data-binding");
const { query } = require("./access");
/**
 * geet unstructured data from the databasee
 * @param {*} usid the id of the unstrucredData which need to be selected
 * @param {*} callback the callback for the result
 * @param {*} errorCallback th callback used on error
 * @param {*} noConnectionCallback thee call if there is no connection
 */
function getUnstrucredData(usid, callback, errorCallback, noConnectionCallback) {
        query("select * from football.unstructured_data where usid = ? ;", [usid], (result) => {
                callback(dataBinding.bindUnstructuredData(result));
        }, errorCallback, noConnectionCallback);
}
/**
 * Updates a given edit
 * Fails slightly if id does not exist
 * @param {*} UnstructuredData  the edit update with
 * @param {*} callback the callback on success
 * @param {*} errorCallback  the callback on error
 * @param {*} noConnectionCallback  the call back if connection fails
 */
function updateUnstructuredData(UnstructuredData, callback, errorCallback, noConnectionCallback) {
        getUnstrucredData(UnstructuredData.id, (result) => {
                if (result.length !== 1) {
                        errorCallback(new Error("Could not find an edit with id " + UnstructuredData.id));
                        return;
                }
                UnstructuredData.published = new Date(UnstructuredData.published);
                UnstructuredData.extracted = new Date(UnstructuredData.extracted);
                let params = [
                        UnstructuredData.matchid,
                        UnstructuredData.title,
                        UnstructuredData.author,
                        UnstructuredData.url,
                        UnstructuredData.published.getFullYear() + "/" + (UnstructuredData.published.getMonth() + 1) + "/" + (UnstructuredData.published.getDate()),
                        UnstructuredData.extracted.getFullYear() + "/" + (UnstructuredData.extracted.getMonth() + 1) + "/" + (UnstructuredData.extracted.getDate()) + "'",
                        UnstructuredData.data,
                        UnstructuredData.id
                ];
                let sqlquery = "update football.unstructured_data set " +
                        " matchid = ?" +
                        ",title = ?" +
                        ",author = ?" +
                        ",url = ?" +
                        ",published = ?" +
                        ",extracted = ?" +
                        ",data = ?" +
                        "where usid = ?";
                query(sqlquery, params, callback, errorCallback, noConnectionCallback);
        }, errorCallback, noConnectionCallback);
}
/**
 * insert a given edit
 * @param {*} edit  the edit to insert with
 * @param {*} callback the callback on success
 * @param {*} errorCallback  the callback on error
 * @param {*} noConnectionCallback  the call back if connection fails
 */
function insertUnstructuredData(UnstructuredData, callback, errorCallback, noConnectionCallback) {
        UnstructuredData.published = new Date(UnstructuredData.published);
        UnstructuredData.extracted = new Date(UnstructuredData.extracted);
        let params = [
                UnstructuredData.matchid,
                UnstructuredData.title,
                UnstructuredData.author,
                UnstructuredData.url,
                UnstructuredData.published.getFullYear() + "/" + (UnstructuredData.published.getMonth() + 1) + "/" + (UnstructuredData.published.getDate()),
                UnstructuredData.extracted.getFullYear() + "/" + (UnstructuredData.extracted.getMonth() + 1) + "/" + (UnstructuredData.extracted.getDate()) + "'",
                UnstructuredData.data
        ];
        let sqlquery = "insert into football.unstructured_data(matchid,title,author,url,published,extracted,data) values(?,?,?,?,?,?,?)";
        query(sqlquery, params, callback, errorCallback, noConnectionCallback);
}
/**
 * Delete an unstructuredData by the id
 * @param {*} usid the id of the unstructuredData
 * @param {*} callback the callback function on success
 * @param {*} errorCallback the callback used on error
 * @param {*} noConnectionCallback the callback used if there is no connection
 */
function deleteUnstrucredData(usid, callback, errorCallback, noConnectionCallback) {
        query("delete from football.unstructured_data where usid = ?;", [usid], (result) => {
                callback(dataBinding.bindUnstructuredData(result));
        }, errorCallback, noConnectionCallback);
}
/**
 * Gets all unstructured data which matches a given idea
 * @param {*} matchid the idea to matchid to get all unstructured data matching of
 * @param {*} callback the call back on success
 * @param {*} errorCallback the callback on error
 * @param {*} noConnectionCallback the call back on no connection
 */
function getUnstructuredDataByMatchId(matchid, callback, errorCallback, noConnectionCallback) {
        if (typeof (callback) != "function") {
                throw new Error("callback must be defined and be a function");
        }
        let parsedId = Number.parseInt(matchid);
        if (Number.isNaN(parsedId)) {
                errorCallback(new Error("bad input"));
                return;
        }
        query("select * from football.unstructured_data where matchid = ?;", [matchid], (result) => {
                callback(dataBinding.bindUnstructuredData(result));
        }, errorCallback, noConnectionCallback);
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

        let idsText = "(" 

        ids.forEach(() => idsText = idsText + "?,")

        idsText = idsText.replace(/.$/,")");

        query("select * from football.unstructured_data where usid in" + idsText + ";",ids,(result) => 
        {

                callback(dataBinding.bindUnstructuredData(result));

        },errorCallback,noConnectionCallback);

}

module.exports = 
{

    getUnstrucredData,
    getUnstructuredDataByIds,
    getUnstructuredDataByMatchId,
    insertUnstructuredData,
    updateUnstructuredData,
    deleteUnstrucredData,
    getUnstructuredDataByIds,
    getUnstructuredDataByMatchId

}