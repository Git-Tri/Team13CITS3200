const dataBinding = require("../dataBinding");
const { query, multiInsertQuery } = require("./access");
/**
 * geet unstructured data from the databasee
 * @param {*} usid the id of the match which need to be selected
 * @param {*} callback the callback for the result
 * @param {*} errorCallback th callback used on error
 * @param {*} noConnectionCallback thee call if there is no connection
 */

function getMatchById(matchId, callback, errorCallback, noConnectionCallback) {
        query("select id,date,home,away,competitionID,name from football.structured_data where football.structured_data.id = ?;", [matchId], (result) => {
                callback(dataBinding.bindMatch(result));
        }, errorCallback, noConnectionCallback);
}
function insertMatches(matches, callback, errorCallback, noConnectionCallback) {
        if (Array.isArray(matches) !== true) {
                throw new Error("matches must of type array");
        }
        if (typeof (callback) != "function") {
                throw new Error("callback must be defined and be a function");
        }
        let params = [];
        let queries = matches.map((s) => {
                params.push([s.id, s.competitionID, s.date, s.home, s.away, s.data]);
                return "insert ignore into football.match(id,competitionID,date,home,away,data) values(?,?,?,?,?,?);";
        });
        multiInsertQuery(queries, params, callback, errorCallback, noConnectionCallback);
}

module.exports = 
{

        getMatchById,
        insertMatches

}