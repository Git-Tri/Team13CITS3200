import React, { Component } from 'react';
import { Header, Button, Grid } from 'semantic-ui-react';

class PageHeader extends Component {


	render() {
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
					<Button onClick={() => {window.history.back()}}>
						Back
					</Button>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}
}

export default PageHeader;