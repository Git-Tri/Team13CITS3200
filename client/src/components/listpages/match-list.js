import React, { Component } from 'react';
import { Container, Form, Input, Loader, Message, Button } from 'semantic-ui-react';
import MatchListTable from '../tables/match-list-table.js';
import { bindMatch,bindCompetition } from "../../data-binding";
import { withRouter } from 'react-router-dom';
import ListPage from './list-page.js';
import {SearchRequest} from "../../domain";

class MatchList extends ListPage {

	constructor(props)
	{

		super(props)

		this.state.headerText = "Match List";

		this.state.route = "/matchlist"

		this.state.isCompLoaded = false;

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
     * Handles any errors cuased by a sub-component 
     * @param {*} error the error recieved
     * @param {*} errorInfo information about the error
     */
    componentDidCatch(error, errorInfo)
    {

        this.setState({isError: true});

    }

	loadData(result) 
	{


		result = result.matches.map((d) => bindMatch(d));



		this.setState({ data: result, isLoaded: true, isError: false });

	}

	routeToMatch(match) {
		this.props.history.push("/view_match?id=" + match.id + "&isbackable=true");
	}

	renderLoaded()
	{

		return (
			<div>
				<p> A list of all matches. Click on a match to view it in detail. </p>				
				<div>
					<MatchListTable 
						totalPages={this.state.totalPages}
						onPageChange={this.handlePageChange.bind(this)}
						page={this.state.page}
						paging={this.state.paging}             
						onSelect={this.routeToMatch.bind(this)} 
						items={this.state.data}/>
				</div>
			</div>
		); 

	}

	/**
     * Loads all edits and bind the parsed json to edit objects
     */
    loadComps()
    {

        fetch("/competitions")
            .then(res => {
				
				if(res.status === 401)
                {

                    window.location.href = "/login-form"                    

                }

				
				return res.json()})
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
                        label="Competition"
                        name="compId"
                        options={this.state.items}
                        onChange={(e,{name,value}) => this.handleSearchChange(name,new SearchRequest("exact",value,"competitionID"))}
                        />


                </Form.Group>

            </div>)

    }


}

export default withRouter(MatchList);
