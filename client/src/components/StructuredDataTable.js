import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import { StructuredData} from "../domain";

/**
 * shows a table of structured data 
 * has the ability to select a row 
 */
class StructuredDataTable extends Component
{

    /**
     * constructs a new structured data table
     * data is mandatory however onSelect is optional 
     * @param {*} props the props passed in
     */
    constructor(props)
    {

        super(props);

        let selectFunc;

        if(this.props.onSelect != undefined)
        {
            selectFunc = (data) => 
                {
                    
                    this.setState({activeRow: data.id})

                    this.props.onSelect(data);

                }
            

        }
        else
        {

            selectFunc = () => {};

        }

        this.state = {activeRow: -1,selectFunc: selectFunc};

    }

    /**
     * renders the function
     * also checks if the data is valid 
     * only checks the fields which are relevant to this component 
     */
    render()
    {

        if(! Array.isArray( this.props.items))
        {

            throw Error("Props.items should contain a list of structured data")

        }
        if(this.props.items.every((i) => i != undefined && i != null) == false)
        {

            throw new Error("props.data must be an instance of structured data")

        }
        //borken into each predicate for easier debugging
        if(this.props.items.every((i) => 
        {
            let isIdValid = typeof(i.id) === "number"
            let isDateValid = i.date instanceof Date;
            let isHomeValid = typeof(i.home) === "string";
            let isAwayValid = typeof(i.away) === "string";
            let isCompNameValid = typeof(i.competitionName) === "string";
            let isPlanValid = typeof(i.plan) === "string"
            return isIdValid && isDateValid && isHomeValid && isAwayValid && isCompNameValid && isPlanValid;
        }) === false)
        {

            throw new Error("every piece of data should have valid date, home, away, comp name and plan");

        }

        let isSelectable = this.props.onSelect !== undefined;



        let rows = this.props.items.map((item, index) => (
            <StructuredDataRow 
                key={item.id} 
                data={item} 
                onSelect={this.state.selectFunc} 
                isActive={item.id == this.state.activeRow}
            />
        ))

        return(
        <Table striped selectable={isSelectable} >        
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Date</Table.HeaderCell>
                    <Table.HeaderCell>Match</Table.HeaderCell>
                    <Table.HeaderCell>Competition</Table.HeaderCell>
                    <Table.HeaderCell>Plan</Table.HeaderCell>
                </Table.Row>
            </Table.Header>  
            <Table.Body>
                {rows}
            </Table.Body>        
        </Table>
        );
    }
}

/**
 * Represents a row of the structured data table
 * as this component isn't exported no additional validation is done 
 * by this component 
 * @param {*} props 
 */
function StructuredDataRow(props)
{

    if((props.data instanceof StructuredData) == false)
    {

        throw Error("props.data must be an instance of structured data");

    }
    
    let date = props.data.date;

    let dateString = date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear();

    let versus = props.data.home + " vs " + props.data.away;

    let selectFunc = props.onSelect != undefined ? props.onSelect : () => {};

    return(
        <Table.Row onClick={() => selectFunc(props.data)} active={props.isActive}>
            <Table.Cell>{dateString}</Table.Cell>
            <Table.Cell>{versus}</Table.Cell>
            <Table.Cell>{props.data.competitionName}</Table.Cell>
            <Table.Cell>{props.data.plan}</Table.Cell>
        </Table.Row>
    );
    
}

export default StructuredDataTable;