import {StructuredData, UnstructuredData, Edit} from "./domain";
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
        rawEdit.type);    

}