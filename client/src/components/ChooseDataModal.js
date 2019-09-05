import React, { Component } from 'react';
import { Tab, Button, Header, Modal, Loader, Message, Container } from 'semantic-ui-react';
import StructuredDataTable from './StructuredDataTable';
import {StructuredData,UnstructuredData} from "../domain";
import UnstructuredDataTable from "./UnstructuredDataTable";
import {bindStructuredData,bindUnstructureData} from "../Databinding";



class ChooseDataModal extends Component
{ 	

    constructor(props)
    {

        super(props);
      
        if(typeof(this.props.onSelect) != "function")
        {

            throw Error("Choose Data Modal requires onSelect prop which is a function")

        }  

        this.state = {isLoaded: false,
                    data: undefined,
                    isError: false,
                    lastSelectedId: -1,
                    lastSelectedIsStructued: false,
                    isModalOpen: false,
                    selectedItem: undefined,
                    isNoChooseError: false};

    }

    loadData()
    {

        fetch("/allchooseableData")
            .then(res => res.json())
            .then(result => 
                {

                    result.structuredData = result.structuredData.map((d) => bindStructuredData(d));

                    result.unstructuredData = result.unstructuredData.map((d) => bindUnstructureData(d));

                    this.setState({data:result,isLoaded: true, isError: false});

                })
            .catch(err => this.setState({isError: true}));

    }

    handleChooseButtonClick()
    {

        if(this.state.lastSelectedId != -1)
        {

            this.props.onSelect(this.state.selectedItem);

            this.setState({isModalOpen: false});

        }
        
    }

    handleSelection(data)
    {

        let isStructured = (data instanceof StructuredData) === true ? true : false;

        let isSameType = this.state.lastSelectedIsStructued === isStructured;

        if(isSameType && data.id === this.state.lastSelectedId)
        {

            this.props.onSelect(data);      

            this.setState({isModalOpen: false});

        }
        else
        {

            this.setState({lastSelectedIsStructued: isStructured,lastSelectedId: data.id,selectedItem: data});

        }

    }

    renderLoaded()
    {

        return(<div><Tab menu={{pointing:true}} panes={
            [
                { menuItem: 'Structured Data', 
                    render: () => 
                        <Tab.Pane>
                        <StructuredDataTable items={this.state.data.structuredData} 
                            onSelect={this.handleSelection.bind(this)}/>
                        </Tab.Pane> 
                },
                { menuItem: 'Unstructured Data', 
                    render: () => <Tab.Pane>
                                <UnstructuredDataTable items={this.state.data.unstructuredData} 
                                    onSelect={this.handleSelection.bind(this)} />
                                </Tab.Pane> 
                }

            ]}/>
            <Message warning attached hidden={! this.state.isNoChooseError}>
                Please select an item before clicking choose. You can select an item by clicking on a table row
            </Message>
            <br/>
            <Button primary onClick={this.handleChooseButtonClick.bind(this)}>Choose</Button>
            </div>);

    }

    renderError()
    {

        return(  
        <Message negative>
            <Message.Header>An error has occured</Message.Header>
            <p>Failed to get data from the server.</p>
            <Button color="red" onClick={this.loadData.bind(this)}>Try Again?</Button>
          </Message>
          )

    }

    renderLoading()
    {

        return(<Loader>Loading Data</Loader>)

    }
    
    executeRender()
    {

        if(this.state.isError)
        {

            return this.renderError();

        }
        else if(this.state.isLoaded)
        {

            return this.renderLoaded();

        }
        else
        {

            return this.renderLoading();

        }

    }

    handleOpen = () => this.setState({isModalOpen: true})

    handleClose = () => this.setState({isModalOpen: false})

    render()
    {
      
        
        let loadIfNotAlready = () => 
        {

            if(this.state.isLoaded === false)
            {

                this.loadData();

            }

        }
        
        return (
            <Modal 
                closeIcon
                onOpen={loadIfNotAlready}  
                trigger={<Button onClick={this.handleOpen}>Show Modal</Button>}
                onClose={this.handleClose}
                open={this.state.isModalOpen}>
                <Modal.Header>Choose Data</Modal.Header>
                <Modal.Content>                                    
                <Modal.Description>
                    <Header>Please select a piece of data to apply the edit to</Header>
                    <br/>
                </Modal.Description>
                    {this.executeRender()}
                </Modal.Content>
            </Modal>
        );
        
	
    }
}

export default ChooseDataModal;