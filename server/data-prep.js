const searchEngine = require("./search-engine");

//inspired by: https://stackoverflow.com/questions/42761068/paginate-javascript-array
/**
 * gets the items in an array for a given page
 * @param {*} array the array
 * @param {*} page_number the page number to get  
 */
function paginate (array,page_number) {

    if(Number.isInteger(page_number))
    {

        
        --page_number; // because pages logically start with 1, but technically with 0
        return array.slice(page_number * 100, (page_number + 1) * 100);
        
    }
    else
    {

        return array;

    }
  }

/**
 * performs a search on a given array if searches for that array exist 
 * @param {*} array 
 * @param {*} searches 
 */
function search(array,searches) 
{

    if(searches !== undefined && Array.isArray(searches) && searches.length > 0)
    {

            

        searches.forEach((s) => 
        {

            if(s.type === "after" || s.type === "before")
            {

                if(typeof(s.value) === "string")
                {

                    s.value = new Date(s.value);

                }

            }

        })


        return searchEngine.search(array,searches);

    }
    else
    {

        return array;

    }
    
}

/**
 * gets the total pages for a given array based on a size of 100
 * @param {*} array 
 */
function totalPages(array)
{

    return Math.ceil(array.length/100);

}

/**
 * oh god! 
 * It performs searches on each of the data lists
 * then adds the weights of each piece of target data to the edit
 * then sorts the edit
 * then filters out edits with weight less then 1
 * then pages the edit 
 * then filters out target data whose edits are filtered or paged out
 * finally compiles all this into an response object
 * @param {*} editList the list of edit
 * @param {*} editSearches the list of edit searches
 * @param {*} unstructuredDataList the unstructured data list
 * @param {*} unstructuredDataSearches the list of unstructured data searches
 * @param {*} structuredDataList the structured data list
 * @param {*} structuredDataSearches the structured data list searches
 * @param {*} page the page to get 
 */
function paginateEditSearchResults(editList,editSearches,
    unstructuredDataList,unstructuredDataSearches,
    structuredDataList,structuredDataSearches,page)
{

    //perform all the searches
    let resultObject = searchEngine.editSearch(editList,editSearches,
        unstructuredDataList,unstructuredDataSearches,
        structuredDataList,structuredDataSearches)

    //get the edit list for convinence
    editList = resultObject.editList;

    //add the weights of structured data to edits 
    resultObject.structuredDataList.forEach((s) => 
    {

        let potentialEdit = editList.find((e) => e.structuredDataID === s.id)

        if(potentialEdit !== undefined)
        {

            potentialEdit.weight += s.weight;

        }

    })

    //add the weights of unstructured data to edits 
    resultObject.unstructuredDataList.forEach((s) => 
    {

        let potentialEdit = editList.find((e) => e.unstructuredDataID === s.id)

        if(potentialEdit !== undefined)
        {

            potentialEdit.weight += s.weight;

        }

    })

    
    editList = editList.sort((a,b) => b.weight - a.weight)

    let pages = totalPages(editList)

    editList = paginate(editList,page);
    if(editList.some(d => d.weight > 0))
    {

        editList = editList.filter(d => d.weight > 0);

    }
    //clean up weight properties
    editList.forEach(d => delete d.weight);

    resultObject.unstructuredDataList.forEach(d => delete d.weight);

    resultObject.structuredDataList.forEach(d => delete d.weight);

    //build the response object filtering out unneccessary data 
    let responseObject = {
            editList: editList,
            unstructuredData:  resultObject.unstructuredDataList = resultObject.unstructuredDataList
            .filter((s) => editList.some((e) => s.id === e.unstructuredDataID)),
            structuredData:  resultObject.structuredDataList = resultObject.structuredDataList
            .filter((s) => editList.some((e) => s.id === e.structuredDataID)),
            pages:pages
        }

    return responseObject;




}

module.exports = {paginate,search,totalPages,paginateEditSearchResults};

  