import React, { Component } from 'react';
import { Header, Button, Grid } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

class PageHeader extends Component {

	render() { //isbackable prop only used for testing purposes, should be passed through URL under all other circumstances
		let isBackable = this.props.isbackable === undefined ?
			new URLSearchParams(this.props.location.search).get("isbackable") : this.props.isbackable;

		return (
			<Grid style={{padding:"15px 15px 15px 15px"}} container columns={3}>
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
					{isBackable ? <Button 
						onClick={() => {this.props.history.goBack()}}
						disabled={!isBackable}
					>
						Back
					</Button> : undefined }
					
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}
}

export default withRouter(PageHeader);