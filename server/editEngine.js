const domain = require("./domain");
const dbAccess = require("./databaseAccess");
const dataBinding = require("./dataBinding");

/**
 * The replace rule for replacing all text in a given string or object
 * for string it replaces all text in that string
 * for object it replaces all text for each field of that object. for number
 * fields it converts the  field to string, performs the replace then attempts to conver it back
 * @param {*} input the input to replace
 * @param {*} edit the edit specifying the replace and replace with text
 */
function replaceRule(input,edit)
{

    if((input == undefined || input == null) && (edit == undefined || edit == null))
    {

        throw Error("Input and edit does not exist");

    }

    if(input == undefined || input == null)
    {

        throw Error("Input does not exist");

    }

    if(edit == undefined || edit == null)
    {

        return input;

    }

    if(typeof(input) == "object")
    {

        strongReplace(input,edit);

        return input

    }
    else
    {
        
        return replaceAll(input,edit.replace,edit.replaceWith);

    }

}

/**
 * Helper function that replaces all occurances of a string
 * in a given piece of text
 * see: https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string
 * @param {string} input the input string to replace
 * @param {string} replace the text to replace
 * @param {string} replaceWith the text to replace with
 */
function replaceAll(input,replace,replaceWith)
{

    return input.split(replace).join(replaceWith);

}

/**
 * A strong replace function. It takes strings, objects and numbers.
 * For strings replaces all occurances of the text as specified in edit
 * for numbers converts to strings, performs replace and if possible converts back to number
 * for object, recurisvely performs replaces on all fields 
 * @param {*} input the input to replace with
 * @param {*} edit the edit that specifies the replace and replace with
 */
function strongReplace(input,edit)
{

    if(edit == null || edit == undefined)
    {

        throw Error("Edit is null or undefined");

    }

    if(typeof(input) == "string")
    {

        return replaceAll(input,edit.replace,edit.replaceWith);
        
    }
    else if(typeof(input) == "number")
    {

        let rawNumber = input.toString();

        let processedNumber = replaceAll(rawNumber,edit.replace,edit.replaceWith);

        return Number.isNaN(Number(processedNumber)) ? processedNumber : Number(processedNumber);

    }
    else if(typeof(input) == "object")
    {

        Object.keys(input).forEach((key) => 
        {
            
            input[key] = strongReplace(input[key],edit);
        }
        );

        return input;
    }
    else if(input == undefined || input == null)
    {

        return input;

    }
    else
    {

        return input;

    }

}

/**
 * Performs a replacement only on a given field of the inputted object
 * @param {*} input the inputted object
 * @param {*} edit the edit object which specifies replace, replace with and field of the object
 */
function replaceRuleWithField(input,edit)
{

    if((input == undefined || input == null) && (edit == undefined || edit == null))
    {

        throw Error("Input and edit does not exist");

    }

    if(input == undefined || input == null)
    {

        throw Error("Input does not exist");

    }


    if(edit == undefined || edit == null)
    {

        return input;

    }


    if(typeof(input) != "object")
    {
        //wrong type of input, pass it back
        return input;

    }

    if(edit.settings == undefined || edit.settings == null || typeof(edit.settings) != "object")
    {

        throw Error("Settings is not an object");

    }

    if(edit.settings.field == undefined ||
         edit.settings.field == null || 
         typeof(edit.settings.field) != "string")
    {

        throw Error("Settings object does not have a field variable of type string")

    }

    let field = edit.settings.field;

    if(input[field] == undefined || input[field] == null)
    {

        throw Error("Input must have field called:" + field);

    }


    input[field] = strongReplace(input[field],edit);

    return input;
    
}

//A map of edit functions and edit types 
const editsFunctions = {"replace": replaceRule,
                        "replacewithfield": replaceRuleWithField};

/**
 * applies all edits on a given object
 * @param {*} input the unstructured or structured data
 * @param {*} edits a list of edits 
 */
function applyRulesWithEdits(input,edits)
{

    if(input == null || input == undefined)
    {

        throw Error("No input given or input is not of type structured or unstructured data")

    }
    //seperated into second if statement due to issues with javascript instanceof
    if((input instanceof domain.UnstructuredData) == false && (input instanceof domain.StructuredData) == false)
    {

        throw Error("No input given or input is not of type structured or unstructured data")

    }
    if(edits === null || edits === undefined || ! Array.isArray(edits))
    {

        throw Error("edits must be an array");

    }

    let newInput = input;

    edits.forEach((currentItem) => 
    {

        if(currentItem == null || currentItem == undefined || 
            currentItem.type == null || currentItem.type == undefined)
        {

            throw Error("undefined or null edit or type field");

        }

        let editFunction = editsFunctions[currentItem.type];

        if(editFunction == undefined || editFunction == null)
        {

            throw Error("unsupported edit type " + currentItem.type);

        }
        if((input instanceof domain.UnstructuredData && currentItem.unstructuredDataID == input.id)
         || input instanceof domain.StructuredData && currentItem.structuredDataID == input.id 
         || currentItem.isCorpus)
        {

            newInput.data = editFunction(newInput.data,currentItem);

        }

    });

    return input;

}

/**
 * for a given input, will get edits from database that are relevant for that input
 * @param {} input the input to edit
 * @param {*} callback a callback used once the operation has finished 
 */
function applyRules(input,callback)
{

    if(input == null || input == undefined)
    {
        
        throw Error("No input given or input is not of type structured or unstructured data");

    }
    //seperated into second if statement due to issues with javascript instanceof
    if((input instanceof domain.UnstructuredData) == false && (input instanceof domain.StructuredData) == false)
    {

        throw Error("No input given or input is not of type structured or unstructured data")

    }
    if(callback == null || callback == undefined || typeof(callback) != "function")
    {

        throw Error("Call back must be a function, otherwise what's the point of all this?");
        
    }
    if(typeof(input.id) != "number")
    {

        throw Error("id of input should be a number");

    }

    let queryField = input instanceof domain.StructuredData ? "sid" : "usid";    

    let query = "select * from football.edit where " + queryField + " = ? or iscorpus = true";

    dbAccess.query(query,[input.id],(result) =>
    {
        
        let edits = dataBinding.bindEdits(result);

        callback(applyRulesWithEdits(input,edits));

    },(err) => {throw err},(err) => {throw err});

}

/**
 * For a given array of inputs will apply edits to those input
 * Edits are automatically gotten from the database. 
 * This function is best used with large sets of inputs since all
 * edits are queryed from the database
 * @param {*} inputs a list of inputs
 * @param {*} callback the callback function once the operation is finished
 */
function applyRulesMutiInputs(inputs,callback)
{

    
    if(! Array.isArray(inputs))
    {
        
        throw Error("No input given or input is not of type array");

    }
    if(callback == null || callback == undefined || typeof(callback) != "function")
    {

        throw Error("Call back must be a function, otherwise what's the point of all this?");
        
    }

    dbAccess.getAllEdits((result) => 
    {

        callback(inputs.map((input) => applyRulesWithEdits(input,result)));

    },(err) => {throw err},(err) => {throw err});

}



module.exports = 
{

    replaceRule,replaceRuleWithField,editsFunctions,applyRulesWithEdits,applyRules,applyRulesMutiInputs

}