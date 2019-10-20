import React, { Component } from 'react';
import PageHeader from '../page-header.js';
import StructuredDataTable from "../tables/structured-data-table";
import {bindStructuredData,bindCompetition} from "../../data-binding";
import { Button, Loader, Message, Container, Form, SearchResult} from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import ListPage from './list-page.js';
import {SearchRequest} from "../../domain";

export class StructuredDataList extends ListPage {

	constructor(props)
	{

        super(props)
        
        this.state.headerText = "Structured Data Page";

        this.state.route = "/structuredDataList";

        this.state.isCompLoaded = false;

	}



     /**
      * 
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
    loadData(result)
    {

        let data = result.structuredData.map((d) => bindStructuredData(d));

        this.setState({data:data,isLoaded: true, isError: false})

    }

    genDropDownItems(items,names)
	{

		return items.map((item,index) => 
		{

			//taken from https://stackoverflow.com/questions/7225407/convert-camelcasetext-to-sentence-case-text
			let text = names !== undefined ? names[index] : item.replace(/([a-z])([A-Z][a-z])/g, "$1 $2").charAt(0).toUpperCase()+item.slice(1).replace(/([a-z])([A-Z][a-z])/g, "$1 $2");

			return {key:item,text:text,value:item};

		})

	}

	/**
     * Loads all edits and bind the parsed json to edit objects
     */
    loadComps()
    {

        fetch("/competitions")
            .then(res => res.json())
            .then(result => 
                {

                    let data = result.map(r => bindCompetition(r));
					
					let values = data.map(c => c.id);

					let names = data.map(c => c.name);					

					this.setState({items:this.genDropDownItems(values,names),isCompLoaded: true})
                })

    }

    handleDateSearchChange(name,value,isAfter)
    {

        if(value == "")
        {

            this.handleSearchChange(name,undefined);

        }
        else
        {

            let type = isAfter ? "after" : "before";
            let parsedValue = value.split("-")


            let date = new Date(parsedValue[0],parsedValue[1],parsedValue[2]);
        
            this.handleSearchChange(name,new SearchRequest(type,date,"date"));
        }


    }

    renderSearch()
    {

        if(this.state.isCompLoaded === false)
        {
        
            this.loadComps();

        }


        return(
            <div>
                <Form.Input
                    placeholder="Search"
                    name="search"
                    icon="search"
                    onChange={(e,{name,value}) => 
                            this.handleSearchChange(name,new SearchRequest("text",value,["home","away","competitionName"]))}
                    />
                <Form.Group inline>
                    <Form.Input
                        placeholder="before"
                        label="Between"
                        name="after"
                        type="date"
                        onChange={(e,{name,value}) => 
                        this.handleDateSearchChange(name,value,true)}
                        />
                    <Form.Input
                        placeholder="after"
                        name="before"
                        type="date"
                        onChange={(e,{name,value}) => 
                        this.handleDateSearchChange(name,value,false)}
                        />
                    <Form.Select
                    clearable
                        label="Competition"
                        name="compId"
                        options={this.state.items}
                        onChange={(e,{name,value}) => this.handleSearchChange(name,new SearchRequest("exact",value,"competitionID"))}
                        />


                </Form.Group>

            </div>)

    }

    /**
     * renders the page in loading state 
     */
	renderLoaded()
	{

		return (
				<div>
					<p> A list of all structured data. Click on an item to view it in detail </p>
                    <StructuredDataTable 
                        totalPages={this.state.totalPages}
                        onPageChange={this.handlePageChange.bind(this)}
                        page={this.state.page}
                        paging={this.state.paging}                
                        onSelect={this.routeToData.bind(this)} 
                        items={this.state.data}/>					
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