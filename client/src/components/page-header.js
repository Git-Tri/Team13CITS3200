import React, { Component } from 'react';
import { Header, Button, Grid } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

class PageHeader extends Component {

	constructor(props) {
		super(props)

		this.state = {
			isLoggedIn: false //Should get status from index.js
		}
	}

	handleLoginClick(isLogged) {
		if (isLogged) {
			this.setState({isLoggedIn: false});
		} else {
			this.props.history.push('/login-form');
		}
	}

	render() { //isbackable and isloggedin props only used for testing purposes, should be passed through URL under all other circumstances
		let isBackable = this.props.isbackable === undefined ?
			new URLSearchParams(this.props.location.search).get("isbackable") : this.props.isbackable;

		if (this.props.isbackable !== undefined)
			this.setState({isLoggedIn: this.props.isloggedin})

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
					<Button onClick={() => this.handleLoginClick(this.state.isLoggedIn)} >
						{(this.state.isLoggedIn?"Logout":"Login")}
					</Button>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}
}

export default withRouter(PageHeader);
