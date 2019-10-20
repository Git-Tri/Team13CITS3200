import React, { Component } from 'react';
import PageHeader from './page-header.js';
import DataPair from "./data-pair"
import ReactJson from 'react-json-view'
import {bindStructuredData, bindUser} from "../data-binding";
import { Button, Loader, Message, Segment, Container, TextArea,Form,Header} from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import UnstructuredDataTable from "./tables/unstructured-data-table";

class UserPage extends Component {
	
	constructor(props)
    {
        
        super(props)



        this.state = {user: undefined, isLoaded: false, isError: false,headerText:"Loading"}


    }

	/**
     * Handles any errors cuased by a sub-component 
     * @param {*} error the error recieved
     * @param {*} errorInfo information about the error
     */
    componentDidCatch(error, errorInfo)
    {

        this.setState({isError: true});

    }

	/**
     * Loads all edits and bind the parsed json to edit objects
     */
    loadData()
    {

        fetch("/currentuser")
            .then(res => res.json())
            .then(result => 
                {

                    let data = bindUser(result);

					this.setState({user:data,isLoaded: true, isError: false,headerText:data.username})
                })
            .catch(err => this.setState({isError: true,isLoaded:true}));

	}

    /**
     * loads the data if it is not already loaded
     */
	loadIfNotAlready()
	{

		if(this.state.isLoaded === false)
		{

			this.loadData();

		}


	}

    /**
     * renders the page in loading state 
     */
	renderLoaded()
	{

        let isAdmin = this.state.user.admin === 1 ? "Yes" : "No"


		return (
							
                <div>
                    
                    <Container textAlign="left">
                        <DataPair label="Username" text={this.state.user.username}/>
                        <DataPair label="Admin" text={isAdmin}/>
                        <DataPair label="API KEY" text={this.state.user.apikey}/>
                        
                    </Container>
                    
                    
                </div>                  
				
		);

	}

	 /**
     * Renders the page if an error has occured
     */
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

 

    /**
     * renders the page if the data is still loading 
     */
    renderLoading()
    {

        return(<Loader>Loading Data</Loader>)

    }
    
    /**
     * Chooses which render that should be rendered based on 
     * state of the object 
     */
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

	

    /**
     * renders the page 
     */
	render() {

		this.loadIfNotAlready();

		return (<div className="page">
			<PageHeader 
				header={this.state.headerText}
				sidebarVisible={this.props.sidebarVisible}
				handleSidebarClick={this.props.handleSidebarClick}
			/>
			<br/>							    
			<div id="container" style={{minHeight:"100vh"}}>
				{this.executeRender()}
			</div>
		</div>)
		
	}
}

export default withRouter(UserPage);
