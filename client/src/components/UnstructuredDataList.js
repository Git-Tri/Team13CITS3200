import React, { Component } from 'react';
import PageHeader from './PageHeader.js';

class UnstructuredDataList extends Component {

	render() {
		return (
			<div className="page">
				<PageHeader 
					header={"Unstructured Data List"}
					sidebarVisible={this.props.sidebarVisible}
					handleSidebarClick={this.props.handleSidebarClick}
				/>
				<div id="container" style={{height:"100vh"}}>
                    <form class="ui form">
                        <div class="inline fields">
                            <div class="three wide field" />
                            <div class="ten wide field"/>
                            <div class="three wide field">
                                <button class="ui primary button">
                                    Logout
                                </button>
                            </div>
                        </div>
                        <div class="inline fields">
                            <div class="sixteen wide field">
                                <label>
                                    Search
                                </label>
                                <div class="ui icon input">
                                    <input type="text"/>
                                        <i class="search icon"></i>
                                </div>
                            </div>
                        </div>
                        <div class="inline fields">
                            <div class="eight wide field">
                                <label>
                                    Between
                                </label>
                                <input type="text" placeholder="Start Date" />
                                <input type="text" placeholder="End Date" />
                            </div>
                            <div class="eight wide field">
                                <label>
                                    Match
                                </label>
                                <input type="text" />
                            </div>
                        </div>
                        <div class="inline fields">
                            <div class="eight wide field" />
                            <div class="eight wide field">
                                <label>
                                    League
                                </label>
                                <input type="text"/>
                            </div>
                        </div>
                        <div class="sixteen wide field">
                            <div class="ui message">
                                <div class="header">
                                    Search Results
                                 </div>
                                <p>To add: list of unstructured data that meets above criteria, featuring date, teams, league/tournament, title and publisher. Clicking on an item should take you to the unstructured data page.</p>
                            </div>
                        </div>
                    </form>
				</div>
			</div>
		);
	}
}

export default UnstructuredDataList;
