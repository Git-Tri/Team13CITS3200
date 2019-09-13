import React, { Component } from 'react';
import PageHeader from './PageHeader.js';
import { Container, Form, Input } from 'semantic-ui-react';
import MatchListTable from './MatchListTable.js';

import { Match } from "../domain"; //Removed after searching is enabled


class MatchList extends Component {

	constructor(){
		super()
		this.state = { //Four entries, four values, sent as an object to database. Endpoint changes needed next.
			searchtext: '',
			startdate: '0000-00-00',
			enddate: '0000-00-00',
			competition: '',
		}

		this.submitHandler = (e) => { //Currently logs state, 500 error
			console.log(this.state);
			var xhr = new XMLHttpRequest()
			xhr.addEventListener('load', () => {
				console.log(xhr.responseText)
			})
			xhr.open('POST', '/matchlist')
			xhr.send(JSON.stringify(this.state))
		}

		this.handleChange = (e, { value }) => {
			this.setState({ [e.target.name]:value })
		}
	}

	render() {

		const testMatchData = [ //Currently guarantees that MatchListTable has data, will replace when searching is enabled
			new Match(1,new Date("1991-04-20T00:00:00.000Z"),"team A","team B",1,"comp A"),
			new Match(2,new Date("1991-04-20T00:00:00.000Z"),"team C","test D",1,"comp B")
		];

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
						<MatchListTable items={testMatchData} />
					</div>
				</Container>
			</div>
		);
	}
}

export default MatchList;
