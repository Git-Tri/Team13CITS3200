import React, { Component } from 'react';
import PageHeader from './PageHeader.js';
import { Container, Form, Input, Loader, Message, Button } from 'semantic-ui-react';
import MatchListTable from './MatchListTable.js';
import { bindMatch } from "../Databinding";
import { withRouter } from 'react-router-dom';

import { Match } from "../domain"; //Removed after searching is enabled


class MatchList extends Component {

	constructor(){
		super()
		this.state = { //Four entries, four values, sent as an object to database. Endpoint changes needed next.
			searchtext: '',
			startdate: '0000-00-00',
			enddate: '0000-00-00',
			competition: '',
			handling: {
				data: undefined,
				isLoaded: false,
				isError: false
			}
		}

		this.submitHandler = (e) => { //Currently logs state, 500 error
			console.log(this.state);
			var xhr = new XMLHttpRequest()
			xhr.addEventListener('load', () => {
				console.log(xhr.responseText)
			})
			xhr.open('POST', '/matchlist')
			xhr.send(JSON.stringify(this.state))
			this.loadData()
		}

		this.handleChange = (e, { value }) => {
			this.setState({ [e.target.name]:value })
		}
	}

	loadData(){
		// fetch("/allchooseableData")
		// 	.then(res => res.json())
		// 	.then(result => 
		// 		{
		// 			result.matchList = result.matchList.map((d) => bindMatch(d));
		// 			let matches = result.matchList
		// 			this.setState({handling: {data: matches ,isLoaded: true, isError: false}})
		// 		})
		// 	.catch(err => this.setState({handling: {isError: true}}));

		var testMatchData = [ //Currently guarantees that MatchListTable has data, will replace when searching is enabled
			new Match(1,new Date("1991-04-20T00:00:00.000Z"),"team A","team B",3,"comp A"),
			new Match(2,new Date("1991-04-20T00:00:00.000Z"),"team C","test D",4,"comp B")
		];
		this.setState({handling: {data: testMatchData ,isLoaded: true, isError: false}})
	}

	routeToMatch(match) {
		console.log(match)
		this.props.history.push("/view_match?id=" + match.id + "&isbackable=true");
	}

	executeRender() {
		if(this.state.handling.isError){
			return (<Message negative>
				<Message.Header>An error has occured</Message.Header>
				<p>Failed to get data from the server.</p>
				<Button color="red" onClick={this.loadData.bind(this)}>Try Again?</Button>
			  </Message>
			);
		}

		else if(this.state.handling.isLoaded){
			return (
				<div>
					<p> A list of all matches. Click on a match to view it in detail. </p>				
					<div id="container" style={{height:"100vh"}}>
						<MatchListTable onSelect={this.routeToMatch.bind(this)} items={this.state.handling.data}/>
					</div>
				</div>
			); 
		}

		else {
			return (
				<Loader>Loading Data</Loader>
			);
		}
	}

	render() {

		return (
			<div className="page">
				<PageHeader 
					header={"Match List"}
					sidebarVisible={this.props.sidebarVisible}
					handleSidebarClick={this.props.handleSidebarClick}
				/>
				<Container style={{height:"100vh"}}>
					<Form>
						<Form.Field>
							<Input label="Search" type="text" onChange={this.handleChange.bind(this)} name="searchtext"/> 
						</Form.Field>
						<Form.Group widths="equal">
							<Form.Field>
								<Input label="Between" type="date" onChange={this.handleChange.bind(this)} name="startdate" placeholder="Start date"/>
							</Form.Field>
							<Form.Field>
								<Input type="date" onChange={this.handleChange.bind(this)} name="enddate" placeholder="End date"/>
							</Form.Field>
							<Form.Field>
								<Input label="Competition" type="text" onChange={this.handleChange.bind(this)} name="competition"/>
							</Form.Field>
						</Form.Group>
						<Form.Button 
							onClick={this.submitHandler}
						>
						Submit
						</Form.Button>
					</Form>

					<div id="container" style={{height:"100vh"}}>
						{this.executeRender()}
					</div>
				</Container>
			</div>
		);
	}
}

export default withRouter(MatchList);
