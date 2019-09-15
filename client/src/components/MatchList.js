import React, { Component } from 'react';
import PageHeader from './PageHeader.js';
import { Container, Form, Input, Loader, Message, Button } from 'semantic-ui-react';
import MatchListTable from './MatchListTable.js';
import { bindMatch } from "../Databinding";
import { withRouter } from 'react-router-dom';

import { Match } from "../domain"; //Removed after searching is enabled


class MatchList extends Component {

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

		/*
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
		*/

	loadData() {

		fetch("/matchList")
			.then(res => res.json())
			.then(result => {

				
				result = result.map((d) => bindMatch(d));

				this.setState({ data: result, isLoaded: true, isError: false });

			})
			.catch(err => {
				this.setState({ isError: true })
			});

	}

	loadIfNotAlready()
	{

		if(this.state.isLoaded === false)
		{

			this.loadData();

		}


	}


	routeToMatch(match) {
		this.props.history.push("/view_match?id=" + match.id + "&isbackable=true");
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
					<p> A list of all matches. Click on a match to view it in detail. </p>				
					<div>
						<MatchListTable onSelect={this.routeToMatch.bind(this)} items={this.state.data}/>
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

		this.loadIfNotAlready();

		return (
			<div className="page">
				<PageHeader 
					header={"Match List"}
					sidebarVisible={this.props.sidebarVisible}
					handleSidebarClick={this.props.handleSidebarClick}
				/>
				<div id="container"  style={{minHeight:"100vh"}}>
				<Container>
					<Form>
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
					</Form>

					{this.executeRender()}
					
				</Container>

				</div>
			</div>
		);
	}
}

export default withRouter(MatchList);
