import React, { Component } from 'react';
import { Header, Button, Grid, Form, Message, Segment } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

class LoginForm extends Component {

	constructor(props) {
		super(props)

		this.state = {
			
		}
	}

	render() {
		return (<div className="page">
			<Grid textAlign='center' style={{minHeight:"100vh"}} verticalAlign='middle'>
				<Grid.Column style={{ maxWidth: 450 }}>
					<Header as='h2' textAlign='center'>
						Login
					</Header>
					<Form size='large'>
						<Segment>
							<Form.Input fluid icon='user' iconPosition='left' placeholder='Username' />
							<Form.Input
							fluid
							icon='lock'
							iconPosition='left'
							placeholder='Password'
							type='password'
							/>

							<Button>
							Login
							</Button>
						</Segment>
					</Form>
					<Message>
						<a href='#'>Sign Up</a>
					</Message>
				</Grid.Column>
			</Grid>
		</div>)
	}
}

export default withRouter(LoginForm);
