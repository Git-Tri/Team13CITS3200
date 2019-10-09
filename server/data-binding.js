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

        let processedItem = item.map((input) => typeof(input) == "string" ? input.trim() : input);

        results.push(new domain.Edit(processedItem[0],processedItem[1],processedItem[2],
                isCorpus,processedItem[4],processedItem[5],processedItem[6],processedItem[7]))
    })

    return results;

}

/**
 * binds a table representation of a structured data to an object representation
 * @param {*} rawStructuredData the table representation
 */
function bindStructredData(rawStructuredData)
{

    if(! Array.isArray(rawStructuredData))
    {

        throw Error("rawStructuredData must be an array");

    }

    let results = [];

    rawStructuredData.forEach((item) => 
    {

        if(item.length != 7)
        {

           throw Error("improper item length");

        }

        let processedItem = item.map((input) => typeof(input) == "string" ? input.trim() : input);

        results.push(new domain.StructuredData(processedItem[0],processedItem[1],processedItem[2],
            processedItem[3],processedItem[4],processedItem[5],processedItem[6]))
    })

    return results;

}

/**
 * takes a unstructured data row and converts to unstructurd data object
 * @param {*} rawUnstructuredData the unstructurd data row
 */
function bindUnstructuredData(rawUnstructuredData)
{

    if(! Array.isArray(rawUnstructuredData))
    {

        throw Error("rawUnstructuredData must be an array");

    }

    let results = [];

    rawUnstructuredData.forEach((item) => 
    {

        if(item.length != 8)
        {

           throw Error("improper item length");

        }

        let processedItem = item.map((input) => typeof(input) == "string" ? input.trim() : input);


        results.push(new domain.UnstructuredData(processedItem[0],processedItem[1],processedItem[2],
            processedItem[3],processedItem[4],processedItem[5],processedItem[6],processedItem[7]))
    })

    return results;

}

/**
 * takes a match data row and converts to unstructurd data object
 * @param {*} rawMatch the unstructurd data row
 */
function bindMatch(rawMatch)
{



    if(! Array.isArray(rawMatch))
    {

        throw Error("rawMatch must be an array");

    }

    let results = [];

    rawMatch.forEach((item) => 
    {

        if(item.length != 6)
        {

           throw Error("improper item length");

        }

        let processedItem = item.map((input) => typeof(input) == "string" ? input.trim() : input);


        results.push(new domain.Match(processedItem[0],processedItem[1],processedItem[2],
            processedItem[3],processedItem[4],processedItem[5]))
    })

    return results;

}

function bindCompetition(rawComps)
{

    if(! Array.isArray(rawComps))
    {

        throw Error("rawMatch must be an array");

    }

    let results = [];

    rawComps.forEach((item) => 
    {

        if(item.length != 4)
        {

           throw Error("improper item length");

        }

        let processedItem = item.map((input) => typeof(input) == "string" ? input.trim() : input);


        results.push(new domain.Competition(processedItem[0],processedItem[1],processedItem[2],
            processedItem[3]));
    })

    return results;

}

function bindUsers(rawUsers)
{

    if(! Array.isArray(rawUsers))
    {

        throw Error("rawUsers must be an array");

    }

    let results = [];

    rawUsers.forEach((item) => 
    {

        if(item.length != 5)
        {

           throw Error("improper item length");

        }

        let processedItem = item.map((input) => typeof(input) == "string" ? input.trim() : input);


        results.push(new domain.User(processedItem[0],processedItem[1],processedItem[2],
            processedItem[3],processedItem[4]));
    })

    return results;

}


module.exports = {bindEdits,bindUnstructuredData,bindStructredData,bindMatch,bindCompetition,bindUsers }
