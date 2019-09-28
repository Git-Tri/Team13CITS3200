function simpleTextSearch(item,value)
{


    if(typeof(item) !== "string")
    {

        return 0; 

    }
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


function searchText(data,search)
{

    
    if(search.field !== undefined && 
       search.field !== null && 
       typeof(search.field) === "string")
    {

        data.weight += simpleTextSearch(data[search.field],search.value,1)

    }
    else
    {

        search.field.forEach(field => data.weight += simpleTextSearch(data[field],search.value));

    }
    


}

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

    let isMatch = compareData === search.value;

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

function search(dataList,searches)
{

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

    searchResult = searchResult.filter(d => d.weight > 0);

    searchResult = searchResult.sort((a,b) => a.weight < b.weight)

    searchResult.forEach(d => delete d.weight);

    return searchResult;

}

module.exports = {search}