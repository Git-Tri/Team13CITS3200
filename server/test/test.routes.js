const assert = require('assert');
const should = require('chai').should();
const request = require("request");
//start server
const server = require("../index");
const dbAccess = require("../databaseAccess");
const domain = require("../domain");

describe("Route Tests",function()
{

    let localHost = "http://localhost:" + server.getPort();

    before(done =>
        {
    
            dbAccess.multiInsertQuery(['insert into football.competition(id,name) values (1,"some comp");'],() => done(),console.log,console.log);
    
        });

    describe("/allchooseableData",function()
    {

        let actualUid;

        before(function(done)
        {
            //just in case 
            this.timeout(10000)

            let queries = 
            [   
                "delete from football.unstructured_data",
                "delete from football.match",
                'insert into football.match (date,home,away,competitionID,data)' +
                    'values ("1991/4/20","selectTest","bob",1,"{}");',
                'insert into football.match (date,home,away,competitionID,data)' +
                    'values ("1991/4/20","selectTest","bob",1,"{}");'
                
            ];                       

            dbAccess.multiInsertQuery(queries,() => {
                
                dbAccess.query("select id from football.match where home = 'selectTest';",(uid) => 
                    {

                        actualUid = uid[0][0];

                        console.log(actualUid);
                        
                        let insertQueries = 
                        [
                            'insert into football.unstructured_data(matchid,title,author,url,published,extracted,data)values(' + actualUid + ',"some title","some author","some url","2000/1/21","2000/1/21","some text")',
                            'insert into football.unstructured_data(matchid,title,author,url,published,extracted,data)values(' + actualUid + ',"some title","some author","some url","2000/1/21","2000/1/21","some text")',
                            'insert into football.unstructured_data(matchid,title,author,url,published,extracted,data)values(' + actualUid + ',"some title","some author","some url","2000/1/21","2000/1/21","some text")',
                            'insert into football.unstructured_data(matchid,title,author,url,published,extracted,data)values(' + actualUid + ',"some title","some author","some url","2000/1/21","2000/1/21","some text")',
                            'insert into football.unstructured_data(matchid,title,author,url,published,extracted,data)values(' + actualUid + ',"some title","some author","some url","2000/1/21","2000/1/21","some text")'
                            

                        ]

                        dbAccess.multiInsertQuery(insertQueries,() => done(),(err) => {throw err},(err) => {throw err});


                    },(err) => {throw err},(err) => {throw err})

                
            
                },(err) => {throw err},(err) => {throw err});

        
    
       });

        let route = localHost + "/allchooseableData";

        it("route should exist and not cuase error",(done) => 
        {

            request(route,(error,response,body) =>
            {

                should.not.exist(error,null);



                

                done();

            })

        });

        it("route should return correct structured data",(done) => 
        {
            //due to limitations of the database schema can't test if ids are equal
            //since ids will change with every test run
            //due to limitations in json.parse the numbers needs to be converted from string to int. 
            request(route,(error,response,body) =>
            {

                let resultObjects = JSON.parse(body);

                let expectedObject = new domain.StructuredData(undefined,new Date("1991-04-20T00:00:00.000Z"),"selectTest","bob",1,"some comp",{})

                delete expectedObject.id;

                let expectedResult = [expectedObject,expectedObject];

                resultObjects.structuredData.map((s) => delete s.id)

                resultObjects.structuredData.map((s) => s.competitionID = Number.parseInt(s.competitionID));

                JSON.stringify(resultObjects.structuredData).should.equal(JSON.stringify(expectedResult));

                done();

            })

        });

        it("route should return unstructured data",(done) => 
        {

            //due to limitations of the database schema can't test if ids are equal
            //since ids will change with every test run
            //due to limitations in json.parse the numbers needs to be converted from string to int. 
            request(route,(error,response,body) =>
            {

                let resultObjects = JSON.parse(body);

                let expectedObject = new domain.UnstructuredData(undefined,actualUid,"some title","some author","some url",new Date("2000-01-21T00:00:00.000Z"),
                    new Date("2000-01-21T00:00:00.000Z"),"some text")

                delete expectedObject.id;

                let expectedResult = [expectedObject,expectedObject,expectedObject,expectedObject,expectedObject];

                resultObjects.unstructuredData.map((s) => delete s.id);
                
                resultObjects.unstructuredData.map((s) => s.matchid = Number.parseInt(s.matchid));

                JSON.stringify(resultObjects.unstructuredData).should.equal(JSON.stringify(expectedResult));

                done();

            })

        });

    });

        
    after(function(done)
    {

        let cleanup = ["delete from football.unstructured_data","delete from football.match","delete from football.competition where id = 1"];

        dbAccess.multiInsertQuery(cleanup,() => done(),(err) => {throw err},(err) => {throw err});

    })
    

});