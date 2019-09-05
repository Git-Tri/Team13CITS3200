import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import { UnstructuredData} from "../domain";
import {MAX_TITLE_SIZE} from "../Constants";

class UnstructuredDataTable extends Component
{

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

    render()
    {

        if(! Array.isArray( this.props.items))
        {


            throw new Error("Props.items should contain a list of unstructured data")


        }
        if(this.props.items.every((i) => i != undefined && i != null) == false)
        {

            throw new Error("props.data must be an instance of unstructured data")

        }
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

        let isSelectable = this.props.onSelect != undefined;

        


        let rows = this.props.items.map((item, index) => (

            <UnstructuredDataRow 
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
                    <Table.HeaderCell>Published</Table.HeaderCell>
                    <Table.HeaderCell>Author</Table.HeaderCell>
                    <Table.HeaderCell>Title</Table.HeaderCell>
                </Table.Row>
            </Table.Header>  
            <Table.Body>
                {rows}
            </Table.Body>        
        </Table>
        );
    }
}

function UnstructuredDataRow(props)
{

    if((props.data instanceof UnstructuredData) == false)
    {

        throw Error("props.data must be an instance of unstructured data");

    }
    
    let date = props.data.published;

    let dateString = (date.getDay()+1) + "/" + (date.getMonth()+1) + "/" + date.getFullYear();

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