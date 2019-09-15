const assert = require('assert');
const should = require('chai').should();
const request = require("request");
//start server
const server = require("../index");
const dbAccess = require("../databaseAccess");
const domain = require("../domain");

describe("Route Tests",function()
{

    function cleanUp(callback)
    {

        
        let cleanup = ["delete from football.edit where replace_text = 'testEdit'",
        "delete from football.unstructured_data where author = 'testAuthor'"
        ,"delete from football.match where home = 'testTeam'"
        ,"delete from football.competition where id = 1"];

        dbAccess.multiInsertQuery(cleanup,() => callback(),(err) => {throw err},(err) => {throw err});


    }

    let actualMatchId;

    let actualUnstructuredDataId; 

    let localHost = "http://localhost:" + server.getPort();

    let editId; 

    //CALLBACK HELL
    before(done =>
        {               
            //just in case 
            this.timeout(10000)
            
            cleanUp(() => 
            {

                    
                dbAccess.multiInsertQuery(['insert into football.competition(id,name,plan) values (1,"some comp","some plan");'],() => 
                {
                    
                    let queries = 
                    [   
                        "delete from football.unstructured_data",
                        "delete from football.match",
                        'insert into football.match (date,home,away,competitionID,data)' +
                            'values ("1991/4/20","testTeam","bob",1,"{}");',
                        'insert into football.match (date,home,away,competitionID,data)' +
                            'values ("1991/4/20","testTeam","bob",1,"{}");',
                        ' INSERT INTO football.edit(sid,usid,iscorpus,settings,replace_text,replace_with,type)' +
                            'values (null,null,true,null,"testEdit","goodbye","replace");',
                        ' INSERT INTO football.edit(sid,usid,iscorpus,settings,replace_text,replace_with,type)' +
                            'values (null,null,true,null,"testEdit","goodbye","replace");',
                        ' INSERT INTO football.edit(sid,usid,iscorpus,settings,replace_text,replace_with,type)' +
                            'values (null,null,true,null,"testEdit","goodbye","replace");'                            
                    ];                       

                    dbAccess.multiInsertQuery(queries,() => {
                        
                        dbAccess.query("select id from football.match where home = 'testTeam';",(matchID) => 
                            {

                                actualMatchId = matchID[0][0];
                                
                                let insertQueries = 
                                [
                                    'insert into football.unstructured_data(matchid,title,author,url,published,extracted,data)values(' + actualMatchId + ',"some title","testAuthor","some url","2000/1/21","2000/1/21","some text")',
                                    'insert into football.unstructured_data(matchid,title,author,url,published,extracted,data)values(' + actualMatchId + ',"some title","testAuthor","some url","2000/1/21","2000/1/21","some text")',
                                    'insert into football.unstructured_data(matchid,title,author,url,published,extracted,data)values(' + actualMatchId + ',"some title","testAuthor","some url","2000/1/21","2000/1/21","some text")',
                                    'insert into football.unstructured_data(matchid,title,author,url,published,extracted,data)values(' + actualMatchId + ',"some title","testAuthor","some url","2000/1/21","2000/1/21","some text")',
                                    'insert into football.unstructured_data(matchid,title,author,url,published,extracted,data)values(' + actualMatchId + ',"some title","testAuthor","some url","2000/1/21","2000/1/21","some text")',
                                    ' INSERT INTO football.edit(sid,usid,iscorpus,settings,replace_text,replace_with,type)' +
                                    'values (' +  actualMatchId +',null,true,null,"testEdit","goodbye","replace");',

                                ]

                                dbAccess.multiInsertQuery(insertQueries,() => 
                                {


                                    dbAccess.query("select usid from football.unstructured_data where author = 'testAuthor';",(result) => 
                                    {

                                        actualUnstructuredDataId = result[0][0];

                                        dbAccess.multiInsertQuery( [' INSERT INTO football.edit(sid,usid,iscorpus,settings,replace_text,replace_with,type)' +
                                        'values (null,'+ actualUnstructuredDataId + ',true,null,"testEdit","goodbye","replace");',
                                        ' INSERT INTO football.edit(sid,usid,iscorpus,settings,replace_text,replace_with,type)' +
                                            'values (' + actualMatchId + ',' + actualUnstructuredDataId + ',true,null,"testEdit","goodbye","toDelete");'],() => 
                                            {

                                                dbAccess.query("select editid from football.edit where type = 'toDelete';",(result) =>
                                                {

                                                    editId = result[0][0];

                                                    done();

                                                },(err) => {throw err},(err) => {throw err});
                                            },(err) => {throw err},(err) => {throw err});
                                    },(err) => {throw err},(err) => {throw err});
                                },(err) => {throw err},(err) => {throw err});
                            },(err) => {throw err},(err) => {throw err});
                        },(err) => {throw err},(err) => {throw err});
                    },(err) => {throw err},(err) => {throw err});


                });
        });

    describe("/allchooseableData",function()
    {
        
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

                let expectedObject = new domain.StructuredData(null,new Date("1991-04-20T00:00:00.000Z"),"testTeam","bob",1,"some comp",{})

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

                let expectedObject = new domain.UnstructuredData(undefined,actualMatchId,"some title","testAuthor","some url",new Date("2000-01-21T00:00:00.000Z"),
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

    describe("/structuredDataList",function()
    {

        
        let route = localHost + "/structuredDataList";

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

                let expectedObject = new domain.StructuredData(null,new Date("1991-04-20T00:00:00.000Z"),"testTeam","bob",1,"some comp",{})

                delete expectedObject.id;

                let expectedResult = [expectedObject,expectedObject];

                resultObjects.structuredData.map((s) => delete s.id)

                resultObjects.structuredData.map((s) => s.competitionID = Number.parseInt(s.competitionID));

                JSON.stringify(resultObjects.structuredData).should.equal(JSON.stringify(expectedResult));

                done();

            })

        });


    });

    describe("GET:/edit tests",function()
    {

        //edit id is only assigned when before is run
        //thus i have to add ?id at the end of each route 
        let routeGen = () => localHost + "/edit?id=" + editId;

        it("route should exist and not cuase error",(done) => 
        {

            request(routeGen(),(error,response,body) =>
            {

                should.not.exist(error,null);                

                done();

            })

        });

        it("route should give 404 for wrong edit id",(done) => 
        {

            request(routeGen()+"5",(error,response,body) =>
            {

                response.statusCode.should.equal(404);            

                done();

            })

        });

        it("route should give correct edit object",(done) => 
        {

            request(routeGen(),(error,response,body) =>
            {

                let resultObject = JSON.parse(body);

                let expectedObject = new domain.Edit(editId,actualMatchId,actualUnstructuredDataId,true,null,"testEdit","goodbye","toDelete");

                JSON.stringify(resultObject.edit).should.equal(JSON.stringify(expectedObject));

                done();

            })

        });

        it("route should give correct unstructured data",(done) => 
        {

            request(routeGen(),(error,response,body) =>
            {

                let resultObject = JSON.parse(body);

                let expectedObject = new domain.UnstructuredData(null,actualMatchId,"some title","testAuthor","some url",new Date("2000-01-21T00:00:00.000Z"),
                new Date("2000-01-21T00:00:00.000Z"),"some text");

                delete resultObject.unstructuredData.id;

                delete expectedObject.id;

                JSON.stringify(resultObject.unstructuredData).should.equal(JSON.stringify(expectedObject));

                done();
            })
        })

        it("route should give correct structured data",(done) => 
        {

            request(routeGen(),(error,response,body) =>
            {

                let resultObject = JSON.parse(body);

                let expectedObject = new domain.StructuredData(null,new Date("1991-04-20T00:00:00.000Z"),"testTeam","bob",1,"some comp",{})

                delete resultObject.structuredData.id;

                delete expectedObject.id;

                JSON.stringify(resultObject.structuredData).should.equal(JSON.stringify(expectedObject));

                done();
            })
        })

        

    });

    describe("PUT:/edit tests",function()
    {

        function routeGen(edit)
        {
            let options = {url: localHost + "/edit",headers:{ 'Content-Type': 'application/json' },
                body:JSON.stringify(edit)}

            return options;
        };

        let editGen = () => new domain.Edit(editId,null,null,true,null,"testEdit","UpdateText","replace");

        it("route should exist and not cuase error",(done) => 
        {
            request.put(routeGen(editGen()),(error,response,body) =>
            {

                should.not.exist(error,null);                

                done();

            })

        });

        it("route should get success code on valid update",(done) => 
        {

            request.put(routeGen(editGen()),(error,response,body) =>
            {

                response.statusCode.should.equal(200);            

                done();

            })

        })

        it("route should give 404 code if edit does not exist",(done) => 
        {

            let edit = editGen();

            edit.editID += 10;

            request.put(routeGen(edit),(error,response,body) =>
            {

                response.statusCode.should.equal(404);            

                done();

            })

        });

        it("route should give 400 code if sturctured data does not exist",(done) => 
        {

            let edit = editGen();

            edit.structuredDataID = -1; 

            request.put(routeGen(edit),(error,response,body) =>
            {

                response.statusCode.should.equal(400);            

                done();

            })

        });

        it("should update edit after update query",(done) => 
        {

            request(localHost + "/edit?id=" + editId,(error,response,body) =>
            {

                let resultObject = JSON.parse(body);

                let expectedObject = new domain.Edit(editId,null,null,true,null,"testEdit","UpdateText","replace");

                JSON.stringify(resultObject.edit).should.equal(JSON.stringify(expectedObject));

                done();

            })

        });
    });
    
    describe("POST:/edit tests",function()
    {

        function routeGen(edit)
        {
            let options = {url: localHost + "/edit",headers:{ 'Content-Type': 'application/json' },
                body:JSON.stringify(edit)}

            return options;
        };

        let editGen = () => new domain.Edit(null,null,null,true,null,"testEdit","insertTest","replace");

        it("Should exist and not cuase error",(done) => 
        {
            request.post(routeGen(editGen()),(error,response,body) =>
            {

                should.not.exist(error,null);                

                done();

            })

        });

        it("Should return 400 status on invalid edit",(done) => 
        {

            let edit = editGen();

            delete edit.type;

            request.post(routeGen(edit),(error,response,body) =>
            {

                response.statusCode.should.equal(400);                

                done();

            })

        });

        it("Should return 400 status for non-existent structured id",(done) => 
        {

            let edit = editGen();

            edit.unstructuredDataID = 1;

            request.post(routeGen(edit),(error,response,body) =>
            {

                response.statusCode.should.equal(400);                

                done();

            })

        });

        it("Should return 200 status for valid edit",(done) => 
        {

            request.post(routeGen(editGen()),(error,response,body) =>
            {

                response.statusCode.should.equal(200);                

                done();

            })

        });

        it("Should insert edit after insert query",(done) => 
        {

            let newEditID; 

            dbAccess.query("select editId from football.edit where replace_with = 'insertTest';",(r) => 
            {

                newEditID = r[0][0]; 

                request(localHost + "/edit?id=" + newEditID,(error,response,body) =>
                {
    
                    let resultObject = JSON.parse(body);
    
                    let expectedObject = new domain.Edit(newEditID,null,null,true,null,"testEdit","insertTest","replace");
    
                    JSON.stringify(resultObject.edit).should.equal(JSON.stringify(expectedObject));
    
                    done();
    
                })

            },assert.fail,assert.fail)
          

        });

    });

    describe("DELETE:/edit tests",function()
    {

        let routeGen = () => localHost + "/edit?id=" + editId;

        it("Should exist and not cuase error",(done) => 
        {
            request.delete(routeGen()+5,(error,response,body) =>
            {

                should.not.exist(error,null);                

                done();

            })

        });

        it("Should return 404 status with invalid id",(done) => 
        {
            request.delete(routeGen()+5,(error,response,body) =>
            {

                response.statusCode.should.equal(404);      

                done();

            });

        });

        it("Should return 200 status with valid id",(done) =>
        {

            request.delete(routeGen(),(error,response,body) =>
            {

                response.statusCode.should.equal(200);      

                done();

            });

        });

        it("Should return 404 for repeated delete",(done) =>
        {

            request.delete(routeGen(),(error,response,body) =>
            {

                response.statusCode.should.equal(404);      

                done();

            });

        });

        it("Should return 404 for get request for delete route",(done) => 
        {

            request(routeGen(),(error,response,body) =>
            {

                response.statusCode.should.equal(404);            

                done();

            })


        })


    });

    
    describe("/editList",function()
    {

        
        let route = localHost + "/editList";

        it("route should exist and not cuase error",(done) => 
        {

            request(route,(error,response,body) =>
            {

                should.not.exist(error,null);                

                done();

            })

        });

        it("route should return correct edits",(done) => 
        {
            //due to limitations of the database schema can't test if ids are equal
            //since ids will change with every test run
            //due to limitations in json.parse the numbers needs to be converted from string to int. 
            request(route,(error,response,body) =>
            {

                let edits = JSON.parse(body);

                edits.editList.every((result) => 
                {


                    let isSid = result.structuredDataID === null || actualMatchId;
                    let isUid = result.unstructuredDataID === null || actualUnstructuredDataId;
                    let isCorpus = result.isCorpus === true;
                    let isSettings = result.settings === null;
                    let isReplace = result.replace == "testEdit";
                    let isReplaceWith = result.replaceWith == "goodbye" || result.replaceWith == "insertTest";
                    let isType = result.type == "replace";
    
                    let isCorrect = isSid && 
                                    isUid && 
                                    isCorpus && 
                                    isSettings && 
                                    isReplace && 
                                    isReplaceWith && 
                                    isType;



                    return isCorrect;

                }).should.equal(true);

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

                let expectedObject = new domain.StructuredData(null,new Date("1991-04-20T00:00:00.000Z"),"testTeam","bob",1,"some comp",{})

                delete expectedObject.id;

                let expectedResult = [expectedObject];

                resultObjects.structuredData.map((s) => delete s.id)

                resultObjects.structuredData.map((s) => s.competitionID = Number.parseInt(s.competitionID));

                JSON.stringify(resultObjects.structuredData).should.equal(JSON.stringify(expectedResult));

                done();

            })

        });

        it("route should return correct unstructured data",(done) => 
        {

            //due to limitations of the database schema can't test if ids are equal
            //since ids will change with every test run
            //due to limitations in json.parse the numbers needs to be converted from string to int. 
            request(route,(error,response,body) =>
            {

                let resultObjects = JSON.parse(body);

                let expectedObject = new domain.UnstructuredData(null,actualMatchId,"some title","testAuthor","some url",new Date("2000-01-21T00:00:00.000Z"),
                    new Date("2000-01-21T00:00:00.000Z"),"some text")

                delete expectedObject.id;

                let expectedResult = [expectedObject];

                resultObjects.unstructuredData.map((s) => delete s.id);

                JSON.stringify(resultObjects.unstructuredData).should.equal(JSON.stringify(expectedResult));

                done();

            })

        });

    });

    describe("GET:/getUnstructuredDataByMatchId tests",function()
    {

        //edit id is only assigned when before is run
        //thus i have to add ?id at the end of each route 
        let routeGen = () => localHost + "/getUnstructuredDataByMatchId?id=" + actualMatchId;

        it("route should exist and not cuase error",(done) => 
        {

            request(routeGen(),(error,response,body) =>
            {

                should.not.exist(error,null);                

                done();

            })

        });

        it("route should return empty for non-existient id",(done) => 
        {

            request(routeGen()+"5",(error,response,body) =>
            {

                let resultObject = JSON.parse(body);

                resultObject.unstructuredData.length.should.equal(0); 

                done();

            })

        });

        it("route should return correct unstructured data",(done) => 
        {

            //due to limitations of the database schema can't test if ids are equal
            //since ids will change with every test run
            //due to limitations in json.parse the numbers needs to be converted from string to int. 
            request(routeGen(),(error,response,body) =>
            {

                let resultObjects = JSON.parse(body);

                let expectedObject = new domain.UnstructuredData(null,actualMatchId,"some title","testAuthor","some url",new Date("2000-01-21T00:00:00.000Z"),
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

        cleanUp(done);

    });

});
    

