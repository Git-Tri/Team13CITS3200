import React, { Component } from 'react';
import { BrowserRouter as Switch, Route } from 'react-router-dom';
import LoginForm from "./components/login-form.js";
import RegisterForm from "./components/register-form.js";
import App from "./app.js";

 function getCookie(name) {
	var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
	if (match) return match[2];
  }

class Site extends Component {
	render(){
		return (<div className="Auth" style={{minHeight:"100vh"}}>
					<Switch>
						<Route 	exact path='/' 
								component={() => 
									{
										
										let isAuth = getCookie("authToken") !== undefined;

										if(isAuth)
										{

											return(<App></App>)

										}
										else
										{
											
											return (<LoginForm></LoginForm>)

										}


									}}
						/>
						<Route 	path='/login-form' 
								component={() => <LoginForm/>}
						/>
						<Route 	path='/register-form' 
								component={() => <RegisterForm/>}
						/>
						<Route 	path='/*'
								component={() => <App/>}
						/>
					</Switch>
				</div>)
	}
}


export default Site;