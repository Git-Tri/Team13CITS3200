const getAll = require("./database-access/get-all-data")
const access = require("./database-access/access")

class Cache
{

    constructor(id,getDataFunc)
    {

        if(! isCacheOn())
        {

            throw new Error("Tried to create cache with id " + id + " when cache is off");

        }

        this.id = id;
        this.__data = undefined;
        this.__getDataFunc = getDataFunc;
        this.isValid = false;
        this.queue = [];
        this.timeDelay = 0; 

        this.reValidate();

    }

    getData(callback)
    {
        
        if(this.queue.length === 0 && this.isValid)
        {
            
            callback(this.__data)

        }
        else
        {

            this.__getDataFunc(callback,(err) => {throw err},(err) => {throw err});

        }
        
    }

    invalidate(sql)
    {

        this.isValid = false; 

    }

    reValidate(sql,callback)
    {


        this.isValid = false; 

        this.isReValidating = true; 

        this.queue.push(1)

        this.__getDataFunc((result) => 
        {

            this.__data = result;

            this.isValid = true; 

            this.queue.pop();

            this.timeDelay = 0;

            if(callback !== undefined)
            {

                callback();

            }

        },err => {throw err},err => {throw err})

    }


}

var caches = isCacheOn() ? {match: new Cache("match",getAll.getAllMatches),
                structuredData: new Cache("structured Data",getAll.getAllStructuredData),
                unstructuredData: new Cache("uid",getAll.getAllUnstrucredData),
                edit:new Cache("edit",getAll.getAllEdits),
                comps:new Cache("comps",getAll.getAllComps)} : undefined;


function isCacheOn()
{

    let isCache = process.env.CACHING

    return isCache === null || 
           isCache === undefined || 
           isCache === "true" || 
           isCache === true;

}


function getAllMatches(callback)
{

    return isCacheOn() ? caches.match.getData(callback) : getAll.getAllMatches(callback);

}

function getAllStructuredData(callback)
{

    return isCacheOn() ? caches.structuredData.getData(callback) : getAll.getAllStructuredData(callback) ;

}

function getAllUnstrucredData(callback)
{

return isCacheOn() ? caches.unstructuredData.getData(callback) : getAll.getAllUnstrucredData(callback);

}

function getAllEdits(callback)
{

    return isCacheOn() ? caches.edit.getData(callback) : getAll.getAllEdits(callback);

}

function getAllComps(callback)
{

    return isCacheOn() ? caches.comps.getData(callback) : getAll.getAllComps(callback);

}

function invalidBySQL(sql)
{
    
    if(! isCacheOn())
    {

        return;

    }

    sql = sql.toLowerCase();


    if(sql.includes("insert") == false &&
         sql.includes("update") == false &&
         sql.includes("delete") == false)
    {

        return;

    }

    if(sql.includes("match"))
    {

        caches.match.invalidate(sql);
        caches.structuredData.invalidate(sql);

    }

    if(sql.includes("competition"))
    {

        caches.comps.invalidate(sql);

    }

    if(sql.includes("unstructured_data"))
    {

        caches.unstructuredData.invalidate(sql);

    }

    if(sql.includes("edit"))
    {
        
        caches.edit.invalidate(sql);

    }

}


function revalidBySQL(sql,callback)
{

    if(! isCacheOn())
    {

        return;

    }


    sql = sql.toLowerCase();

    if(sql.includes("insert") == false && sql.includes("update") == false && sql.includes("delete") == false)
    {

        return;

    }

    if(sql.includes("match"))
    {

        caches.match.reValidate(sql,callback);
        caches.structuredData.reValidate(sql,callback);

    }

    if(sql.includes("competition"))
    {

        caches.comps.reValidate(sql,callback);

    }

    if(sql.includes("unstructured_data"))
    {

        caches.unstructuredData.reValidate(sql,callback);

    }

    if(sql.includes("edit"))
    {
        
        caches.edit.reValidate(sql,callback);

    }

}

module.exports = 
{
    
    getAllMatches,
    getAllComps,
    getAllStructuredData,
    getAllUnstrucredData,
    getAllEdits,
    invalidBySQL,
    revalidBySQL

};