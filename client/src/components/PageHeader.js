import React, { Component } from 'react';
import { Header, Button, Grid } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

class PageHeader extends Component {


	render() {
		let isBackable = this.props.id === undefined ?
			new URLSearchParams(this.props.location.search).get("isbackable") : this.props.id;

		return (
			<Grid container columns={3}>
				<Grid.Row>
					<Grid.Column>
						<Button onClick={this.props.handleSidebarClick} >
							{(this.props.sidebarVisible?"Hide":"Show")+" sidebar"}
						</Button>
					</Grid.Column>
					<Grid.Column>
					<Header>
						{this.props.header}
					</Header>
					</Grid.Column>
					<Grid.Column>
					<Button 
						onClick={() => {this.props.history.goBack()}}
						disabled={!isBackable}
					>
						Back
					</Button>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}
}

export default withRouter(PageHeader);
