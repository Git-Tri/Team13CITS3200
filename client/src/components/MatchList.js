import React, { Component } from 'react';
import PageHeader from './PageHeader.js';

class MatchList extends Component {

	render() {
		return (
			<div className="page">
				<PageHeader 
					header={"Match List"}
					sidebarVisible={this.props.sidebarVisible}
					handleSidebarClick={this.props.handleSidebarClick}
				/>
				<div id="container" style={{height:"100vh"}}>
					Content goes here
				</div>
			</div>
		);
	}
}

export default MatchList;
