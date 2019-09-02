const assert = require('assert');
const should = require('chai').should()
const editEngine = require("../editEngine") 
const domain = require("../domain")
const testUtils = require("./testUtils")
const dataBinding = require("../dataBinding")

describe("DataBinding Tests",function()
{

    function compareAllFieldsTest(raw,processed)
    {

        Object.keys(processed).forEach((key) => 
        {
        
            //using an index didn't work so went with this silliness. Thanks Mocha/javascript 
            it("should have correct " + key,
                () => processed[key].should.equal(raw[Object.keys(processed).indexOf(key)]));
           
        }
        );

    }

    function allBindingTests(func,rawRow,errorMessages,inputNames)
    {

        let raw = [rawRow];

        //Error testing
        testUtils.basicTests(func,raw,errorMessages,inputNames,true);

        testUtils.typeTests(func,raw,errorMessages,inputNames,true);

        it("should throw error with too many fields",() => assert.throws(() => func(raw.push(raw[0].splice().push(1).push(1)),Error,"improper row length")));

        raw.pop();

        it("should throw error with too few fields",() => assert.throws(() => func(raw.push(raw[0].splice().pop())),Error,"improper row length"));

        raw.pop();

        //help function 
        let pushN = (input,num) => 
        {

            let newInput = input.splice()

            let j = 0;

            for(; j < num; j++)
            {

                newInput.push(rawRow);

            }    

            return newInput;

        }
        //test correct number of inputs are returned
        it("should have correct number of edits for 1 inputs",() => func(pushN(raw,1)).length.should.equal(1));
        it("should have correct number of edits for 2 inputs",() => func(pushN(raw,2)).length.should.equal(2));
        it("should have correct number of edits for 3 inputs",() => func(pushN(raw,3)).length.should.equal(3));
        it("should have correct number of edits for 4 inputs",() => func(pushN(raw,4)).length.should.equal(4));
        it("should have correct number of edits for 5 inputs",() => func(pushN(raw,5)).length.should.equal(5));
        it("should have correct number of edits for 6 inputs",() => func(pushN(raw,6)).length.should.equal(6));
        it("should have correct number of edits for 7 inputs",() => func(pushN(raw,7)).length.should.equal(7));
        it("should have correct number of edits for 8 inputs",() => func(pushN(raw,8)).length.should.equal(8));
        it("should have correct number of edits for 9 inputs",() => func(pushN(raw,9)).length.should.equal(9));

        //check all fields are correct
        let processed = func([rawRow])[0]

        compareAllFieldsTest(rawRow.slice(),processed)
        
        


    };

    
    describe("Bind Edits Tests",function()
    {

        let rawEdit = [3,1,3,false,{field: "value"},"hello","world","replace"]

        let rawEdits = [rawEdit,rawEdit,rawEdit,rawEdit,rawEdit,rawEdit];

        testUtils.basicTests(dataBinding.bindEdits,[[rawEdit]],["rawEdit must be an array"],["rawEdit"],true);

        testUtils.typeTests(dataBinding.bindEdits,[[rawEdit]],["rawEdit must be an array"],["rawEdit"],true);

        it("should throw error with incorrect number fo fields",
            () => assert.throws(() => dataBinding.bindEdits([1,2,3,4,5,6,7,8])
            ,Error,"improper item length")); 

        it("should have correct number of edits for 1 edit",() => dataBinding.bindEdits([rawEdit]).length.should.equal(1));
        
        it("should have correct number of edits for 6 edits",() => dataBinding.bindEdits(rawEdits).length.should.equal(6));

        let processedEdit = dataBinding.bindEdits([rawEdit])[0]

        compareAllFieldsTest(rawEdit.slice(),processedEdit)

    });

    describe("Bind Structured Data Tests",function()
    {

        let structured = [3,3,"mr world","some text","a url","published","extract",{some:"data"}];

        allBindingTests(dataBinding.bindStructredData,structured,["rawStructuredData must be an array"],["rawUnstructuredData"]);

    });

    describe("Bind Unstructured Data Tests",function()
    {

        let unStructured = [3,3,"mr world","some text","a url","published","extract",{some:"data"}];

        allBindingTests(dataBinding.bindUnstructuredData,unStructured,["rawUnstructuredData must be an array"],["rawUnstructuredData"]);

    });

})