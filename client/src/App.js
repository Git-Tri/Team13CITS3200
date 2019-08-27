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
import MatchList from './components/MatchList.js';

class App extends Component {
	constructor() {
		super()
		this.state = {
			sidebarVisible: true
		}

		this.handleSidebarClick = () => {
			this.setState({ sidebarVisible: !this.state.sidebarVisible })
			console.log(this.state.sidebarVisible);
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
						<Menu.Header as='h1'>
							Navigation
						</Menu.Header>
						<Menu.Header as='h2'>
							Explore
						</Menu.Header>
						<Menu.Item as='a' href='/'>
							Home
						</Menu.Item>
						<Menu.Item as='a' href='/unstructured_data_list'>
							Unstructured Data List
						</Menu.Item>
						<Menu.Item as='a' href='/match_list'>
							Match List
						</Menu.Item>
					</Sidebar>

					<Sidebar.Pusher>
						<div className="App">
							<Switch>
								<Route 	exact path='/' 
										component={() => <Home sidebarVisible={this.state.sidebarVisible} handleSidebarClick={this.handleSidebarClick.bind(this)}/>}
								/>
					    		<Route 	path='/unstructured_data_list' 
					    				component={() => <UnstructuredDataList sidebarVisible={this.state.sidebarVisible} handleSidebarClick={this.handleSidebarClick.bind(this)}/>}
					    		/>
								<Route 	path='/match_list'
										component={() => <MatchList sidebarVisible={this.state.sidebarVisible} handleSidebarClick={this.handleSidebarClick.bind(this)}/>}
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