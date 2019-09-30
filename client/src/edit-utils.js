import {MAX_TITLE_SIZE} from "./constants"
import {UnstructuredData,StructuredData} from "./domain"

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

export function genSummary(data)
{


    if(data === null || data === undefined)
    {

        return "Entire Corpus"

    }
    if(data instanceof StructuredData)
    {

        return summariseStructuredData(data);

    }
    else if(data instanceof UnstructuredData)
    {

        return summariseUnstructuredData(data)

    }
    else
    {

        return "Entire Corpus";

    }


}