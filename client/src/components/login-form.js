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
			isError: false,
			loginToken: {}
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

		console.log(this.state.username)

		console.log(JSON.stringify({username: this.state.username, password: this.state.password}))



		fetch("/login",
			{method: "POST",
			body: JSON.stringify({username: this.state.username, password: this.state.password}),
			headers: {
				'Content-Type': 'application/json'
			}
			})
		.then(res => {
				if(res.ok) {
					this.props.history.push("/");
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
						if(! this.state.incorrectLogin)
							this.setState({incorrectLogin: true })
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
		} else if(this.state.incorrectLogin){
			return (
				<Message negative>
					<Message.Header>An error has occured</Message.Header>
					<p>Failed to get data from the server.</p>
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
						Login
					</Header>
					<Form size='large'>
						<Segment>
							<Form.Input
							fluid icon='user'
							iconPosition='left'
							placeholder='Username'
							name="username"
							value={this.state.username}
							onChange={this.handleChange.bind(this)}
							/>
							<Form.Input
							fluid icon='lock'
							iconPosition='left'
							placeholder='Password'
							name="password"
							type='password'
							value={this.state.password}
							onChange={this.handleChange.bind(this)}
							/>
							<Button primary onClick={this.handleButton.bind(this)}>Login</Button>
						</Segment>
					</Form>
					<Message>
						<a href='../register-form'>Sign Up</a>
					</Message>
				</Grid.Column>
			</Grid>
			{this.renderError()}
		</div>)
	}
}

export default withRouter(LoginForm);
