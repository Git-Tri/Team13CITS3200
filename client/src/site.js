import React, { Component } from 'react';
import { BrowserRouter as Switch, Route} from 'react-router-dom';
import LoginForm from "./components/login-form.js";
import RegisterForm from "./components/register-form.js";
import App from "./app.js";

class Site extends Component {
	render(){
		return (<div className="Auth" style={{minHeight:"100vh"}}>
					<Switch>
						<Route 	exact path='/'
								component={() => <App/>}
						/>
						<Route 	exact path='/login-form' 
								component={() => <LoginForm/>}
						/>
						<Route 	exact path='/register-form' 
								component={() => <RegisterForm/>}
						/>
					</Switch>
				</div>)
	}
}


export default Site;