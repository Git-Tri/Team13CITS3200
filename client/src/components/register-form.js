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
			missingDetails: false,
			passwordMismatch: false,
			inputDetailRulebreak: false,
			failedRegistration: false,
			isError: false,
		}
	}

	validInputs(){
		return this.state.username !== "" && this.state.password !== "" && this.state.repeat_password !== "" && this.state.regkey !== "";
	}

	inputCheck(text){
		var lengthCheck = (text.length < 8);

		var differentCharacter = false;
		for (var i = 1; i < text.length; i++) {
			differentCharacter = (text[i] != text[i-1] || differentCharacter);
		}
		
		return lengthCheck && differentCharacter;
	}

	handleChange(e, { name, value }){
		this.setState({ [name]: value });
	}

	clearError(){
		this.setState({
			missingDetails: false,
			passwordMismatch: false,
			inputDetailRulebreak: false
		})
	}

	handleButton(){

		this.clearError();

		if(!this.validInputs()){
			this.setState({missingDetails: true});
			return;
		} else if(this.state.password !== this.state.repeat_password){
			this.setState({passwordMismatch: true});
			return;
		} else if(!this.inputCheck(this.state.password) || !this.inputCheck(this.state.username)){
			this.setState({inputDetailRulebreak: true});
			return;
		}


		fetch("/register",
			{method: "POST",
			body: JSON.stringify({username: this.state.username, password: this.state.password, regkey: this.state.regkey}),
			headers: {
				'Content-Type': 'application/json'
			}
			})
		.then(res => {
				if(res.ok) {
					this.props.history.push('/');
				}
				else if(res.status == 400){
					this.setState({failedRegistration: true})
				}
				else {
					this.setState({isError: true})
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
				<Message visible negative>
					<Message.Header>An error has occured</Message.Header>
					<p>Failed to get data from the server.</p>
				</Message>
			)
		} else if(this.state.failedRegistration){
			return (
				<Message visible negative>
					<Message.Header>Registration unsuccessful</Message.Header>
					<p>Please check your registration key and try again.</p>
				</Message>
			)
		} else if(this.state.missingDetails){
			return (
				<Message visible negative>
					<Message.Header>Username, password or registration missing</Message.Header>
					<p>Please recheck your info.</p>
				</Message>
			)
		} else if(this.state.passwordMismatch){
			return (
				<Message visible negative>
					<Message.Header>Passwords do not match</Message.Header>
					<p>Please recheck your info.</p>
				</Message>
			)
		} else if(this.state.inputDetailRulebreak){
			return (
				<Message visible negative>
					<Message.Header>Usernames and passwords must be at least eight (8) characters</Message.Header>
					<p>Please try again.</p>
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
							name="username"
							value={this.state.username}
							onChange={this.handleChange.bind(this)}
							/>
							<Form.Input
							fluid icon='lock'
							iconPosition='left'
							placeholder='Password'
							type='password'
							name="password"
							value={this.state.password}
							onChange={this.handleChange.bind(this)}
							/>
							<Form.Input
							fluid icon='th'
							iconPosition='left'
							placeholder='Confirm password'
							name="repeat_password"
							type='password'
							value={this.state.repeat_password}
							onChange={this.handleChange.bind(this)}
							/>
							<Form.Input
							fluid icon='key'
							iconPosition='left'
							placeholder='Registration key'
							name="regkey"
							value={this.state.regkey}
							onChange={this.handleChange.bind(this)}
							/>
							<Button primary onClick={this.handleButton.bind(this)}>Register Now</Button>
						</Segment>
					</Form>
					<Message>
						If you alreay have an account, <a href='../login-form'>sign in</a>
					</Message>
					{this.renderError()}
				</Grid.Column>
			</Grid>
		</div>)
	}
}

export default withRouter(RegisterForm);
