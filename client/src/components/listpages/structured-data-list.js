import React, { Component } from 'react';
import PageHeader from '../page-header.js';
import StructuredDataTable from "../tables/structured-data-table";
import {bindStructuredData} from "../../data-binding";
import { Button, Loader, Message, Container} from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import ListPage from './list-page.js';

export class StructuredDataList extends ListPage {

	constructor(props)
	{

        super(props)
        
        this.state.headerText = "Structured Data Page"

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
    

}

export default withRouter(StructuredDataList);