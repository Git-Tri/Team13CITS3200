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
            <Table.HeaderCell>Username</Table.HeaderCell>
            <Table.HeaderCell>Is admin</Table.HeaderCell>
            <Table.HeaderCell>Code</Table.HeaderCell>
        </Table.Row>)

    }

    isValidData()
    {

        
        //broken into each predicate for easier debugging
        if(this.props.items.every((i) => {
            let isIdValid = typeof(i.id) === "number" 
            let isUsernameValid = typeof(i.username) === "string"
            let isHashValid = typeof (i.hash) === "string"
            let isAdminValid = typeof (i.admin) === "number" 
            let isRegkeyValid = typeof (i.regkey) === "string"
            let isTokenValid = typeof (i.token) === "string"
            let isAPIKeyValid = typeof (i.apikey) === "string"
            return isIdValid && isUsernameValid && isAdminValid && isRegkeyValid && isAPIKeyValid;
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

    let username = props.data.username

    let code = props.data.regkey

    let isAdmin = "No"

    if (props.data.admin == 1) { isAdmin = "Yes" }

    let selectFunc = props.onSelect != undefined ? props.onSelect : (a, b) => { };

    return(
        <Table.Row active={props.isActive}>
            <Table.Cell>{username}</Table.Cell>
            <Table.Cell>{isAdmin}</Table.Cell>
            <Table.Cell>{code}</Table.Cell>
            <Table.Cell>
                <button className="fluid ui positive button" type="button" onClick={() => selectFunc("p" + props.data.username)}>
                    Promote
                </button>
            </Table.Cell>
            <Table.Cell>
                <button className="fluid ui negative button" type="button" onClick={() => selectFunc("d" + props.data.username)}>
                    Demote
                </button>
            </Table.Cell>
            <Table.Cell>
                <button className="fluid ui negative button" type="button" onClick={() => selectFunc("r" + props.data.username)}>
                    Remove
                </button>
            </Table.Cell>
        </Table.Row>
    );
    
}

export default UserTable;