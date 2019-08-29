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
					<div class="ui form" method="POST" action="/search">
						<div class="field">
							<div class="ui labeled input">
								<div class="ui label">
									Search
								</div>
								<input type="text" name="search-name"/>
							</div>
						</div>
						<div class="three fields">
							<div class="field">
								<div class="ui labeled input">
									<div class="ui label">
										Between
									</div>
									<input type="date" name="search-startdate" placeholder="Start date" />
								</div>
							</div>
							<div class="field">
								<div class="ui input">
									<input type="date" name="search-enddate" placeholder="End date" />
								</div>
							</div>
							<div class="field">
								<div class="ui labeled input">
									<div class="ui label">
										League
									</div>
									<input type="text" name="search-league"/>
								</div>
							</div>
						</div>
						<button class="ui button" value="submit" style={{width:"100vh"}}>Submit</button>
					</div>
					<div class="results"></div>
				</div>
			</div>
		);
	}
}

export default MatchList;
