import React, { Component } from 'react';
import PageHeader from './PageHeader.js';
import { Container, Form, Input } from 'semantic-ui-react'


class MatchList extends Component {

	constructor(){
		super()
		this.state = { //Four entries, four values, sent as an object to database. Endpoint changes needed next.
			searchtext: '',
			startdate: '0000-00-00',
			enddate: '0000-00-00',
			league: '',
			dateError: false
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
			if(Date(this.state.startdate)>Date(this.state.enddate)){
				this.setState({dateError: true})
			} else {
				this.setState({dateError: false})
			}
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
								<Input label="League" type="text" onChange={this.handleChange.bind(this)} name="league"/>
							</Form.Field>
						</Form.Group>
						<Form.Button 
							onClick={this.submitHandler}
							disabled={this.state.dateError}
						>
						Submit
						</Form.Button>
					</Form>

					<div className="results"></div>
				</Container>
			</div>
		);
	}
}

export default MatchList;
