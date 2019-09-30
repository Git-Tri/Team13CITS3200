/**
 * performs a simple text search on the lower case text of both item and value
 * if they are equal a weight of 100 is given
 * if item starts with value then a weight of 20 is given
 * if item includes value then a weight of 10 is given
 * @param {*} item the item to search
 * @param {*} value the value to search by 
 */
function simpleTextSearch(item,value)
{



    if(typeof(item) !== "string")
    {

        return 0; 

    }

    item = item.toLowerCase();

    value = value.toLowerCase();
    if(item === value)
    {

        return 100;

    }
    if(item.startsWith(value))
    {

        return 20;

    }
    if(item.includes(value))
    {

        return 10;

    }
    else
    {

        return 0;

    }

}

/**
 * performs text search on one or more fields. weighting given based on quality of matches 
 * @param {*} data the data to search
 * @param {*} search the searc to use 
 */
function searchText(data,search)
{

    
    if(search.field !== undefined && 
       search.field !== null && 
       typeof(search.field) === "string")
    {

        data.weight += simpleTextSearch(data[search.field],search.value,1)

    }
    else if(Array.isArray(search.field))
    {

        search.field.forEach(field => data.weight += simpleTextSearch(data[field],search.value));

    }
    else
    {

        throw new Error("text search must have field defined")

    }


}

/**
 * gives a negative weight to any data not before a given date
 * search.field must be defined, data must have a field of that name of type date
 * and search.value must be a date 
 * @param {*} data the data to search
 * @param {*} search the search to use
 */
function searchBefore(data,search)
{

    
    if(typeof(search.field) === "string"  && data[search.field] instanceof Date)
    {

        let isMatch=data[search.field] < search.value; 

        if(isMatch === false)
        {

            data.weight = -1;

        }
        else
        {

            data.weight += 1;

        }

    }
    else
    {
        //wrong type of object
        data.weight = -1;

    }


}


/**
 * gives a negative weight to any data not after a given date
 * search.field must be defined, data must have a field of that name of type date
 * and search.value must be a date 
 * @param {*} data the data to search
 * @param {*} search the search to use
 */
function searchAfter(data,search)
{

    if(typeof(search.field) === "string" && data[search.field] instanceof Date)
    {

        let isMatch=data[search.field] > search.value; 

        if(isMatch === false)
        {

            data.weight = -1;

        }
        else
        {

            data.weight += 1;

        }

    }
    else
    {
        //wrong type of object
        data.weight = -1;

    }

    

}

/**
 * searches text for an exact match on a given field
 * if the field is not a string it will converted to a string
 * @param {*} data the data to search
 * @param {*} search the search used 
 */
function searchExact(data,search)
{   

    if(typeof(search.field) !== "string")
    {

        return 0;

    }

    let compareData = data[search.field];

    if(typeof(compareData) != "string")
    {

        compareData = JSON.stringify(compareData)

    }

    let searchValue = search.value;

    if(typeof(searchValue) !== "string")
    {

        searchValue = JSON.stringify(searchValue);

    }

    let isMatch = compareData === searchValue;

    if(! isMatch)
    {

        data.weight = -1;

    }
    else
    {

        data.weight += 1;

    }


}


const searchFunctions = {"text":searchText,
                        "before":searchBefore,
                        "after":searchAfter,
                        "exact":searchExact}

/**
 * searches using a single datalist and search list
 * @param {*} dataList the data list
 * @param {*} searches the search list 
 */
function searchSingle(dataList,searches)
{

    if(! Array.isArray(dataList) || ! Array.isArray(searches) || searches.length === 0)
    {

        return dataList;

    }

    let searchResult = dataList.slice();

    searchResult.forEach(d => d.weight = 0);

    searches.forEach(search => 
    {

        let searchFunc = searchFunctions[search.type]

        if(searchFunc !== undefined)
        {

            searchResult.forEach(data => searchFunc(data,search));

            searchResult = searchResult.filter((d) => d.weight >= 0);

        }

    })

    if(searchResult.some((d => d.weight > 0)))
    {

        searchResult = searchResult.filter(d => d.weight > 0);

    }

    

    searchResult = searchResult.sort((a,b) => b.weight - a.weight)


    return searchResult;

}

/**
 * searches using a single datalist and search result.
 * weights are trimmed out after search
 * @param {*} dataList the data list
 * @param {*} searches the list of searches 
 */
function search(dataList,searches)
{

    let searchResult = searchSingle(dataList,searches)

    searchResult.forEach(d => delete d.weight);

    return searchResult;

}

/**
 * search used specifically for edits
 * it provides weighting to the edit list and target data lists
 * @param {*} editList the list of edit
 * @param {*} editSearches the list of edit searches
 * @param {*} unstructuredDataList the list of unstructured data
 * @param {*} unstructuredDataSearches the list of unstructured data searches
 * @param {*} structuredDataList the list of structured data
 * @param {*} structuredDataSearches the list of structured data searches 
 */
function editSearch(editList,editSearches,
    unstructuredDataList,unstructuredDataSearches,
    structuredDataList,structuredDataSearches)
    {

        let editSearchResult = searchSingle(editList,editSearches);

        let structuredDataResult = searchSingle(structuredDataList,structuredDataSearches);

        let unstructuredDataResult = searchSingle(unstructuredDataList,unstructuredDataSearches);

        return {editList: editSearchResult, 
                structuredDataList: structuredDataResult, 
                unstructuredDataList: unstructuredDataResult}


    }


module.exports = {search,editSearch}