const dataBinding = require("../data-binding");
const dataValidation = require("../data-validation");
const { query } = require("./access");
/**
 * Gets an edit by the id
 * @param {*} id the id of the edit to get must be a number
 * @param {*} callback the callback function on success
 * @param {*} errorCallback the callback used on error
 * @param {*} noConnectionCallback the callback used if there is no connection
 */
function getEditById(id, callback, errorCallback, noConnectionCallback) {
        if (typeof (callback) != "function") {
                throw new Error("callback must be defined and be a function");
        }
        let parsedId = Number.parseInt(id);
        if (Number.isNaN(parsedId)) {
                errorCallback(new Error("Id must be a number"));
                return;
        }
        else {
                query("select * from football.edit where editid = ? ;", [parsedId], (result) => {
                        callback(dataBinding.bindEdits(result));
                }, errorCallback, noConnectionCallback);
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
function updateEdit(edit, callback, errorCallback, noConnectionCallback) {
        if (typeof (callback) != "function") {
                throw new Error("callback must be defined and be a function");
        }
        let isEditValid = dataValidation.validateEdit(edit);
        if (isEditValid) {
                getEditById(edit.editID, (result) => {
                        if (result.length !== 1) {
                                errorCallback(new Error("Could not find an edit with id " + edit.editID));
                                return;
                        }
                        let params = [
                                edit.structuredDataID,
                                edit.unstructuredDataID,
                                edit.isCorpus,
                                JSON.stringify(edit.settings),
                                edit.replace,
                                edit.replaceWith,
                                edit.type,
                                edit.order,
                                edit.editID
                                
                        ];
                        let sqlquery = "update football.edit set " +
                                " sid = ?" +
                                ",usid = ?" +
                                ",iscorpus = ?" +
                                ",settings = ?" +
                                ",replace_text = ?" +
                                ",replace_with = ?" +
                                ",type = ?" +
                                ",`order` = ? " +
                                "where editid = ?";
                        query(sqlquery, params, callback, errorCallback, noConnectionCallback);
                }, errorCallback, noConnectionCallback);
        }
        else {
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
function insertEdit(edit, callback, errorCallback, noConnectionCallback) {
        if (typeof (callback) != "function") {
                throw new Error("callback must be defined and be a function");
        }
        let isEditValid = dataValidation.validateEdit(edit);
        if (isEditValid) {
                let params = [
                        edit.structuredDataID,
                        edit.unstructuredDataID,
                        edit.isCorpus,
                        JSON.stringify(edit.settings),
                        edit.replace,
                        edit.replaceWith,
                        edit.type
                ];
                let sqlquery = "insert into football.edit(sid,usid,iscorpus,settings,replace_text,replace_with,type) " +
                        "values(?,?,?,?,?,?,?)";
                query(sqlquery, params,() => 
                {

                        query("update football.edit set `order` = editid where `order` IS NULL;"
                                ,[],callback,errorCallback,noConnectionCallback)

                }, errorCallback, noConnectionCallback);
        }
        else {
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
function deleteEditById(id, callback, errorCallback, noConnectionCallback) {
        if (typeof (callback) != "function") {
                throw new Error("callback must be defined and be a function");
        }
        let parsedId = Number.parseInt(id);
        if (Number.isNaN(parsedId)) {
                errorCallback(new Error("Id must be a number"));
                return;
        }
        else {
                query("delete from football.edit where editid = ?;", [parsedId], (result) => {
                        callback(dataBinding.bindEdits(result));
                }, errorCallback, noConnectionCallback);
        }
}

module.exports = 
{

        getEditById,
        insertEdit,
        deleteEditById,
        updateEdit

}