import {StructuredData, UnstructuredData} from "./domain";

/**
 * converts a pure javascript representation of structured data
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
 * converts a pure javascript representation of unstructured data
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
