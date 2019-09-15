import React, { Component } from 'react';
import PageHeader from './PageHeader.js';
import { Container, Loader, Message, Button, Header } from 'semantic-ui-react';
import { bindMatch } from '../Databinding';
import { withRouter } from 'react-router-dom';

import { Match } from "../domain"; //Removed after searching is enabled

class ViewMatch extends Component {
	
	constructor(props){
		super(props)

		let id = this.props.id === undefined ? 
			new URLSearchParams(this.props.location.search).get("id") : this.props.id;

		this.state = { 
			data: undefined,
			isLoaded: false,
			isError: false,
			matchID: id
		}
	}

	loadData(){
		// fetch("/match")
		// 	.then(res => res.json())
		// 	.then(result => 
		// 		{
		// 			result.matchList = result.matchList.map((d) => bindMatch(d));
		// 			let match = result.matchList
		// 			this.setState({data: match ,isLoaded: true, isError: false})
		// 		})
		// 	.catch(err => this.setState({isError: true}));

		var testMatch = new Match(1,new Date("1991-04-20T00:00:00.000Z"),"team A","team B",3,"Not real data!")
		this.setState({data: testMatch ,isLoaded: true, isError: false})
	}

	executeRender() {
		if(this.state.isError){
			return (<Message negative>
				<Message.Header>An error has occured</Message.Header>
				<p>Failed to get data from the server.</p>
				<Button color="red" onClick={this.loadData.bind(this)}>Try Again?</Button>
			  </Message>
			);
		}

		else if(this.state.isLoaded){
			return (
				<div>			
					<div id="container" style={{height:"100vh"}}>
						<Container>
							<Header sub>Match</Header>
							<span>{this.state.data.home} vs. {this.state.data.away}</span>

							<Header sub>Date</Header>
							<span>{Date(this.state.data.date)}</span>

							<Header sub>Competition</Header>
							<span>{this.state.data.competitionName}</span>
						</Container>
					</div>
				</div>
			); 
		}

		else {
			this.loadData()
			return (
				<Message>Loading Data</Message>
			);
		}
	}

	render(){

		return ( //This is a placeholder
			<div className="page">
				<PageHeader 
					header={"View Match"}
					sidebarVisible={this.props.sidebarVisible}
					handleSidebarClick={this.props.handleSidebarClick}
				/>
				<div id="container" style={{height:"100vh"}}>
					{this.executeRender()}
				</div>
			</div>
		);
	}	
}

export default withRouter(ViewMatch);
