import React, { Component } from 'react';
import PageHeader from './PageHeader.js';

class AddUnstructuredData extends Component {

	render() {
		return (
			<div className="page">
				<PageHeader 
					header={"Add Unstructured Data"}
					sidebarVisible={this.props.sidebarVisible}
					handleSidebarClick={this.props.handleSidebarClick}
				/>
                <div id="container" style={{ height: "100vh" }}>
                    <div class="ui form">
                        <div class="inline fields">
                            <div class="three wide field">
                                <button class="ui primary button">
                                    Back
                                </button>
                            </div>
                            <div class="ten wide field">
                                <input type="text" placeholder="Source, Team V Team, Date"/>
                            </div>
                            <div class="three wide field">
                                <button class="ui primary button">
                                    Logout
                                </button>
                            </div>
                        </div>
                        <div class="inline fields">
                            <div class="three wide field">
                                <button class="ui primary button">
                                    Edit
                                </button>
                            </div>
                            <div class="ten wide field">
                            </div>
                            <div class="three wide field">
                                <button class="ui primary button">
                                    Toggle: Edited
                                </button>
                            </div>
                        </div>
                        <div class="inline fields">
                            <div class="eleven wide field">
                                <label>
                                    Title
                                </label>
                                <input type="text"/>
                            </div>
                            <div class="five wide field">
                                <label>
                                    Author
                                </label>
                                <input type="text"/>
                            </div>
                        </div>
                        <div class="inline fields">
                            <div class="five wide field">
                                <label>
                                    Published
                                </label>
                                <input type="text" placeholder ="Date"/>
                            </div>
                            <div class="six wide field">
                                <label>
                                    Extracted
                                </label>
                                <input type="text" placeholder="Date" />
                            </div>
                            <div class="five wide field">
                                <label>
                                    URL
                                </label>
                                <input type="text" />
                            </div>
                        </div>
                        <div class="inline fields">
                            <div class="five wide field">
                                <div class="ui pointing below label">
                                    Content
                                </div>
                            </div>
                            <div class="eight wide field">
                                <label>
                                    Match
                                </label>
                                <input type="text"/>
                            </div>
                            <div class="three wide field">
                                <button class="ui primary button">
                                    Change
                                </button>
                            </div>
                        </div>
                        <div class="field">
                            <textarea></textarea>
                        </div>
                        <div class="inline fields">
                            <div class="ten wide field" />
                            <div class="three wide field">
                                <button class="ui red button">
                                    Delete
                                </button>
                            </div>
                            <div class="three wide field">
                                <button class="ui primary button">
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
				</div>
			</div>
		);
	}
}

export default AddUnstructuredData;