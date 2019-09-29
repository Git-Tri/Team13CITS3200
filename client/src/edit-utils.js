import {MAX_TITLE_SIZE} from "./constants"

function summariseStructuredData(data)
{

    

    let date = data.date;

    let dateString = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();

    let compName = data.competitionName

    let versus = data.home + " vs " + data.away;

    return dateString + " - " + compName + " : " + versus;


}


function summariseUnstructuredData(data)
{


    let date = data.published;

    let dateString = (date.getDate()) + "/" + (date.getMonth()+1) + "/" + date.getFullYear();

    let author = data.author;

    let title = data.title;

    if(title.length > MAX_TITLE_SIZE)
    {

        title = title.substring(0,MAX_TITLE_SIZE-3) + "...";

    }

    return dateString + " - " + author + " : " + title;

}

export function genSummary(edit,data)
{



    if(Number.parseInt(edit.structuredDataID) > 0)
    {

        return summariseStructuredData(data);

    }
    else if(Number.parseInt(edit.unstructuredDataID) > 0)
    {

        return summariseUnstructuredData(data)

    }
    else
    {

        return "Entire Corpus";

    }


}