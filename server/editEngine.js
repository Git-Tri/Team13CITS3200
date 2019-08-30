const domain = require("./domain");

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

        let rawInput = JSON.stringify(input);

        rawInput.replace(edit.replace,edit.replaceWith);

        return JSON.parse(rawInput);

    }
    else
    {
        
        return input.replace(edit.replace,edit.replaceWith);

    }

}

function strongReplace(input,edit)
{

    if(edit == null || edit == undefined)
    {

        throw Error("Edit is null or undefined");

    }

    if(typeof(input) == "string")
    {

        return input.replace(edit.replace,edit.replaceWith);
        
    }
    else if(typeof(input) == "number")
    {

        let rawNumber = input.toString();

        let processedNumber = rawNumber.replace(edit.replace,edit.replaceWith);

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

        throw Error("Unhandled object type");

    }

}

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

        throw Error("Invalid object type for this type of edit");

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

const editsFunctions = {"replace": replaceRule,
                        "replaceWithField": replaceRuleWithField};

module.exports = 
{

    replaceRule,replaceRuleWithField,editsFunctions

}