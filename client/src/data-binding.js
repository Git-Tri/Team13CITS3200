import {StructuredData, UnstructuredData, Edit, Match, Competition, User} from "./domain";
/**
 * converts a parsed json object of structured data
 * to an instance of structured data 
 * No validation is done
 * @param {object} rawStructuredData the object representation
 */
export function bindStructuredData(rawStructuredData)
{

    return new StructuredData(Number.parseInt(rawStructuredData.id)
        ,new Date(rawStructuredData.date)
        ,rawStructuredData.home
        ,rawStructuredData.away
        ,Number.parseInt(rawStructuredData.competitionID)
        ,rawStructuredData.competitionName
        ,rawStructuredData.data)

}

/**
 * converts a parsed json object of unstructured data
 * to an instance of unstructured data
 * no validation is done.
 * @param {object} rawUnstructuredData 
 */
export function bindUnstructureData(rawUnstructuredData)
{

    return new UnstructuredData(Number.parseInt(rawUnstructuredData.id),
        Number.parseInt(rawUnstructuredData.matchid),
        rawUnstructuredData.title,
        rawUnstructuredData.author,
        rawUnstructuredData.url,
        new Date(rawUnstructuredData.published),
        new Date(rawUnstructuredData.extracted),
        rawUnstructuredData.data);


}

/**
 * converts a parsed json object to an edit 
 * no validation is done 
 * @param {*} rawEdit the parsed json object 
 */
export function bindEdit(rawEdit)
{

    return new Edit(Number.parseInt(rawEdit.editID),
        Number.isInteger(rawEdit.structuredDataID) ? Number.parseInt(rawEdit.structuredDataID) : null,
        Number.isInteger(rawEdit.unstructuredDataID) ? Number.parseInt(rawEdit.unstructuredDataID) : null,
        rawEdit.isCorpus,
        rawEdit.settings,
        rawEdit.replace,
        rawEdit.replaceWith,
        rawEdit.type,
        rawEdit.order);    

}

/**
 * converts a parsed json object to a match
 * no validation is done
 * @param {*} rawMatch the parsed json object
 */

export function bindMatch(rawMatch)
{

    return new Match(Number.parseInt(rawMatch.id),
        new Date(rawMatch.date),
        rawMatch.home,
        rawMatch.away,
        Number.parseInt(rawMatch.competitionID),
        rawMatch.competitionName);
}

export function bindCompetition(rawComp)
{

    return new Competition(Number.parseInt(rawComp.id),
        rawComp.name,
        rawComp.countryName,
        Number.parseInt(rawComp.countryId));

}

export function bindUser(rawUser)
{

    return new User(Number.parseInt(rawUser.id),
        rawUser.username,
        rawUser.hash,
        Number.parseInt(rawUser.admin),
        rawUser.regkey,
        rawUser.token,
        rawUser.apikey);

}
