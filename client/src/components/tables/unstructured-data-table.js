import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import { UnstructuredData} from "../../domain";
import {MAX_TITLE_SIZE} from "../../constants";
import DataTable from "./data-table"
/**
 * shows a table of unstructured data
 * has the ability to select a row 
 */
class UnstructuredDataTable extends DataTable
{
    /**
     * constructs a new unstructured data table
     * data is mandatory however onselect is optional
     * @param {*} props the props passed in 
     */
    constructor(props)
    {

        super(props);

    }

    genRows()
    {

        return this.props.items.map((item, index) => (
            <UnstructuredDataRow 
                key={item.id} 
                data={item} 
                onSelect={this.state.selectFunc} 
                isActive={item.id == this.state.activeRow}
            />
        ))

    }

    genHeader()
    {

        return this.state.header = (<Table.Row>
            <Table.HeaderCell>Published</Table.HeaderCell>
            <Table.HeaderCell>Author</Table.HeaderCell>
            <Table.HeaderCell>Title</Table.HeaderCell>
        </Table.Row>)

    }

    isValidData()
    {

        
        //broken into each predicate for easier debugging
        if(this.props.items.every((i) => {
            let isIdValid = typeof(i.id) === "number" 
            let isPublishedValid = i.published instanceof Date 
            let isAuthorValid = typeof(i.author) === "string"
            let isTitleValid = typeof(i.title) === "string"
            return isIdValid && isPublishedValid && isAuthorValid && isTitleValid;
            }) == false)
        {
            

            
            throw new Error("every piece of data should have valid id, published, title and author");

        }

    }

}

/**
 * Represents a row of the unstructured data table  
 * as this component isn't exported no additional validation is done 
 * by this component 
 * @param {*} props 
 */
function UnstructuredDataRow(props)
{

    if((props.data instanceof UnstructuredData) == false)
    {

        throw Error("props.data must be an instance of unstructured data");

    }
    
    let date = props.data.published;

    let dateString = (date.getDate()) + "/" + (date.getMonth()+1) + "/" + date.getFullYear();

    let title = props.data.title;

    if(title.length > MAX_TITLE_SIZE)
    {

        title = title.substring(0,MAX_TITLE_SIZE-3) + "...";

    }

    let selectFunc = props.onSelect != undefined ? props.onSelect : () => {};

    return(
        <Table.Row onClick={() => selectFunc(props.data)} active={props.isActive}>
            <Table.Cell>{dateString}</Table.Cell>
            <Table.Cell>{props.data.author}</Table.Cell>
            <Table.Cell>{title}</Table.Cell>
        </Table.Row>
    );
    
}

export default UnstructuredDataTable;