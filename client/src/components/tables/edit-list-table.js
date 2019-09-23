import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import { Edit} from "../../domain";
import { genSummary} from "../../edit-utils";
import DataTable from "./data-table"

/**
 * shows a table of structured data 
 * has the ability to select a row 
 */
class EditListTable extends DataTable
{

    /**
     * constructs a new structured data table
     * data is mandatory however onSelect is optional 
     * @param {*} props the props passed in
     */
    constructor(props)
    {
        super(props);
    }

    genRows()
    {

        console.log(this.props.items)

        return this.props.items.edits.map((item, index) => (
            <EditRow 
                key={item.editID} 
                data={{edit:item,target:this.props.items.targets[index]}} 
                onSelect={this.state.selectFunc} 
                isActive={item.id == this.state.activeRow}
            />
        ))

    }

    genHeader()
    {

        return (<Table.Row>
            <Table.HeaderCell>Target</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Summary</Table.HeaderCell>
        </Table.Row>)

    }

    isValidData()
    {

       
        //borken into each predicate for easier debugging
        if(this.props.items.edits.every((i) => 
        {
            let isEditID = Number.isInteger(i.editID);
            let isTargetValid = i.isCorpus || Number.isInteger(i.structuredDataID) || Number.isInteger(i.unstructuredDataID)
            let isTypeValid = typeof(i.type) == "string";
            let isSettingsValid = (typeof(i.settings) == "object" && i.type != "replacewithfield") || 
                (i.type == "replacewithfield" && typeof(i.settings) == "object" && i.settings !== undefined && i.settings !== null && typeof(i.settings.field) == "string");    
            let isReplaceValid = typeof(i.replace) == "string";
            let isReplaceWithValid = typeof(i.replaceWith) == "string";
            return isEditID && isTargetValid && isTypeValid && isSettingsValid && isReplaceValid && isReplaceWithValid;
        }) === false)
        {

            throw new Error("every piece of data should be a valid edit");

        }
    }
}

/**
 * builds a summary for an edit using it's type and other fields
 * @param {*} edit the edit to build a summary for 
 */
function SummaryBuilder(edit)
{


    switch(edit.type)
    {

        case "replace":
                return <div><i>Replace: </i> {edit.replace}  <i> - with - </i>  {edit.replaceWith}</div>

        case "replacewithfield":
            return <div><i>Replace: </i> {edit.replace}  <i> - with - </i>  {edit.replaceWith} 
                <i> - on field - </i>  {edit.settings.field} </div>

        default:
            return "Error";

    }


}

/**
 * formats the type field of an edit to something more human readable
 * @param {*} edit the edit to return the formatted type field to
 */
function FormatType(edit)
{

    switch(edit.type)
    {

        case "replace":
            return "Replace"

        case "replacewithfield":
            return "Replace with Field"

        default:
            return "Error";

    }

}

/**
 * Represents a row of the edit list table
 * as this component isn't exported no additional validation is done 
 * by this component 
 * @param {*} props 
 */
function EditRow(props)
{

    if((props.data.edit instanceof Edit) == false)
    {

        throw Error("props.data must be an instance of edit");

    }
    

    let edit = props.data.edit;

    let target = props.data.target;

    let selectFunc = props.onSelect != undefined ? props.onSelect : () => {};

    return(
        <Table.Row onClick={() => selectFunc(props.data.edit)} active={props.isActive}>
            <Table.Cell>{genSummary(edit,target)}</Table.Cell>
            <Table.Cell>{FormatType(edit)}</Table.Cell>
            <Table.Cell>{SummaryBuilder(edit)}</Table.Cell>
        </Table.Row>
    );
    
}

export default EditListTable;