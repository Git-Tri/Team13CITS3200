const domain = require("./domain");

/**
 * Takes a row representation of an edit and converts it into an edit object
 * @param {*} rawEdit the table representation of the edit 
 */
function bindEdits(rawEdit)
{

    if(! Array.isArray(rawEdit))
    {

        throw Error("rawEdit must be an array");

    }

    let results = [];

    rawEdit.forEach((item) => 
    {

        if(item.length != 8)
        {

           throw Error("improper item length");

        }

        let isCorpus = item[3] == 0 ? false: true 


        results.push(new domain.Edit(item[0],item[1],item[2],
                isCorpus,item[4],item[5],item[6],item[7]))
    })

    return results;

}


module.exports = {bindEdits }