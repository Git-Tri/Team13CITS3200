/**
 * returns true if thing is not undefined or null
 * @param {*} thing the thing to check
 */
function doesExist(thing)
{

    if(thing == undefined)
    {

        thing = null;

    }

    return thing !== null;

}

/**
 * if it's a number check if it is above 0
 * if not check if it's null or undefined
 * if not then it's not okay!
 * @param {*} id the id to check 
 */
function idChecker(id)
{

    let Numid = Number.parseInt(id);

    if(Number.isInteger(Numid) && Numid >= 0)
    {

        return true;

    }
    else if(! doesExist(id))
    {

        return true;

    }
    else
    {

        return false; 

    }
}

/**
 * if it's a number check if it is above 0
 * @param {*} id the id to check 
 */
function idMandatoryChecker(id)
{

    id = Number.parseInt(id);

    if(Number.isInteger(id) && id >= 0)
    {

        return true;

    }
    else
    {

        return false; 

    }
}



/**
 * checks if an edit is valid for inserting into a sql query
 * @param {*} edit the edit to validate 
 */
function validateEdit(edit)
{

    if(edit == undefined || edit == null)
    {
        
        return false;

    }

    if("editID" in edit 
        && "structuredDataID" in edit 
        && "unstructuredDataID" 
        && "isCorpus" in edit 
        && "settings" in edit 
        && "replace" in edit 
        && "replaceWith" in edit 
        && "type" in edit)
    {

        let isEditIdValid = idChecker(edit.editID);
        let isStructureDataId = idChecker(edit.structuredDataID);
        let isUnstructuredDataID = idChecker(edit.unstructuredDataID);
        let isCorpus = doesExist(edit.isCorpus) && 
            (edit.isCorpus.toString() == "false" || edit.isCorpus.toString()  == "true");
        let isSettings = typeof(edit.settings) == "object"; 
        let isReplace =  ! doesExist(edit.replace) || typeof(edit.replace) == "string";
        let isReplaceWith = ! doesExist(edit.replaceWith) || typeof(edit.replaceWith) == "string" ;
        let isType = ! doesExist(edit.type) ||  typeof(edit.type) == "string" ;       

        return isEditIdValid 
                && isStructureDataId 
                && isUnstructuredDataID 
                && isCorpus 
                && isSettings 
                && isReplace
                && isReplaceWith
                && isType

    }
    else
    {

        return false; 

    }
  

}

module.exports = {validateEdit,idChecker,idMandatoryChecker,doesExist}