const envResult = require("dotenv").config();

if (envResult.error) 
{
    throw envResult.error
}

const assert = require('assert');
const should = require('chai').should()
const domain = require("../domain");
const searchEngine = require("../search-engine");

describe("Search Engine Tests",function()
{

    describe("Search tests",function()
    {

        let testData = [
            new domain.StructuredData(1,new Date(1991,3,23,0,0,0),"home team","away team",1,
                "Some comp",{country:"england",testData:"some team"}),
            new domain.StructuredData(1,new Date(1991,4,23,0,0,0),"england starters","england united",1,
                "Some comp",{country:"england",testData:"some team"}),
            new domain.StructuredData(1,new Date(1991,4,23,0,0,0),"england","england united",1,
                "Some comp",{country:"england",testData:"some team"}),
            new domain.StructuredData(1,new Date(1991,9,23,0,0,0),"france","united england",1,
                "Some comp",{country:"england",testData:"some team"})
        ];

        let beforeSearch = new domain.Search("before",new Date(1991,4,1,0,0,0),"date");
        let afterSearch = new domain.Search("after",new Date(1991,5,1,0,0,0),"date");
        let exactSearch = new domain.Search("exact","england","home");
        let textSearch = new domain.Search("text","england","home");
        let textMultiSearch = new domain.Search("text","england",["home","away"]);
        let multiSearch = [new domain.Search("after",new Date(1991,4,1,0,0,0),"date"),
        new domain.Search("before",new Date(1991,9,1,0,0,0),"date"),textMultiSearch]

        
        it("should exist",() => should.exist(searchEngine.search))

        it("Should return correct number of results for before search",() => 
        {
            (searchEngine.search(testData,[beforeSearch])).length.should.equal(1)
        
        });

        it("Should return correct results for before search",() => 
        {
            let result = JSON.stringify(searchEngine.search(testData,[beforeSearch]))

            let expect = JSON.stringify([testData[0]])

            result.should.equal(expect)

        
        });

        
        it("Should return correct number of results for after search",() => 
        {
            (searchEngine.search(testData,[afterSearch])).length.should.equal(1)
        
        });

        it("Should return correct results for after search",() => 
        {
            let result = JSON.stringify(searchEngine.search(testData,[afterSearch]))

            let expect = JSON.stringify([testData[3]])

            result.should.equal(expect)
        
        });


        it("Should return correct number of results for exact search",() => 
        {
            (searchEngine.search(testData,[exactSearch])).length.should.equal(1)
        
        });

        it("Should return correct results for exact search",() => 
        {
            let result = JSON.stringify(searchEngine.search(testData,[exactSearch]))

            let expect = JSON.stringify([testData[2]])

            result.should.equal(expect)
        
        });

        

        it("Should return correct number of results for text search one field",() => 
        {
            (searchEngine.search(testData,[textSearch])).length.should.equal(2)
        
        });

        it("Should return correct results for text search one field",() => 
        {
            let result = JSON.stringify(searchEngine.search(testData,[textSearch]))

            let expect = JSON.stringify([testData[2],testData[1]])

            result.should.equal(expect)
        
        });

        
        it("Should return correct number of results for text search multi field",() => 
        {
            (searchEngine.search(testData,[textMultiSearch])).length.should.equal(3)
        
        });

        it("Should return correct results for text search multi field",() => 
        {
            let result = JSON.stringify(searchEngine.search(testData,[textMultiSearch]))

            let expect = JSON.stringify([testData[2],testData[1],testData[3]])

            result.should.equal(expect)
        
        });
        
          
        it("Should return correct number of results for multi search",() => 
        {
            (searchEngine.search(testData,multiSearch)).length.should.equal(2)
        
        });

        it("Should return correct results for text search multi field",() => 
        {
            let result = JSON.stringify(searchEngine.search(testData,multiSearch))

            let expect = JSON.stringify([testData[2],testData[1]])

            result.should.equal(expect)
        
        });






        //text test
        //muti-search test 

    })

})