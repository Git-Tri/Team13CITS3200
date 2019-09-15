import React, { Component } from 'react';
import PageHeader from './PageHeader.js';
import StructuredDataTable from "./StructuredDataTable";
import {bindStructuredData} from "../Databinding";
import { Button, Loader, Message, Container} from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

export class StructuredDataList extends Component {

	constructor(props)
	{

		super(props)

		this.state = {data: [], isLoaded: false, isError: false}

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

        fetch("/StructuredDataList")
            .then(res => res.json())
            .then(result => 
                {

					let data = result.structuredData.map((d) => bindStructuredData(d));

					this.setState({data:data,isLoaded: true, isError: false})
                })
            .catch(err => this.setState({isError: true}));

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

		return (
				<div>
					<p> A list of all structured data. Click on an item to view it in detail </p>				
					<div id="container" style={{height:"100vh"}}>
						<StructuredDataTable onSelect={this.routeToData.bind(this)} items={this.state.data}/>
					</div>
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
     * navigates to an edit page with parameters given by inputted edit
     * @param {*} edit the edit inputted 
     */
	routeToData(data)
	{

		this.props.history.push("/structured_data_page?id=" + data.id + "&isbackable=true");
		
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
				header={"Structured Data List"}
				sidebarVisible={this.props.sidebarVisible}
				handleSidebarClick={this.props.handleSidebarClick}
			/>
			<br/>
							
			<div id="container" style={{height:"100vh"}}>
                <Container>
                {this.executeRender()}
                </Container>
			</div>
		</div>)
		
	}
}

export default withRouter(StructuredDataList);