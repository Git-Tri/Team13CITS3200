const assert = require('assert');
const should = require('chai').should();
const editEngine = require("../editEngine");
const domain = require("../domain");
const testUtils = require("./testUtils");
const dbAccess = require("../databaseAccess");

describe("Edit Engine Tests",function()
{

    //universal test inputs
    let inputGen = () => new domain.UnstructuredData(1,1,undefined,undefined,undefined,undefined,undefined,
            "hello world")

    let structuredDataGen = () => new domain.StructuredData(1,undefined,undefined,undefined,undefined,undefined,
            {field: "some data",otherField: "other data"})


    
    before(function(done)
    {

        let editQuery1 =  'INSERT INTO football.edit(sid,usid,iscorpus,settings,replace_text,replace_with,type)' +
            'values (null,null,true,null,"hello","bixby","replace");'

        let editQuery2 = 'INSERT INTO football.edit(sid,usid,iscorpus,settings,replace_text,replace_with,type)' +
            'values (null,null,true,null,"world","goodbye","replace");'

        let queries = 
        [
            editQuery1,editQuery2
        ]

        dbAccess.multiInsertQuery(queries,[],() => 
        {

            done();

        },(err) => {throw err})

    });

    
    after(function(done)
    {

        let deleteQuery1 = 'delete from football.edit where replace_text = "world";'

        let deleteQuery2 = 'delete from football.edit where replace_text = "hello";'

        let queries = [deleteQuery1,deleteQuery2]

        dbAccess.multiInsertQuery(queries,[],() => 
        {

            done();

        },(err) => {throw err})


    });

    describe("Replace Rule tests",function()
    {

        let replaceRuleEdit = new domain.Edit(1,1,1,false,undefined,"hello","world",undefined);

        let input = "hello hello hello dere hello my dear DARLING";

        let correctInput = input.split("hello").join("world");

        it("should exist",() => should.exist(editEngine.replaceRule))
        it("should return input unchanged for undefined edit", () => editEngine.replaceRule(input,undefined).should.equal(input))
        it("should return input unchanged for null edit", () => editEngine.replaceRule(input,null).should.equal(input))
        it("should throw error for null input",() => assert.throws(() => editEngine.replaceRule(null,replaceRuleEdit),Error,"Input does not exist"));
        it("should throw error for undefined input",() => assert.throws(() => editEngine.replaceRule(undefined,replaceRuleEdit),Error,"Input does not exist"));
        it("should throw error for undefiend input and edit",() => assert.throws(() => editEngine.replaceRule(undefined,undefined),Error,"Input and edit does not exist"));
        it("should correctly replace text when given valid edit and input", () => editEngine.replaceRule(input,replaceRuleEdit).should.equal(correctInput));

    })

    describe("Replace Rule with Field tests",function()
    {

        let replaceRuleEdit = new domain.Edit(1,1,1,false,{field:"field"},"hello","world",undefined);

        let invalidReplaceRuleUndefined = new domain.Edit(1,1,1,false,undefined,"hello","world",undefined);

        let nullReplaceRuleUndefined = new domain.Edit(1,1,1,false,undefined,"hello","world",undefined);

        let wrongTypeReplaceRuleUndefined = new domain.Edit(1,1,1,false,undefined,"hello","world",undefined);

        let missingFieldReplaceRuleUndefined = new domain.Edit(1,1,1,false,{bob: "not a thing"},"hello","world",undefined);

        let FieldIncorrectNumTypeReplaceRuleUndefined = new domain.Edit(1,1,1,false,{field: 33},"hello","world",undefined);

        let FieldIncorrectObjectTypeReplaceRuleUndefined = new domain.Edit(1,1,1,false,{field: {}},"hello","world",undefined);

        let stringInput = {field:"hello hello hello dere hello my dear DARLING"};

        let correctInput = stringInput.field.split("hello").join("world");

        let replaceNumRuleEdit = new domain.Edit(1,1,1,false,{field:"field"},"5","10",undefined);

        let numInput = {field:5};

        let correctNumInput = 10;

        let replaceNumStringRuleEdit = new domain.Edit(1,1,1,false,{field:"field"},"5","world",undefined);

        let correctNumStringInput = "world"

        let recurInput = {field:{someKey:"hello",otherkey:"hello"}};

        it("should exist",() => should.exist(editEngine.replaceRuleWithField));
        //general exceptions
        it("should return input unchanged for undefined edit", () => editEngine.replaceRuleWithField(stringInput,undefined).should.equal(stringInput));
        it("should return input unchanged for null edit", () => editEngine.replaceRuleWithField(stringInput,null).should.equal(stringInput));
        it("should throw error for null input",() => assert.throws(() => editEngine.replaceRuleWithField(null,replaceRuleEdit),Error,"Input does not exist"));
        it("should throw error for undefined input",() => assert.throws(() => editEngine.replaceRuleWithField(undefined,undefined),Error,"Input does not exist"));
        it("should throw error for undefiend input and edit",() => assert.throws(() => editEngine.replaceRuleWithField(undefined,replaceRuleEdit),Error,"Input and edit does not exist"));
        //settings exceptions
        it("should throw error for undefined settings on edit",() => assert.throws(() => editEngine.replaceRuleWithField(invalidReplaceRuleUndefined,replaceRuleEdit),Error,"Settings is not an object"));
        it("should throw error for null settings on edit",() => assert.throws(() => editEngine.replaceRuleWithField(nullReplaceRuleUndefined,replaceRuleEdit),Error,"Settings is not an object"));
        it("should throw error for wrong type settings on edit",() => assert.throws(() => editEngine.replaceRuleWithField(wrongTypeReplaceRuleUndefined,replaceRuleEdit),Error,"Settings is not an object"));
        it("should throw error for wrong type field on settings on edit",() => assert.throws(() => editEngine.replaceRuleWithField(missingFieldReplaceRuleUndefined,replaceRuleEdit),Error,"Settings object does not have a field variable of type string"));
        it("should throw error for wrong type field on settings on edit",() => assert.throws(() => editEngine.replaceRuleWithField(FieldIncorrectNumTypeReplaceRuleUndefined,replaceRuleEdit),Error,"Settings object does not have a field variable of type string"));
        it("should throw error for wrong type field on settings on edit",() => assert.throws(() => editEngine.replaceRuleWithField(FieldIncorrectObjectTypeReplaceRuleUndefined,replaceRuleEdit),Error,"Settings object does not have a field variable of type string"));
        //correct replacements
        it("should correctly replace text when given valid edit and input", () => editEngine.replaceRuleWithField(stringInput,replaceRuleEdit).field.should.equal(correctInput));
        it("should correctly replace num to num when given valid edit and input", () => editEngine.replaceRuleWithField(numInput,replaceNumRuleEdit).field.should.equal(correctNumInput));
        it("should correctly replace num to string when given valid edit and input", () => editEngine.replaceRuleWithField({field:5},replaceNumStringRuleEdit).field.should.equal(correctNumStringInput));
        it("should correctly replace recursively when given valid edit and input", () => 
            {
                let result = editEngine.replaceRuleWithField(recurInput,replaceRuleEdit)

                result.field.someKey.should.equal("world");

                result.field.otherkey.should.equal("world");
            });


    })

    describe("ApplyRulesWithEdits tests",function()
    {

        let replaceRule2 = new domain.Edit(1,1,1,false,undefined,"hello","zig","replace");
        let replaceRule1 = new domain.Edit(1,1,1,false,undefined,"world","zag","replace");
        let replaceRuleInvalid = new domain.Edit(1,1,1,false,undefined,"hello","world","bob");
        let replaceAllRule = new domain.Edit(1,1,1,false,undefined,"zig","zag","replace");

        let replaceRuleTypeNull = new domain.Edit(1,1,1,false,undefined,"world","zag",null);
        let replaceRuleTypeUndefined = new domain.Edit(1,1,1,false,undefined,"world","zag",undefined);

        let edits = [replaceRule1,replaceRule2]
        let replaceAllEdits = [replaceRule1,replaceRule2,replaceAllRule];
        
        let undefinedEdits = [replaceRule1,replaceRule2,undefined];

        let nullEdits = [replaceRule1,replaceRule2,null];
        
       

        let structuredRule1 = new domain.Edit(1,1,1,false,undefined,"other data","superField","replace");

        let structuredRule2 = new domain.Edit(1,1,1,undefined,
                {field:"field"},"some data","super data","replacewithfield");        

        //general exceptions
        
        testUtils.basicTests(editEngine.applyRulesWithEdits,[inputGen(),edits],
            ["No input given or input is not of type structured or unstructured data","edits must be an array"],
            ["input","edits"],true)
        
        testUtils.typeTests(editEngine.applyRulesWithEdits,[inputGen(),edits],
            ["No input given or input is not of type structured or unstructured data","edits must be an array"],
            ["input","edits"],true)
        //specific errors
        it("should throw error with one edit undefined",
            () => assert.throws(() => editEngine.applyRulesWithEdits(inputGen(),undefinedEdits.slice())
            ,Error,"undefined or null edit or type field"));  

        it("should throw error with one edit null",
            () => assert.throws(() => editEngine.applyRulesWithEdits(inputGen(),nullEdits.slice())
            ,Error,"undefined or null edit or type field"));   

        it("should throw error with null type field",
            () => assert.throws(() => editEngine.applyRulesWithEdits(inputGen(),[replaceRuleTypeNull])
            ,Error,"undefined or null edit or type field"));               

        it("should throw error with undefined type field",
            () => assert.throws(() => editEngine.applyRulesWithEdits(inputGen(),[replaceRuleTypeUndefined])
            ,Error,"undefined or null edit or type field"));

        it("should throw error with unsupported edit type",
            () => assert.throws(() => editEngine.applyRulesWithEdits(inputGen(),[replaceRuleInvalid])
            ,Error,"unsupported edit type bob"));
        //success cases 
        it("should correctly change text on unstructured data",
            () => editEngine.applyRulesWithEdits(inputGen(),edits).data.should.equal("zig zag"));

        it("should correctly change text on unstructured data with all corpus edit",
            () => editEngine.applyRulesWithEdits(inputGen(),replaceAllEdits).data.should.equal("zag zag"));

        it("should correctly change text by field on structured data",
            () => editEngine.applyRulesWithEdits(structuredDataGen(),[structuredRule1,structuredRule2]).data.field
                .should.equal("super data"));
        
        it("should correctly change text on all fields on structured data",
            () => editEngine.applyRulesWithEdits(structuredDataGen(),[structuredRule1,structuredRule2]).data.otherField
                .should.equal("superField"));

    })
    
    describe("Apply Rules Tests",function()
    {


        testUtils.basicTests(editEngine.applyRules,[inputGen(),() => {}],
            ["No input given or input is not of type structured or unstructured data",
            "Call back must be a function, otherwise what's the point of all this?"],
            ["input","callback"],true);

        testUtils.typeTests(editEngine.applyRules,[inputGen(),() => {}],
        ["No input given or input is not of type structured or unstructured data",
        "Call back must be a function, otherwise what's the point of all this?"],
        ["input","callback"],true)

        it("should throw an error with non id on input",(done) => 
        {

            let input = inputGen();

            input.id = "bob";

            assert.throws(() => editEngine.applyRules(input,Error,"id of input should be a number"));

            done()

        })

        let input = inputGen();

        it("should correctly replace text",(done) => editEngine.applyRules(input,() => 
        {
            input.data.should.equal("bixby goodbye");
            
            done();

        }));

    });

    describe("Apply Rules MutiInput Tests",function()
    {

        let inputsGen = () => {
            return [
            new domain.UnstructuredData(1,1,undefined,undefined,undefined,undefined,undefined,
            "hello world"),
            new domain.UnstructuredData(1,1,undefined,undefined,undefined,undefined,undefined,
                "world world"),
            new domain.UnstructuredData(1,1,undefined,undefined,undefined,undefined,undefined,
                "hello hello")
            ];}

        
        testUtils.basicTests(editEngine.applyRules,[inputsGen(),() => {}],
            ["No input given or input is not of type array",
            "Call back must be a function, otherwise what's the point of all this?"],
            ["input","callback"],true);

        testUtils.typeTests(editEngine.applyRules,[inputsGen(),() => {}],
        ["No input given or input is not of type array",
        "Call back must be a function, otherwise what's the point of all this?"],
        ["input","callback"],true)

        it("should have correct first input",(done) => editEngine.applyRulesMutiInputs(inputsGen(),(result) => 
        {

            result[0].data.should.equal("bixby goodbye");

            done();

        }));
        
        it("should have correct second input",(done) => editEngine.applyRulesMutiInputs(inputsGen(),(result) => 
        {

            result[1].data.should.equal("goodbye goodbye");

            done();

        }));

        
        it("should have correct third input",(done) => editEngine.applyRulesMutiInputs(inputsGen(),(result) => 
        {

            result[2].data.should.equal("bixby bixby");

            done();

        }));

        
    });

});