import React, { Component } from 'react';
import PageHeader from './PageHeader.js';

class UnstructuredDataList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            search: '',
            start: '',
            end: '',
            match: '',
            league: ''
        }
    }

    changeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    render() {
        const { search, start, end, match, league } = this.state
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
                            <div class="thirteen wide field"/>
                            <div class="two wide field">
                                <button class="ui primary button">
                                    Logout
                                </button>
                            </div>
                        </div>
                        <div class="inline fields">
                            <div class="one wide field"/>
                            <div class="fourteen wide field">
                                <label>
                                    Search
                                </label>
                                <div class="ui icon input">
                                    <input type="text" name="search" value={search} onChange={this.changeHandler} />
                                        <i class="search icon"></i>
                                </div>
                            </div>
                        </div>
                        <div class="inline fields">
                            <div class="one wide field"/>
                            <div class="eight wide field">
                                <label>
                                    Between
                                </label>
                                <input type="text" name="start" value={start} onchange={this.changeHandler} placeholder="Start Date" />
                                <input type="text" name="end" value={end} onchange={this.changeHandler} placeholder = "End Date" />
                            </div>
                            <div class="six wide field">
                                <label>
                                    Match
                                </label>
                                <input type="text" name="match" value={match} onChange={this.changeHandler} />
                            </div>
                        </div>
                        <div class="inline fields">
                            <div class="nine wide field" />
                            <div class="six wide field">
                                <label>
                                    League
                                </label>
                                <input type="text" name="league" value={league} onChange={this.changeHandler} />
                            </div>
                        </div>
                        <div class="inline fields" >
                            <div class="one wide field"/>
                            <div class="fourteen wide field">
                                <div class="ui message">
                                    <div class="header">
                                        Search Results
                                    </div>
                                    <p>To add: list of unstructured data that meets above criteria, featuring date, teams, league/tournament, title and publisher. Clicking on an item should take you to the unstructured data page.</p>
                                </div>
                            </div>
                        </div>
                    </form>
				</div>
			</div>
		);
	}
}

export default UnstructuredDataList;
