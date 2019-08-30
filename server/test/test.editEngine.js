const assert = require('assert');
const should = require('chai').should()
const editEngine = require("../editEngine") 
const domain = require("../domain")


describe("Edit Engine Tests",function()
{

    describe("Replace Rule tests",function()
    {

        let replaceRuleEdit = new domain.Edit(1,1,1,false,undefined,"hello","world",undefined);

        let input = "hello hello hello dere hello my dear DARLING";

        let correctInput = input.replace("hello","world");

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

        let correctInput = stringInput.field.replace("hello","world");

        let replaceNumRuleEdit = new domain.Edit(1,1,1,false,{field:"field"},"5","10",undefined);

        let numInput = {field:5};

        let correctNumInput = 10;

        let replaceNumStringRuleEdit = new domain.Edit(1,1,1,false,{field:"field"},"5","world",undefined);

        let correctNumStringInput = "world"

        let recurInput = {field:{someKey:"hello",otherkey:"hello"}};

        let recurCorrectInput = {field:{someKey:"world",otherkey:"world"}};



        
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


})