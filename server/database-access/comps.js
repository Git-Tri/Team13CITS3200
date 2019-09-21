const { multiInsertQuery } = require("./access");

function insertComps(comps, callback, errorCallback, noConnectionCallback) {
        if (Array.isArray(comps) !== true) {
                throw new Error("comps must of type array");
        }
        if (typeof (callback) != "function") {
                throw new Error("callback must be defined and be a function");
        }
        let params = [];
        let queries = comps.map((c) => {
                let compParams = [c.id, c.name, c.countryName, c.countryId];
                params.push(compParams);
                return "insert ignore into football.competition(id,name,countryName,countryId) values(?,?,?,?);";
        });
        multiInsertQuery(queries, params, callback, errorCallback, noConnectionCallback);
}

module.exports = {insertComps}