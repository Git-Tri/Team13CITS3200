import React, { Component } from 'react';
import PageHeader from './page-header.js';
import DataPair from "./data-pair"
import ReactJson from 'react-json-view'
import {bindStructuredData, bindUnstructureData} from "../data-binding";
import { Button, Loader, Message, Segment, Container, TextArea,Form,Header} from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import UnstructuredDataTable from "./tables/unstructured-data-table";
import Visualisation from "./visualisation"

class ViewMatch extends Component {
	
	constructor(props)
    {
        
        super(props)

        //allow passing in of id for testing 
        let id = props.id === undefined ? 
        new URLSearchParams(props.location.search).get("id") : props.id;

        if(id === undefined || id === null)
        {

            throw new Error("id must be defined")

        }

        this.state = {unstructuredData: [],data: [],isUnstructuredLoaded: false, isLoaded: false, isError: false, id:id,headerText:"Loading"}


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

        fetch("/StructuredData?id=" + this.state.id)
            .then(res => {
                if(res.status === 401)
                {

                    window.location.href = "/login-form"                    

                }

                
                
                return res.json()})
            .then(result => 
                {

                    let data = bindStructuredData(result);

                    let date = data.date;

                    let dateString = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
                    
                    let headerText = data.home + " vs " + data.away + " on " + dateString; 

					this.setState({data:data,isLoaded: true, isError: false,headerText: headerText})
                })
            .catch(err => this.setState({isError: true,isLoaded:true}));

	}
	
	/**
     * Loads all edits and bind the parsed json to edit objects
     */
    loadUnstructuredData()
    {

        fetch("/getUnstructuredDataByMatchId?id=" + this.state.id)
            .then(res => {
                if(res.status === 401)
                {

                    window.location.href = "/login-form"                    

                }

                
                return res.json()})
            .then(result => 
                {

					console.log(result)

					let data = result.unstructuredData.map((d) => bindUnstructureData(d));
                

					console.log(data)

					this.setState({unstructuredData:data,isUnstructuredLoaded: true, isError: false})
                })
            .catch(err => this.setState({isError: true,isUnstructuredLoaded: true}));

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

	loadUnstructuredIfNotAlready()
	{

		if(this.state.isUnstructuredLoaded === false)
		{

			this.loadUnstructuredData();

		}

	}

	renderLoadedUnstructuredData()
	{

	}

    /**
     * renders the page in loading state 
     */
	renderLoaded()
	{

        let date = this.state.data.date;

        let dateString = date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear();

		return (
							
                <div>
                    
                    <Container textAlign="left">
                        <Segment basic size="large"><b>Date:</b>{dateString} <b>Competition:</b>{this.state.data.competitionName}</Segment>
                    	<Visualisation data={this.state.data.data}></Visualisation>
                        <Header>Unstructured Data</Header>
						<UnstructuredDataTable items={this.state.unstructuredData}/>
						<Header>Structured Data</Header>
                        <ReactJson src={this.state.data.data}/>   
                        
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

		this.loadUnstructuredIfNotAlready();

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

export default withRouter(ViewMatch);
