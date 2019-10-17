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
			missingDetails: false,
			isError: false,
			loginToken: {}
		}
	}

	validInputs(){
		return this.state.username !== "" && this.state.password !== "";
	}

	handleChange(e, { name, value }){
		this.setState({ [name]: value });
		// this.clearError();	
	}

	// clearError(){
	// 	if(this.validInputs() && this.state.missingDetails){
	// 		this.setState({missingDetails: false});
	// 	}
	// }

	handleButton(){

		if(!this.validInputs()){
			this.setState({missingDetails: true});
			return;
		}

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
				console.log(res.status)
				if(res.ok) {
					this.props.history.push("/");
				}
				else if(res.status === 400){
					
					this.setState({incorrectLogin: true })
				}
				else {
					this.setState({isError: true})
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
				<Message visible negative>
					<Message.Header>An error has occured</Message.Header>
					<p>Failed to get data from the server.</p>
				</Message>
			)
		} else if(this.state.incorrectLogin){
			return (
				<Message visible negative>
					<Message.Header>Incorrect Login</Message.Header>
					<p>Please recheck your login info.</p>
				</Message>
			)
		} else if(this.state.missingDetails){
			return (
				<Message visible negative>
					<Message.Header>Username or password missing</Message.Header>
					<p>Please recheck your login info.</p>
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
					{this.renderError()}	
				</Grid.Column>
			</Grid>
			
		</div>)
	}
}

export default withRouter(LoginForm);
