const dataBinding = require("../dataBinding");
const { query } = require("./access");
/**
 * Get all structured data which are in a list oids
 * @param {*} ids the list of ids
 * @param {*} callback the callback on success
 * @param {*} errorCallback the callback on error
 * @param {*} noConnectionCallback the callback on no connection
 */
function getStructuredDataByIds(ids, callback, errorCallback, noConnectionCallback) {
        if (ids.length == 0) {
                callback([]);
                return;
        }
        if (typeof (callback) != "function") {
                throw new Error("callback must be defined and be a function");
        }
        if (Array.isArray(ids) && ids.every((i) => Number.isInteger(Number.parseInt(i))) === false) {
                errorCallback(new Error("bad input"));
                return;
        }
        ;
        let idsText = "(";
        ids.forEach(() => idsText = idsText + "?,");
        idsText = idsText.replace(/.$/, ")");
        let sqlQuery = "select * from football.structured_data where id in " + idsText + ";";
        query(sqlQuery, ids, (result) => {
                callback(dataBinding.bindStructredData(result));
        }, errorCallback, noConnectionCallback);
}
/**
 * get structured data from the databasee
 * @param {*} usid the id of the strucredData which need to be selected
 * @param {*} callback the callback for the result
 * @param {*} errorCallback th callback used on error
 * @param {*} noConnectionCallback thee call if there is no connection
 */
function getStructuredData(id, callback, errorCallback, noConnectionCallback) {
        query("select * from football.structured_data where id = ?;", [id], (result) => {
                callback(dataBinding.bindStructredData(result));
        }, errorCallback, noConnectionCallback);
}
function deleteStructuredData(id, callback, errorCallback, noConnectionCallback) {
        if (typeof (callback) != "function") {
                throw new Error("callback must be defined and be a function");
        }
        let parsedId = Number.parseInt(id);
        if (Number.isNaN(parsedId)) {
                errorCallback(new Error("Id must be a number"));
                return;
        }
        else {
                query("delete from football.match where id = ?;", [parsedId], (result) => {
                        callback(result);
                }, errorCallback, noConnectionCallback);
        }
}

module.exports = {getStructuredDataByIds, getStructuredData, deleteStructuredData}