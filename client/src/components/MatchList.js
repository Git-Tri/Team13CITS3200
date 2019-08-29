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
				<div id="container" style={{height:"100vh",width:"90"}}>
					<div class="ui form">
						<div class="field">
							<div class="ui labeled input">
								<div class="ui label">
									Search
								</div>
								<input type="text" />
							</div>
						</div>
						<div class="three fields">
							<div class="field">
								<div class="ui labeled input">
									<div class="ui label">
										Between
									</div>
									<input type="text" placeholder="Start date" />
								</div>
							</div>
							<div class="field">
								<div class="ui input">
									<input type="text" placeholder="End date" />
								</div>
							</div>
							<div class="field">
								<div class="ui labeled input">
									<div class="ui label">
										League
									</div>
									<input type="text" />
								</div>
							</div>
						</div>
					</div>
					<div class="results"></div>
				</div>
			</div>
		);
	}
}

export default MatchList;
