const envResult = require("dotenv").config();

if (envResult.error) 
{
    throw envResult.error
}

const assert = require('assert');
const should = require('chai').should()
const dbAccess = require("../databaseAccess") 
const domain = require("../domain")

describe("Domain Tests",function()
{

    describe("Unstructured Data Tests",function()
    {

        let testUnstructuredData = new domain.UnstructuredData(1,1,"some match","some author",
            "some url","some date","some date","some data");

        it("should exist",() => should.exist(testUnstructuredData));
        it("should have correct id",() => testUnstructuredData.id.should.equal(1));
        it("should have correct matchid",() => testUnstructuredData.matchid.should.equal(1));
        it("should have correct title",() => testUnstructuredData.title.should.equal("some match"));
        it("should have correct author",() => testUnstructuredData.author.should.equal("some author"));
        it("should have correct url",() => testUnstructuredData.url.should.equal("some url"));
        it("should have correct published",() => testUnstructuredData.published.should.equal("some date"));
        it("should have correct extracted",() => testUnstructuredData.extracted.should.equal("some date"));
        it("should have correct data",() => testUnstructuredData.data.should.equal("some data"));

    });

    describe("Structured Data Tests",function()
    {

        let testStructuredData = new domain.StructuredData(1,1,"some home team","some away team",
            1,"some comp name","some data");

        it("should exist",() => should.exist(testStructuredData));
        it("should have correct id",() => testStructuredData.id.should.equal(1));
        it("should have correct home team",() => testStructuredData.home.should.equal("some home team"));
        it("should have correct away team",() => testStructuredData.away.should.equal("some away team"));
        it("should have correct competition id",() => testStructuredData.id.should.equal(1))
        it("should have correct competition name",() => testStructuredData.competitionName.should.equal("some comp name"));
        it("should have data",() => testStructuredData.data.should.equal("some data"));

    });

    describe("Match Data Tests",function()
    {

        
        let testMatch = new domain.Match(1,1,"some home team","some away team",
            1,"some comp name");

        it("should exist",() => should.exist(testMatch));
        it("should have correct id",() => testMatch.id.should.equal(1));
        it("should have correct home team",() => testMatch.home.should.equal("some home team"));
        it("should have correct away team",() => testMatch.away.should.equal("some away team"));
        it("should have correct competition id",() => testMatch.id.should.equal(1))
        it("should have correct competition name",() => testMatch.competitionName.should.equal("some comp name"));
       

    })


    describe("Edit Data Tests",function()
    {

        
        let testEdit = new domain.Edit(1,1,1,true,"some settings","some text","some other text","some type");

        it("should exist",() => should.exist(testEdit));
        it("should have correct id",() => testEdit.editID.should.equal(1));
        it("should have correct structured data id",() => testEdit.structuredDataID.should.equal(1));
        it("should have correct unstructed data id",() => testEdit.unstructuredDataID.should.equal(1));
        it("should have correct isCorpus",() => testEdit.isCorpus.should.equal(true));
        it("should have correct settings",() => testEdit.settings.should.equal("some settings"));
        it("should have correct replace",() => testEdit.replace.should.equal("some text"));
        it("should have correct replace with",() => testEdit.replaceWith.should.equal("some other text"));
        it("should have correct type",() => testEdit.type.should.equal("some type"));
    })

})