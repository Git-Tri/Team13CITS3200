import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import DataTable from "./data-table";
/**
 * shows a table of match data 
 * has the ability to select a row 
 */
class MatchListTable extends DataTable
{
    /**
     * constructs a new match data table
     * data is mandatory however onSelect is optional 
     * @param {*} props the props passed in
     */
    constructor(props)
    {
        super(props);

    }

    genRows()
    {

        return this.props.items.map((item, index) => (
            <MatchRow 
                key={item.id} 
                data={item} 
                onSelect={this.state.selectFunc} 
                isActive={item.id === this.state.activeRow}
            />
        ))


    }

    genHeader()
    {

        return (<Table.Row>
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>Match</Table.HeaderCell>
            <Table.HeaderCell>Competition</Table.HeaderCell>
        </Table.Row>);

    }

    isValidData()
    {

        if(this.props.items.every((i) => 
        {
            let isMatchIdValid = typeof(i.id) === "number"
            let isDateValid = i.date instanceof Date;
            let isHomeValid = typeof(i.home) === "string";
            let isAwayValid = typeof(i.away) === "string";
            let isCompIdValid = typeof(i.competitionID) === "number"
            let isCompNameValid = typeof(i.competitionName) === "string";
            return isMatchIdValid && isDateValid && isHomeValid && isAwayValid && isCompIdValid && isCompNameValid;
        }) === false)
        {
            throw new Error("every piece of data should have valid date, home, away, comp name");
        }
        
    }
   
}
/**
 * Represents a row of the match data table
 * as this component isn't exported no additional validation is done 
 * by this component 
 * @param {*} props 
 */
function MatchRow(props)
{
    let date = props.data.date;
    let dateString = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
    let versus = props.data.home + " vs " + props.data.away;
    let selectFunc = props.onSelect !== undefined ? props.onSelect : () => {};
    return(
        <Table.Row onClick={() => selectFunc(props.data)} active={props.isActive}>
            <Table.Cell>{dateString}</Table.Cell>
            <Table.Cell>{versus}</Table.Cell>
            <Table.Cell>{props.data.competitionName}</Table.Cell>
        </Table.Row>
    );  
}

export default MatchListTable;
