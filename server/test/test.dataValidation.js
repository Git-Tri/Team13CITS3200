const envResult = require("dotenv").config();

if (envResult.error) 
{
    throw envResult.error
}

const assert = require('assert');
const should = require('chai').should()
const domain = require("../domain");
const dataValidation = require("../dataValidation");

describe("Data Validation Tests",function()
{
    

    function checkValidator(correctObject,errorObject,validationFunc)
    {

        it("should exist",() => should.exist(validationFunc));

        it("should not throw error for correct input",() => validationFunc(correctObject).should.equal(true))

        
        Object.keys(correctObject).forEach((key) => 
        {

            let correctInput = correctObject[key];

            errorObject[key].forEach((incorrectInput) =>
            {

                it("should return false for " + incorrectInput.message + " on field " + key,() => 
                {
                    correctObject[key] = incorrectInput.input;
                    
                    let result = validationFunc(correctObject)

                    correctObject[key] = correctInput;


                    result.should.equal(false)
                
                   
                });


            });            
        
        });
        
    }
    
    //PAIR GENS
    //generate pairs of invalid data
    //with the item being the invalid data
    //the second item being the message describing that invalid data

    /**
     * generates invalid ids 
     */ 
    function idPairGen()
    {

        let pairs = []

        pairs.push(pairMaker(-1,"negative number"));

        pairs.push(pairMaker("Some text","string"));

        pairs.push(pairMaker({},"object"));

        return pairs;

    }

    /**
     * generates invalid non-existent data i.e. null and undefined
     */
    function existancePairGen()
    {

        let pairs = [];

        pairs.push(pairMaker(null,"null"));

        pairs.push(pairMaker(undefined,"undefined"));

        return pairs; 

    }

    /**
     * generates ID and existance pair gens 
     */
    function idMandatoryPairGen()
    {

        return idPairGen().concat(existancePairGen())

    }

    /**
     * generates invalid data for a boolean value 
     */
    function booleanPairGen()
    {

        let pairs = [];

        pairs.push(pairMaker("some text","string"));

        pairs.push(pairMaker(5,"number"));

        return pairs.concat(idMandatoryPairGen());

    }

    /**
     * generates invalid data for text values 
     */
    function textPairGen()
    {

        let pairs = [];

        pairs.push(pairMaker({},"object"));

        pairs.push(pairMaker(5,"number"));

        return pairs;

    }


    /**
     * generates invalid data for an object value 
     */
    function objectPairGen()
    {

        let pairs = [];

        pairs.push(pairMaker(5,"number"));

        pairs.push(pairMaker("some text","string"));

        return pairs; 

    }

    /**
     * creates a "pair" which is an object with an input and message
     * @param {*} input the input
     * @param {*} message the message
     */
    function pairMaker(input,message)
    {

        return {input:input,message:message};

    }

    describe("Validate Edit Tests",function()
    {

        let correctEdit = new domain.Edit(1,1,1,true,{},"some text","some other text","replace");

        let incorrectEdit = new domain.Edit(idPairGen(),
                                            idPairGen(),
                                            idPairGen(),
                                            booleanPairGen(),
                                            objectPairGen(),
                                            textPairGen(),
                                            textPairGen(),
                                            textPairGen());

        checkValidator(correctEdit,incorrectEdit,dataValidation.validateEdit);

    })
    
})