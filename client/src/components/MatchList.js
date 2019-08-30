import React, { Component } from 'react';
import PageHeader from './PageHeader.js';
import { Container, Form, Input } from 'semantic-ui-react'


class MatchList extends Component {

	state = {

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
							<Input label="Search" type="text" name="search-name"/>
						</Form.Field>
						<Form.Group widths="equal">
							<Form.Field>
								<Input label="Between" type="date" name="search-startdate" placeholder="Start date"/>
							</Form.Field>
							<Form.Field>
								<Input type="date" name="search-enddate" placeholder="End date"/>
							</Form.Field>
							<Form.Field>
								<Input label="League" type="text" name="search-league"/>
							</Form.Field>
						</Form.Group>
						<Form.Button>Submit</Form.Button>
					</Form>

					<div class="results"></div>
				</Container>
			</div>
		);
	}
}

export default MatchList;
