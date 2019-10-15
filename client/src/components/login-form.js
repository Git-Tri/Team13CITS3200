import React, { Component } from 'react';
import { Header, Button, Grid, Form, Message, Segment } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

class LoginForm extends Component {

	constructor(props) {
		super(props)

		this.state = {
			username: "",
			password: "",
			loggedIn: false,
			incorrectLogin: false,
			isError: false
		}
	}

	//Placeholder
	validData(){
		return true;
	}

	handleChange(e, { name, value }){
		this.setState({ [name]: value });		
	}

	handleButton(){
		console.log("Button");
		fetch("/login",
			{method: "POST",
			body: {username: this.state.username, password: this.state.password},
			})
		.then(res => {
				if(res.ok) {

				}
				else if(res.status == 400){
					throw new Error(400);
				}
				else {
					throw new Error(500);
				}
			})
		.catch(err => {
			switch(err.message) {
					case "400":
						this.setState({incorrectLogin: true })
						return;

					default: 
						if(! this.state.isError) {
							this.setState({isError: true})
						}
						return;
				}	
		})
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
							<Form.Input fluid icon='user' iconPosition='left' placeholder='Username' onChange={this.handleChange.bind(this)}/>
							<Form.Input fluid icon='lock' iconPosition='left' placeholder='Password' type='password' onChange={this.handleChange.bind(this)}/>

							<Button primary onClick={this.handleButton.bind(this)}>
							Login
							</Button>
						</Segment>
					</Form>
					<Message>
						<a href='../register-form'>Sign Up</a>
					</Message>
				</Grid.Column>
			</Grid>
		</div>)
	}
}

export default withRouter(LoginForm);
