import React, { Component } from 'react'
import logo from './logo.svg';
import './App.css';
import {
	Button,
	Header,
	List,
	Menu,
	Segment,
	Sidebar,
	Container
} from 'semantic-ui-react';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import UnstructuredDataList from './pages/UnstructuredDataList';
import MatchList from './pages/MatchList';

class App extends Component {
	state = { visible: true }

	handleSidebarClick = () => this.setState({ visible: !this.state.visible })

	render() {
		const { visible } = this.state

		return (
			<div>
				<Button.Group>
					<Button onClick={this.handleSidebarClick}>
						{(this.state.visible?"Hide":"Show")+" Sidebar"}
					</Button>
				</Button.Group>

				<Sidebar.Pushable as={Segment}>
					<Sidebar
						as={Menu}
						animation='overlay'
						icon='labeled'
						inverted
						onHide={this.handleSidebarHide}
						vertical
						visible={visible}
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
							<Header>
								Welcome!
							</Header>
							<Switch>
								<Route exact path='/' component={Home} />
					    		<Route path='/unstructured_data_list' component={UnstructuredDataList} />
								<Route path='/match_list' component={MatchList} />
							</Switch>
							<div className="Space filler">
								<Container>
									<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
									<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
								</Container>
							</div>
						</div>
					</Sidebar.Pusher>

				</Sidebar.Pushable>
			</div>
		)
	}
}

export default App;