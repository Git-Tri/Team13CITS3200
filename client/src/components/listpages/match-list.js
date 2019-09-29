import React, { Component } from 'react';
import { Container, Form, Input, Loader, Message, Button } from 'semantic-ui-react';
import MatchListTable from '../tables/match-list-table.js';
import { bindMatch } from "../../data-binding";
import { withRouter } from 'react-router-dom';
import ListPage from './list-page.js';


class MatchList extends ListPage {

	constructor(props)
	{

		super(props)

		this.state.headerText = "Match List";

		this.state.route = "/matchlist"

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

		console.log(result)

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

	renderSearch()
	{

		return(<Form>
			<Form.Field>
				<Input label="Search" type="text" name="searchtext"/> 
			</Form.Field>
			<Form.Group widths="equal">
				<Form.Field>
					<Input label="Between" type="date" name="startdate" placeholder="Start date"/>
				</Form.Field>
				<Form.Field>
					<Input type="date"  name="enddate" placeholder="End date"/>
				</Form.Field>
				<Form.Field>
					<Input label="Competition" type="text"  name="competition"/>
				</Form.Field>
			</Form.Group>
			<Form.Button 
				onClick={this.submitHandler}
			>
			Submit
			</Form.Button>
		</Form>)


	}

}

export default withRouter(MatchList);
