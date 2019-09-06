const assert = require('assert');
const should = require('chai').should()

/** 
 * For a given function
 * iterates through all args replacing at each step a arg with null or undefined to ensure it cuases an error
 * errorsMessages is a list of expected error message by arg
 * inputNames is name of each input as will be displayed in the test name 
 * also checks if the function exists
 */
function basicTests(func,args,errorsMessages,inputNames,isTested)
{

    it("should exist",() => should.exist(func));
    
    args.forEach((currentItem,index) => 
    {

        if(isTested || isTested[index])
        {

            let tempArg = args[index]

            args[index] = undefined; 

            let newArgs = args.slice();

            it("should throw error for undefined " + inputNames[index],
                () => assert.throws(() => func.apply(null,newArgs),Error,errorsMessages[index]));
            
            args[index] = null;

            newArgs = args.slice();

            it("should throw error for null " + inputNames[index],
                () => assert.throws(() => func.apply(null,newArgs),Error,errorsMessages[index]))

            args[index] = tempArg;
        }
    })

}
/** 
 * For a given function
 * iterates through all args replacing with inputs of different types
 * errorsMessages is a list of expected error message by arg
 * inputNames is name of each input as will be displayed in the test name 
 * 
 */
function typeTests(func,args,errorsMessages,inputNames,isTested)
{

    let badDataTypes = ["some text",5,{someField: "someField"},() => {}];

    args.forEach((currentItem,index) => 
    {

        if(isTested || isTested[index])
        {
                
            let tempArg = args[index]

            badDataTypes.forEach((currentItem) => 
            {

                if(typeof(currentItem) != typeof(tempArg))
                {
                    
                    args[index] = currentItem;

                    let newArgs = args.slice();

                    it("should throw error for " + typeof(currentItem) + " type of " + inputNames[index],
                        () => assert.throws(() => func.apply(null,newArgs),Error,errorsMessages[index]) )

                }


            })

            args[index] = tempArg;

        }

    })

}

module.exports = { basicTests,typeTests }
