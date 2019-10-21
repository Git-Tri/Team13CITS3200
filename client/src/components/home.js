import React, { Component } from 'react';
import PageHeader from './page-header.js';

class Home extends Component {

	render() {
		return (
			<div className="page">
				<PageHeader 
					header={"Home"}
					sidebarVisible={this.props.sidebarVisible}
					handleSidebarClick={this.props.handleSidebarClick}
				/>
				<div id="container" style={{height:"100vh"}}>
					Welcome to Semantic League , a place to build a temporal corpus based on soccer data 
				</div>
			</div>
		);
	}
}

export default Home;