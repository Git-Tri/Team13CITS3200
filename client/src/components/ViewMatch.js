import React, { Component } from 'react';
import PageHeader from './PageHeader.js';
import { withRouter } from 'react-router-dom';

class ViewMatch extends Component {
	

	constructor(){
		super()

		let id = this.props.id === undefined ? 
			new URLSearchParams(this.props.location.search).get("id") : this.props.id;

		this.loadData(id)

		this.state = { 
			data: undefined,
			isLoaded: false,
			isError: false,
			matchID: -1
		}
	}

	loadData(matchID){
		fetch("/allchooseableData")
			.then(res => res.json())
			.then(result => 
				{
					result.matchList = result.matchList.map((d) => bindMatch(d));
					let match = result.matchList
					this.setState({data: match ,isLoaded: true, isError: false, matchID: matchID})
				})
			.catch(err => this.setState({isError: true}));
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

	render(){

		return ( //This is a placeholder
			<div className="page">
				<PageHeader 
					header={"View Match"}
					sidebarVisible={this.props.sidebarVisible}
					handleSidebarClick={this.props.handleSidebarClick}
				/>
				<div id="container" style={{height:"100vh"}}>
					Match content of {id} goes here
				</div>
			</div>
		);
	}	
}

export default withRouter(ViewMatch);
