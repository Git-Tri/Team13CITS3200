/**
 * A class representing unstructured data
 * for list you may want to leave the data field undefined
 * NOTE: this code is duplicated on client and server so is only tested on the server
 */
class UnstructuredData
{

    constructor(id,matchid,title,author,url,published,extracted,data)
    {

        this.id = id;
        this.matchid = matchid;
        this.title = title;
        this.author = author;
        this.url = url;
        this.published = published;
        this.extracted = extracted;
        this.data = data; 

    }

}

/**
 * A class representing structured data, for lists you may want to leave data undefined
 */
class StructuredData
{

    constructor(id,date,home,away,competitionID,competitionName,plan,data)
    {

        this.id = id;
        this.date = date;
        this.home = home;
        this.away = away;
        this.competitionID = competitionID;
        this.competitionName = competitionName;
        this.plan = plan;
        this.data = data; 

    }

}

/**
 * a class representing a match 
 */
class Match
{

    constructor(id,date,home,away,competitionID,competitionName,plan)
    {

        this.id = id;
        this.date = date;
        this.home = home;
        this.away = away;
        this.competitionID = competitionID;
        this.competitionName = competitionName;
        this.plan = plan;

    }

}

/**
 * A class representing an edit 
 */
class Edit 
{

    constructor(editID,structuredDataID,unstructuredDataID,isCorpus,settings,replace,replaceWith,type)
    {

        this.editID = editID;
        this.structuredDataID = structuredDataID;
        this.unstructuredDataID = unstructuredDataID;
        this.isCorpus = isCorpus;
        this.settings = settings;
        this.replace = replace;
        this.replaceWith = replaceWith;
        this.type = type;
        
    }

}

//export all classes 
module.exports = 
{

    UnstructuredData,StructuredData,Match,Edit

}