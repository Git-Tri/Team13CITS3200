import React, { Component } from 'react';
import { Table, Button, Container, Dimmer,Loader } from 'semantic-ui-react';
/**
 * a generic table for other tables to inherit from
 * inheritance was choosen over composition becuase
 * 1. it allows for more code reuse 
 * 2. it means that data does need to be piped an additional layer
 */
class DataTable extends Component
{
    /**
     * constructs a new match data table
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

        this.state = {activeRow: -1,selectFunc: selectFunc,page:this.props.page,totalPages:this.props.totalPages};
    }

    renderPageButtons()
    {

        

        if(Number.isInteger(this.props.totalPages) && Number.isInteger(this.state.page) && this.state.totalPages > 1)
        {
            return(
                <Container textAlign="right"  >
                                
                    <Button 
                        onClick={() => this.props.onPageChange(--this.state.page)} 
                        disabled={this.state.page < 2 || this.props.paging}>
                        Prev
                    </Button>
                    <Button 
                        onClick={() => this.props.onPageChange(++this.state.page)} 
                        disabled={this.state.page === this.state.totalPages || this.props.paging}>
                        Next
                    </Button>
                    
                </Container>)
            
 
        }

    }

    /**
     * renders the function
     * also checks if the data is valid 
     * only checks the fields which are relevant to this component 
     */
    render()
    {

        if(! Array.isArray( this.props.items) && Object.keys(this.props.items)
            .every((k) => Array.isArray(this.props.items[k]) == false))
        {
            throw Error("Props.items should contain a list of data or an object containing only lists of data")
        }
        
        if(Array.isArray(this.props.items))
        {

            if(this.props.items.every((i) => i != undefined && i != null) == false)
            {
                throw new Error("props.data must be an instance of data")
            }

        }
        if(this.genRows == undefined || this.genHeader == undefined)
        {

            throw new Error("genRows and genHeader must be defined by child component")

        }
        if(this.isValidData !== undefined)
        {

            this.isValidData()

        }

        let isSelectable = this.props.onSelect !== undefined;

        return(
        <div>
            {this.renderPageButtons()}
            <Table striped selectable={isSelectable} >        
                <Table.Header>
                    {this.genHeader()}
                </Table.Header>  
                <Table.Body>
                    {this.genRows()}
                </Table.Body>        
            </Table>
        </div>

        );
    }
}

export default DataTable;
