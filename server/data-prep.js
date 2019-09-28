const searchEngine = require("./search-engine");

//taken from: https://stackoverflow.com/questions/42761068/paginate-javascript-array
function paginate (array,page_number) {
    --page_number; // because pages logically start with 1, but technically with 0
    return array.slice(page_number * 100, (page_number + 1) * 100);
  }
  
function searchAndPaginate(array,page, searches) 
{

    if(searches !== undefined && Array.isArray(searches) && searches.length > 0)
    {

        array = searchEngine.search(array,searches);

    }
    
    if(Number.isInteger(page) === false)
    {

        return array;

    }

    return paginate(array,page)
}

module.exports = {paginate,searchAndPaginate};

  