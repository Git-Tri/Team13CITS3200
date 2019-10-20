import React, { Component } from 'react';
import { Header, Button, Grid } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

class PageHeader extends Component {

	constructor(props) {
		super(props)

	}

	handleLogoutClick() 
	{
	
		fetch("logout",{method:"put",headers: {
            'Content-Type': 'application/json'
        }}).then(res => 
            {

                if(res.ok)
                {
					
					this.props.history.push("/login-form");

                }				
                else if(res.status == 404)
                {

                    throw new Error(404);

                }
                else 
                {

                    throw new Error(500);

                }				


            }).catch(err => 
                {
                    console.log(err)
                    this.setState({isError: true})
                });

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
					<Button onClick={this.handleLogoutClick.bind(this)}>Logout </Button>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}
}

export default withRouter(PageHeader);
