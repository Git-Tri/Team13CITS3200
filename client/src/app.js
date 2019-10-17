import React, { Component } from 'react'
import './App.css';
import {
	Menu,
	Segment,
	Sidebar,
} from 'semantic-ui-react';  

import { BrowserRouter as Switch, Route} from 'react-router-dom';
import Home from './components/home.js';
import UnstructuredDataList from './components/listpages/unstructured-data-list.js';
import StructuredDataList from './components/listpages/structured-data-list.js';
import MatchList from './components/listpages/match-list.js';
import ViewMatch from './components/view-match.js';
import EditList from './components/listpages/edit-list';
import AddEdit from './components/add-edit.js';
import ImportStructuredData from './components/import-structured-data.js';
import AddUnstructuredData from './components/add-unstructured-data.js';
import Export from './components/export.js';
import StructuredDataPage from "./components/structured-data-page";
import LoginForm from "./components/login-form.js";
import RegisterForm from "./components/register-form.js";

class App extends Component {
	constructor() {
		super()
		this.state = {
			sidebarVisible: true
		}

		this.handleSidebarClick = () => {
			this.setState({ sidebarVisible: !this.state.sidebarVisible })
		}
	}
	
	render() {

		return (
			<div>
				<Sidebar.Pushable as={Segment}>
					<Sidebar
						as={Menu}
						animation='push'
						icon='labeled'
						inverted
						onHide={this.handleSidebarHide}
						vertical
						visible={this.state.sidebarVisible}
						width='thin'
					>						
						<Menu.Item as='a' href='/'>
							Home
						</Menu.Item>
						<Menu.Item as='a' href='/site/unstructured_data_list'>
							Unstructured Data List
						</Menu.Item>
						<Menu.Item as='a' href='/site/structured_data_list'>
							Structured Data List
						</Menu.Item>
						<Menu.Item as='a' href='/site/match_list'>
							Match List
						</Menu.Item>
						<Menu.Item as='a' href='/site/edit_list'>
							Edit List
						</Menu.Item>
						<Menu.Item as='a' href='/site/add_edit'>
							Add Edit
						</Menu.Item>
						<Menu.Item as='a' href='/site/import_structured_data'>
							Import Structured Data
						</Menu.Item>
						<Menu.Item as='a' href='/site/add_unstructured_data'>
							Add Unstructured Data
						</Menu.Item>
						<Menu.Item as='a' href='/site/export'>
							Export
						</Menu.Item>
					</Sidebar>

					<Sidebar.Pusher>
						<div className="App" style={{minHeight:"100vh"}}>
							<Switch>
								<Route 	exact path='/' 
										component={() => <Home sidebarVisible={this.state.sidebarVisible} handleSidebarClick={this.handleSidebarClick.bind(this)}/>}
								/>
					    		<Route 	path='/site/unstructured_data_list' 
					    				component={() => <UnstructuredDataList sidebarVisible={this.state.sidebarVisible} handleSidebarClick={this.handleSidebarClick.bind(this)}/>}
					    		/>
					    		<Route 	path='/site/structured_data_list' 
					    				component={() => <StructuredDataList sidebarVisible={this.state.sidebarVisible} handleSidebarClick={this.handleSidebarClick.bind(this)}/>}
					    		/>
								<Route 	path='/site/match_list'
										component={() => <MatchList sidebarVisible={this.state.sidebarVisible} handleSidebarClick={this.handleSidebarClick.bind(this)}/>}
								/>
								<Route 	path='/site/view_match'
										component={() => <ViewMatch sidebarVisible={this.state.sidebarVisible} handleSidebarClick={this.handleSidebarClick.bind(this)}/>}
								/>
								<Route 	path='/site/edit_list'
										component={() => <EditList sidebarVisible={this.state.sidebarVisible} handleSidebarClick={this.handleSidebarClick.bind(this)}/>}
								/>
								<Route 	path='/site/add_edit'
										component={() => <AddEdit sidebarVisible={this.state.sidebarVisible} handleSidebarClick={this.handleSidebarClick.bind(this)}/>}
								/>
								<Route 	path='/site/import_structured_data'
										component={() => <ImportStructuredData sidebarVisible={this.state.sidebarVisible} handleSidebarClick={this.handleSidebarClick.bind(this)}/>}
								/>
								<Route 	path='/site/add_unstructured_data'
										component={() => <AddUnstructuredData sidebarVisible={this.state.sidebarVisible} handleSidebarClick={this.handleSidebarClick.bind(this)}/>}
								/>
								<Route 	path='/site/export'
										component={() => <Export sidebarVisible={this.state.sidebarVisible} handleSidebarClick={this.handleSidebarClick.bind(this)}/>}
								/>
								<Route 	path='/site/structured_data_page'
										component={() => <StructuredDataPage sidebarVisible={this.state.sidebarVisible} handleSidebarClick={this.handleSidebarClick.bind(this)}/>}
								/>
								<Route	path='/site/login-form'
										component={() => <LoginForm sidebarVisible={this.state.sidebarVisible} handleSidebarClick={this.handleSidebarClick.bind(this)}/>}
								/>
								<Route	path='/site/register-form'
										component={() => <RegisterForm sidebarVisible={this.state.sidebarVisible} handleSidebarClick={this.handleSidebarClick.bind(this)}/>}
								/>
							</Switch>
						</div>
					</Sidebar.Pusher>

				</Sidebar.Pushable>
			</div>
		)
	}
}

export default App;