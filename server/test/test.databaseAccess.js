const envResult = require("dotenv").config();

if (envResult.error) 
{
    throw envResult.error
}

const assert = require('assert');
const should = require('chai').should()
const dbAccess = require("../databaseAccess") 

describe('Database Access Tests ', function() {

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
                            '(date,home,away,competitionID,competitionName,plan,data)' +
                             'values ("1991/3/23","bob","testTeam",1,"Some comp","Some plan","{}");'
            

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

            dbAccess.query("select home from football.match limit 1;",function(result)
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
                ['insert into football.match (date,home,away,competitionID,competitionName,plan,data) values ("1991/4/20","massInsert","bob",1,"Some comp","Some plan","{}");',
                'insert into football.match (date,home,away,competitionID,competitionName,plan,data) values ("1991/4/20","massInsert","bob",1,"Some comp","Some plan","{}");',
                'insert into football.match (date,home,away,competitionID,competitionName,plan,data) values ("1991/4/20","massInsert","bob",1,"Some comp","Some plan","{}");',
                'insert into football.match (date,home,away,competitionID,competitionName,plan,data) values ("1991/4/20","massInsert","bob",1,"Some comp","Some plan","{}");',
                'insert into football.match (date,home,away,competitionID,competitionName,plan,data) values ("1991/4/20","massInsert","bob",1,"Some comp","Some plan","{}");',
                'insert into football.match (date,home,away,competitionID,competitionName,plan,data) values ("1991/4/20","massInsert","bob",1,"Some comp","Some plan","{}");',
                'insert into football.match (date,home,away,competitionID,competitionName,plan,data) values ("1991/4/20","massInsert","bob",1,"Some comp","Some plan","{}");',
                'insert into football.match (date,home,away,competitionID,competitionName,plan,data) values ("1991/4/20","massInsert","bob",1,"Some comp","Some plan","{}");',
                'insert into football.match (date,home,away,competitionID,competitionName,plan,data) values ("1991/4/20","massInsert","bob",1,"Some comp","Some plan","{}");',
                'insert into football.match (date,home,away,competitionID,competitionName,plan,data) values ("1991/4/20","massInsert","bob",1,"Some comp","Some plan","{}");',
                'insert into football.match (date,home,away,competitionID,competitionName,plan,data) values ("1991/4/20","massInsert","bob",1,"Some comp","Some plan","{}");',
                'insert into football.match (date,home,away,competitionID,competitionName,plan,data) values ("1991/4/20","massInsert","bob",1,"Some comp","Some plan","{}");',
                'insert into football.match (date,home,away,competitionID,competitionName,plan,data) values ("1991/4/20","massInsert","bob",1,"Some comp","Some plan","{}");',
                'insert into football.match (date,home,away,competitionID,competitionName,plan,data) values ("1991/4/20","massInsert","bob",1,"Some comp","Some plan","{}");',
                'insert into football.match (date,home,away,competitionID,competitionName,plan,data) values ("1991/4/20","massInsert","bob",1,"Some comp","Some plan","{}");',
                'insert into football.match (date,home,away,competitionID,competitionName,plan,data) values ("1991/4/20","massInsert","bob",1,"Some comp","Some plan","{}");',
                'insert into football.match (date,home,away,competitionID,competitionName,plan,data) values ("1991/4/20","massInsert","bob",1,"Some comp","Some plan","{}");',
                'insert into football.match (date,home,away,competitionID,competitionName,plan,data) values ("1991/4/20","massInsert","bob",1,"Some comp","Some plan","{}");',
                'insert into football.match (date,home,away,competitionID,competitionName,plan,data) values ("1991/4/20","massInsert","bob",1,"Some comp","Some plan","{}");'
           ];

           dbAccess.multiInsertQuery(queries,() => done(),assert.fail,assert.fail);

        })

        it("should have correct number of rows after mutiple insert queries",function(done)
        {

            dbAccess.query("select * from football.match where home = 'massInsert';",function(result)
            {
                result.length.should.equal(19);
                done();
            },assert.fail)

        })

    })

    after(function()
    {

        dbAccess.query("delete from football.match where home = 'massInsert'",() => {},console.log)

    })

  });