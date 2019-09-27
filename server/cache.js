const getAll = require("./database-access/get-all-data")
const access = require("./database-access/access")

class Cache
{

    constructor(id,getDataFunc)
    {

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

        },this.retryGetData,this.retryGetData)

    }

    retryGetData()
    {

        this.timeDelay++;

        if(this.timeDelay > 10)
        {

            throw new Error("cache failed to get data with id " + this.id);

        }
        else
        {

            setTimeout(this.reValidate,this.timeDelay*1000);

        }

    }

}

var caches = {match: new Cache("match",getAll.getAllMatches),
                structuredData: new Cache("structured Data",getAll.getAllStructuredData),
                unstructuredData: new Cache("uid",getAll.getAllUnstrucredData),
                edit:new Cache("edit",getAll.getAllEdits),
                comps:new Cache("comps",getAll.getAllComps)}




function getAllMatches(callback)
{

    return caches.match.getData(callback);

}

function getAllStructuredData(callback)
{

    return caches.structuredData.getData(callback);

}

function getAllUnstrucredData(callback)
{

    return caches.unstructuredData.getData(callback);

}

function getAllEdits(callback)
{

    return caches.edit.getData(callback);

}

function getAllComps(callback)
{

    return caches.comps.getData(callback);

}

function invalidBySQL(sql)
{

    sql = sql.toLowerCase();

    if(sql.includes("insert") == false && sql.includes("update") == false && sql.includes("delete") == false)
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