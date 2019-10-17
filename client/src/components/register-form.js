import React, { Component } from 'react';
import { Header, Button, Grid, Form, Message, Segment } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

class RegisterForm extends Component {

	constructor(props) {
		super(props);

		this.state = {
			username: "",
			password: "",
			repeat_password: "",
			regkey: "",
			passwordMismatch: false,
			failedRegistration: false,
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
		fetch("/register",
			{method: "POST",
			body: JSON.stringify({username: this.state.username, password: this.state.password, regkey: this.state.regkey}),
			headers: {
				'Content-Type': 'application/json'
			}
			})
		.then(res => {
				if(res.ok) {
					this.props.history.push('/login-form');
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
						if(! this.state.failedRegistration)
							this.setState({failedRegistration: true })
						return;

					default: 
						if(! this.state.isError)
							this.setState({isError: true})
						return;
				}	
		})
	}

	renderError(){
		if(this.state.isError){
			return (
				<Message negative>
					<Message.Header>An error has occured</Message.Header>
					<p>Failed to get data from the server.</p>
				</Message>
			)
		} else if(this.state.failedRegistration){
			return (
				<Message negative>
					<Message.Header>Registration unsuccessful</Message.Header>
					<p>Please check your registration key and try again.</p>
				</Message>
			)
		} else {
			return <div></div>
		}
	}


	render() {
		return (<div className="page">
			<Grid textAlign='center' style={{minHeight:"100vh"}} verticalAlign='middle'>
				<Grid.Column style={{ maxWidth: 450 }}>
					<Header as='h2' textAlign='center'>
						Register New User
					</Header>
					<Form size='large'>
						<Segment>
							<Form.Input
							fluid icon='user'
							iconPosition='left'
							placeholder='Username'
							value={this.state.username}
							onChange={this.handleChange.bind(this)}
							/>
							<Form.Input
							fluid icon='lock'
							iconPosition='left'
							placeholder='Password'
							type='password'
							value={this.state.password}
							onChange={this.handleChange.bind(this)}
							/>
							<Form.Input
							fluid icon='th'
							iconPosition='left'
							placeholder='Repeat password'
							type='password'
							value={this.state.repeat_password}
							onChange={this.handleChange.bind(this)}
							/>
							<Form.Input
							fluid icon='key'
							iconPosition='left'
							placeholder='Registration key'
							value={this.state.regkey}
							onChange={this.handleChange.bind(this)}
							/>
							<Button primary onClick={this.handleButton.bind(this)}>Register Now</Button>
						</Segment>
					</Form>
					<Message>
						If you alreay have an account, <a href='../login-form'>sign in</a>
					</Message>
				</Grid.Column>
			</Grid>
			{this.renderError()}
		</div>)
	}
}

export default withRouter(RegisterForm);
