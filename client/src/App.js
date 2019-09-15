import React, { Component } from 'react'
import './App.css';
import {
	Menu,
	Segment,
	Sidebar,
} from 'semantic-ui-react';

import { BrowserRouter as Switch, Route} from 'react-router-dom';
import Home from './components/Home.js';
import UnstructuredDataList from './components/UnstructuredDataList.js';
import StructuredDataList from './components/StructuredDataList.js';
import MatchList from './components/MatchList.js';
import ViewMatch from './components/ViewMatch.js';
import EditList from './components/EditList.js';
import AddEdit from './components/AddEdit.js';
import ImportStructuredData from './components/ImportStructuredData.js';
import AddUnstructuredData from './components/AddUnstructuredData.js';
import Export from './components/Export.js';
import StructuredDataPage from "./components/StructuredDataPage"

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
						<Menu.Item as='a' href='/unstructured_data_list'>
							Unstructured Data List
						</Menu.Item>
						<Menu.Item as='a' href='/structured_data_list'>
							Structured Data List
						</Menu.Item>
						<Menu.Item as='a' href='/match_list'>
							Match List
						</Menu.Item>
						<Menu.Item as='a' href='/edit_list'>
							Edit List
						</Menu.Item>
						<Menu.Item as='a' href='/add_edit'>
							Add Edit
						</Menu.Item>
						<Menu.Item as='a' href='/import_structured_data'>
							Import Structured Data
						</Menu.Item>
						<Menu.Item as='a' href='/add_unstructured_data'>
							Add Unstructured Data
						</Menu.Item>
						<Menu.Item as='a' href='/export'>
							Export
						</Menu.Item>
					</Sidebar>

					<Sidebar.Pusher>
						<div className="App" style={{minHeight:"100vh"}}>
							<Switch>
								<Route 	exact path='/' 
										component={() => <Home sidebarVisible={this.state.sidebarVisible} handleSidebarClick={this.handleSidebarClick.bind(this)}/>}
								/>
					    		<Route 	path='/unstructured_data_list' 
					    				component={() => <UnstructuredDataList sidebarVisible={this.state.sidebarVisible} handleSidebarClick={this.handleSidebarClick.bind(this)}/>}
					    		/>
					    		<Route 	path='/structured_data_list' 
					    				component={() => <StructuredDataList sidebarVisible={this.state.sidebarVisible} handleSidebarClick={this.handleSidebarClick.bind(this)}/>}
					    		/>
								<Route 	path='/match_list'
										component={() => <MatchList sidebarVisible={this.state.sidebarVisible} handleSidebarClick={this.handleSidebarClick.bind(this)}/>}
								/>
								<Route 	path='/view_match'
										component={() => <ViewMatch sidebarVisible={this.state.sidebarVisible} handleSidebarClick={this.handleSidebarClick.bind(this)}/>}
								/>
								<Route 	path='/edit_list'
										component={() => <EditList sidebarVisible={this.state.sidebarVisible} handleSidebarClick={this.handleSidebarClick.bind(this)}/>}
								/>
								<Route 	path='/add_edit'
										component={() => <AddEdit sidebarVisible={this.state.sidebarVisible} handleSidebarClick={this.handleSidebarClick.bind(this)}/>}
								/>
								<Route 	path='/import_structured_data'
										component={() => <ImportStructuredData sidebarVisible={this.state.sidebarVisible} handleSidebarClick={this.handleSidebarClick.bind(this)}/>}
								/>
								<Route 	path='/add_unstructured_data'
										component={() => <AddUnstructuredData sidebarVisible={this.state.sidebarVisible} handleSidebarClick={this.handleSidebarClick.bind(this)}/>}
								/>
								<Route 	path='/export'
										component={() => <Export sidebarVisible={this.state.sidebarVisible} handleSidebarClick={this.handleSidebarClick.bind(this)}/>}
								/>
								<Route 	path='/structured_data_page'
										component={() => <StructuredDataPage sidebarVisible={this.state.sidebarVisible} handleSidebarClick={this.handleSidebarClick.bind(this)}/>}
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