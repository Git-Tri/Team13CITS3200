const envResult = require("dotenv").config();

if (envResult.error) 
{
    throw envResult.error
}

const assert = require('assert');
const should = require('chai').should()
const dbAccess = require("../databaseAccess") 
const domain = require("../domain");

describe('Database Access Tests ', function() {

    before(done =>
    {

        dbAccess.multiInsertQuery(['insert into football.competition(id,name,plan) values (1,"some comp","some plan");'],() => done(),console.error,console.error);

    });
    
    describe("Check for .env variables",function()
    {

        it("HOST should be loaded from host",function()
        {

            should.exist(process.env.HOST)

        })

        it("USER should be loaded from host",function()
        {

            should.exist(process.env.USER)
        })

        
        it("PASSWORD should be loaded from host",function()
        {

            should.exist(process.env.PASSWORD)
        })

        it("DATABASE should be loaded from host",function()
        {

            should.exist(process.env.DATABASE)

        })


    })

    describe("DatabaseAccess.Query Tests",function()
    {               
            
        it('query function should exist', function(){
            should.exist(dbAccess.query);
        });
    
        it('query function should insert row without error', function(done){
            
            let insertQuery = 'insert into football.match' +
                            '(date,home,away,competitionID,data)' +
                             'values ("1991/3/23","bob","testTeam",1,"{}");'
            

            dbAccess.query(insertQuery,() => done(),assert.fail)

        });
        
        it('query function should update row without error', function(done){
            
            let updateQuery = "update football.match set home = 'not bob' where home = 'bob';"
            
            dbAccess.query(updateQuery,() => done(),assert.fail)

        });
                
        it('query function should update row with updated data',function(done)
        {

            dbAccess.query("select home from football.match where home = 'not bob' limit 1",function(result)
            {
                result[0][0].should.equal('not bob');
                done();
            },assert.fail)

        })

        it('query function should select correct number of rows',function(done)
        {

            dbAccess.query("select * from football.match limit 1;",function(result)
            {
                result.length.should.equal(1);
                done();
            },assert.fail)

        })

        it('query function should select correct row contents',function(done)
        {

            dbAccess.query("select home from football.match where home = 'not bob' limit 1;",function(result)
            {
                result[0][0].should.equal('not bob');
                done();
            },assert.fail)

        })
        
        it('query function should delete rows without error',function(done)
        {

            dbAccess.query("delete from football.match where home = 'not bob'",function(result)
            {
                done();
            },assert.fail)

        })
        
        it('query function should delete rows',function(done)
        {

            dbAccess.query("select count(*) from football.match where home = 'not bob'",(result) => 
            {

                result[0][0].should.equal(0);
                done();

            },assert.fail,assert.fail);

        });

        it("should throw error with undefined connection string",function(done)
        {

            dbAccess.query("select home from football.match limit 1;",assert.fail,assert.fail,() => done(),undefined)
            
        })

        it("should throw error with incorrect connection string",function(done)
        {

            dbAccess.query("select home from football.match limit 1;",assert.fail,assert.fail,() => done(),
                "mysqlx://" + process.env.USER +  ":" + "lolwrong" + "@" + process.env.HOST + ":33060/" + process.env.DATABASE)
            
        })

    })
    
    describe("DatabaseAccess.multiInsertQuery Tests",function()
    {

        it("should not throw error with mutiple insert queries",function(done)
        {

            let queries = 
                ['insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
                'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
                'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
                'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
                'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
                'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
                'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
                'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
                'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
                'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
                'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
                'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
                'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
                'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
                'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
                'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
                'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
                'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
                'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");'
           ];

           dbAccess.multiInsertQuery(queries,() => done(),assert.fail,assert.fail);

        })

        it("should have correct number of rows after mutiple insert queries",function(done)
        {

            dbAccess.query("select * from football.match where home = 'testTeam';",function(result)
            {
                result.length.should.equal(19);
                done();
            },assert.fail)

        })

    })
    
    describe("getAllStructuredData Tests",function()
    {

        before(function(done)
        {
            //just in case 
            this.timeout(10000)

            let queries = 
            ["delete from football.unstructured_data","delete from football.match",'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
            'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
            'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
            'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
            'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
            'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
            'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
            'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
            'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
            'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
            'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
            'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
            'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
            'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
            'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
            'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
            'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
            'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");',
            'insert into football.match (date,home,away,competitionID,data) values ("1991/4/20","testTeam","bob",1,"{}");'
       ];

       dbAccess.multiInsertQuery(queries,() => {
           
        done()
    
        },assert.fail,assert.fail);

       
    
       });

       it("should have correct number of structured data in result",(done) => 
       {

            dbAccess.getAllStructuredData((result) => 
            {

                result.length.should.equal(19);

                done();

            },assert.fail,assert.fail)

       });

       it("should have correct types of structured data in result",(done) => 
       {

            dbAccess.getAllStructuredData((result) => 
            {

                result.every((r) => r instanceof domain.StructuredData).should.equal(true);

                done();

            },assert.fail,assert.fail)

       });

       it("should have correct fields of structured data in result",(done) => 
       {

            dbAccess.getAllStructuredData((result) => 
            {

                let modelObject = new domain.StructuredData(undefined,new Date("1991-04-20T00:00:00.000Z"),"testTeam","bob",1,"some comp",{})

                result.every((r) => 
                {

                    let isHome = modelObject.home == r.home;
                    let isAway = modelObject.away == r.away;
                    let isCompId = modelObject.competitionID == r.competitionID;
                    let isCompName = modelObject.competitionName == r.competitionName;
                    let isPlan = modelObject.plan == r.plan;
                    let isData = JSON.stringify(modelObject.data) == JSON.stringify(r.data); 
                    let isDate = JSON.stringify(modelObject.date) == JSON.stringify(r.date); 
                    let isEqual = isHome && isAway && isCompId && isCompName 
                        && isPlan && isData && isDate;

                    return isEqual;

                }).should.equal(true);

                done();

            },assert.fail,assert.fail);

       });

    });

    
    describe("getAllUnstructuredData Tests",function()
    {

        let actualUid = 0;

        before(function(done)
        {
            //just in case 
            this.timeout(10000)

            let queries = 
            [   
                "delete from football.unstructured_data",
                "delete from football.match",
                'insert into football.match (date,home,away,competitionID,data)' +
                    'values ("1991/4/20","testTeam","bob",1,"{}");'
            ];
            
            

            dbAccess.multiInsertQuery(queries,() => {
                
                dbAccess.query("select id from football.match where home = 'testTeam';",(uid) => 
                    {

                        actualUid = uid[0][0];
                        
                        let insertQueries = 
                        [
                            'insert into football.unstructured_data(matchid,title,author,url,published,extracted,data)values(' + actualUid + ',"some title","testAuthor","some url","2000/1/21","2000/1/21","some text")',
                            'insert into football.unstructured_data(matchid,title,author,url,published,extracted,data)values(' + actualUid + ',"some title","testAuthor","some url","2000/1/21","2000/1/21","some text")',
                            'insert into football.unstructured_data(matchid,title,author,url,published,extracted,data)values(' + actualUid + ',"some title","testAuthor","some url","2000/1/21","2000/1/21","some text")',
                            'insert into football.unstructured_data(matchid,title,author,url,published,extracted,data)values(' + actualUid + ',"some title","testAuthor","some url","2000/1/21","2000/1/21","some text")',
                            'insert into football.unstructured_data(matchid,title,author,url,published,extracted,data)values(' + actualUid + ',"some title","testAuthor","some url","2000/1/21","2000/1/21","some text")'
                            

                        ]

                        dbAccess.multiInsertQuery(insertQueries,() => done(),(err) => {throw err},(err) => {throw err});


                    },(err) => {throw err},(err) => {throw err})

                
            
                },(err) => {throw err},(err) => {throw err});

        
    
       });
       
       it("should have correct number of unstructured data in result",(done) => 
       {

            dbAccess.getAllUnstrucredData((result) => 
            {

                result.length.should.equal(5);

                done();

            },assert.fail,assert.fail)

       });
       
       it("should have correct types of unstructured data in result",(done) => 
       {

            dbAccess.getAllUnstrucredData((result) => 
            {

                result.every((r) => r instanceof domain.UnstructuredData).should.equal(true);

                done();

            },assert.fail,assert.fail)

       });
       
       it("should have correct fields of unstructured data in result",(done) => 
       {

            dbAccess.getAllUnstrucredData((result) => 
            {


                let modelObject = new domain.UnstructuredData(undefined,actualUid,"some title","testAuthor","some url",new Date("2000-01-21T00:00:00.000Z"),
                    new Date("2000-01-21T00:00:00.000Z"),"some text")

                result.every((r) => 
                {

                    let isMatchid = modelObject.matchid == r.matchid;
                    let isTitle = modelObject.title == r.title;
                    let isAuthor = modelObject.author == r.author;
                    let isUrl = modelObject.url == r.url;
                    let isPublished = JSON.stringify(modelObject.published) == JSON.stringify(r.published);
                    let isExtracted = JSON.stringify(modelObject.extracted) == JSON.stringify(r.extracted);
                    let isData = modelObject.data == r.data;


                    return isMatchid && isTitle && isAuthor && isUrl 
                        && isPublished && isExtracted && isData;


                }).should.equal(true);

                done();

            },assert.fail,assert.fail);

       });
       
    });


    
    after(function(done)
    {

        let cleanup = ["delete from football.unstructured_data where author = 'testAuthor';","delete from football.match where home = 'testTeam';","delete from football.competition where id = 1;"];

        dbAccess.multiInsertQuery(cleanup,() => done(),(err) => {throw err},(err) => {throw err});

    })
    
  });