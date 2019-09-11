import * as dataBinding from "./Databinding";
import * as domain from "./domain";
describe("Data binding tests",() => 
{

    function bindingTests(bindFunc,correctObject)
    {

        let rawObject = JSON.parse(JSON.stringify(correctObject));
        
        test("should throw exception with undefined input",() => expect(() => bindFunc(undefined)).toThrow())

        test("should throw exception with null input",() => expect(() => bindFunc(null)).toThrow())

        test("should not throw error with correct input",() => expect(() => bindFunc(rawObject)).not.toThrow());

        test("should have same class as correct object",() => expect(bindFunc(rawObject).constructor === correctObject.constructor).toEqual(true));

        test("should have correct fields for valid input",() => expect(JSON.stringify(bindFunc(rawObject)))
                                                                    .toEqual(JSON.stringify(correctObject)));

    }    

    describe("bindUnstructuredData tests",() => 
    {

        let correctObject = new domain.UnstructuredData(1,1,"some match","some author","some url",new Date(),new Date(),"some text");

        bindingTests(dataBinding.bindUnstructureData,correctObject);
    });

    describe("bindStructuredData tests",() => 
    {

        let correctObject = new domain.StructuredData(1,new Date(),"some team","some team",1,"some comp",{field:"some value"});

        bindingTests(dataBinding.bindStructuredData,correctObject);

    });

    describe("Edit binding tests",() => 
    {

        let correctObject = new domain.Edit(1,1,1,true,{field: "some text"},"some text","some other text","some type");

        bindingTests(dataBinding.bindEdit,correctObject);

    });

})