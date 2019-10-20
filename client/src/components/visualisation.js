import {Table} from "semantic-ui-react"
import React from "react"

//taken from: https://stackoverflow.com/questions/4878756/how-to-capitalize-first-letter-of-each-word-like-a-2-word-city
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function Visualisation(props)
{

    let awayTeam = props.data.match_awayteam_name

    let homeTeam = props.data.match_hometeam_name;
    

    let cards = props.data.cards.map(c => 
        {
            
            let sideFault = c.away_fault !== "" ? awayTeam + " " +  "Player - " 
                : homeTeam + " " + "Player - "

            let player = c.away_fault !== "" ? c.away_fault : c.home_fault;

            let card = toTitleCase(c.card);

            let event = card + " : " + sideFault + player;

            return {time:Number.parseInt(c.time),event:event,type:"Card"}
    
    
        });

    let goalscorer = props.data.goalscorer.map(c =>  {
            
        let side = c.away_scorer !== "" ? awayTeam + " " +  "Player - " 
        : homeTeam + " " + "Player - "

        let player = c.away_scorer !== "" ? c.away_scorer : c.home_scorer;

        let score = c.score;

        let event = side + player + " - New Score - " + score;

        return {time:Number.parseInt(c.time),event:event,type:"Goal"}


    });

    let subAway = props.data.substitutions.away.map(c => 
        {

            return {time:Number.parseInt(c.time),event:awayTeam + " : " + c.substitution,type:"Substitution"}

        });

    let subHome = props.data.substitutions.away.map(c => 
        {

            return {time:Number.parseInt(c.time),event:homeTeam + " : " + c.substitution,type:"Substitution"}

        });

    let events = [].concat(cards,
                      goalscorer,subAway,
                      subHome)
                      .sort((e1,e2) =>  e1.time - e2.time)
                      .map((e) => 
                      {

                        let isPositive = e.type === "Goal";

                        let isNegative = e.type === "Card"

                        let isWarning = e.type === "Substitution"

                        return(<Table.Row positive={isPositive} negative={isNegative} warning={isWarning} >
                            <Table.Cell>{e.time}</Table.Cell>                            
                            <Table.Cell>{e.type}</Table.Cell>
                            <Table.Cell>{e.event}</Table.Cell>
                        </Table.Row>)

                      });

    


    return (
    
    <div>
    <h1>Visualisation of Events</h1>
    <Table>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Time (mins)</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Event</Table.HeaderCell>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {events}
        </Table.Body>
        
    </Table>
    <br/>
    </div>)

}

export default Visualisation;