import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import { User } from "../../domain";
import {MAX_TITLE_SIZE} from "../../constants";
import DataTable from "./data-table"
/**
 * shows a table of users
 * has the ability to promote, demote or remove them 
 */
class UserTable extends DataTable
{
    /**
     * constructs a new users table
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
            <UserRow 
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
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
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
 * Represents a row of the users table  
 * as this component isn't exported no additional validation is done 
 * by this component 
 * @param {*} props 
 */
function UserRow(props)
{

    if((props.data instanceof User) == false)
    {

        throw Error("props.data must be an instance of user");

    }
    
    let date = props.data.published;

    let dateString = (date.getDate()) + "/" + (date.getMonth()+1) + "/" + date.getFullYear();

    let title = props.data.title;

    if(title.length > MAX_TITLE_SIZE)
    {

        title = title.substring(0,MAX_TITLE_SIZE-3) + "...";

    }

    let selectFunc = props.onSelect != undefined ? props.onSelect : (a, b) => { };

    return(
        <Table.Row active={props.isActive}>
            <Table.Cell>{dateString}</Table.Cell>
            <Table.Cell>{props.data.author}</Table.Cell>
            <Table.Cell>
                <button className="fluid ui positive button" type="button" onClick={() => selectFunc("p" + props.data.title)}>
                    Promote
                </button>
            </Table.Cell>
            <Table.Cell>
                <button className="fluid ui negative button" type="button" onClick={() => selectFunc("d" + props.data.title)}>
                    Demote
                </button>
            </Table.Cell>
            <Table.Cell>
                <button className="fluid ui negative button" type="button" onClick={() => selectFunc("r" + props.data.title)}>
                    Remove
                </button>
            </Table.Cell>
        </Table.Row>
    );
    
}

export default UserTable;