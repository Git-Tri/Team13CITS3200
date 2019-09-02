import React, { Component } from 'react';
import PageHeader from './PageHeader.js';

class AddUnstructuredData extends Component {
    constructor(props) {
        super(props)

        this.state = {
            title: '',
            author: '',
            published: '',
            extracted: '',
            url: '',
            match: '',
            content: ''
        }
    }

    changeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    submitHandler = (e) => {
        e.preventDefault()
        console.log(this.state)
        var request = new XMLHttpRequest()
        request.open('POST', '/add_unstructured_data', true)
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
        request.send(JSON.stringify(this.state))
    }

    goBack = () => {
        //TODO add confirmation for going back
        window.history.back()
    }
    render() {
        const { source, date, team1, team2, title, author, published, extracted, url, match, content } = this.state
		return (
			<div className="page">
				<PageHeader 
					header={"Add Unstructured Data"}
					sidebarVisible={this.props.sidebarVisible}
					handleSidebarClick={this.props.handleSidebarClick}
				/>
                <div id="container" style={{ height: "100vh" }}>
                    <form class="ui form" onSubmit={this.submitHandler}>
                        <div class="inline fields">
                            <div class="one wide field"/>
                            <div class="two wide field">
                                <button onClick={this.goBack} class="fluid ui primary button">
                                    Back
                                </button>
                            </div>
                            <div class="ten wide field">
                            </div>
                            <div class="two wide field">
                                <button class="fluid ui primary button">
                                    Logout
                                </button>
                            </div>
                        </div>
                        <div class="inline fields">
                            <div class="one wide field"/>
                            <div class="two wide field">
                                <button class="fluid ui primary button">
                                    Edit
                                </button>
                            </div>
                            <div class="three wide field"/>
                            <div class="four wide field">
                                <h1>
                                    New Unstructured Data (or a proper header if available)
                                </h1>
                            </div>
                            <div class="three wide field" />
                            <div class="two wide field">
                                <button class="fluid ui primary button">
                                    Toggle: Edited
                                </button>
                            </div>
                        </div>
                        <div class="inline fields">
                            <div class="one wide field"/>
                            <div class="ten wide field">
                                <label>
                                    Title
                                </label>
                                <input type="text" name="title" value={title} onChange={this.changeHandler} />
                            </div>
                            <div class="four wide field">
                                <label>
                                    Author
                                </label>
                                <input type="text" name="author" value={author} onChange={this.changeHandler} />
                            </div>
                        </div>
                        <div class="inline fields">
                            <div class="one wide field"/>
                            <div class="five wide field">
                                <label>
                                    Published
                                </label>
                                <input type="text" name="published" value={published} onChange={this.changeHandler} placeholder ="Date"/>
                            </div>
                            <div class="five wide field">
                                <label>
                                    Extracted
                                </label>
                                <input type="text" name="extracted" value={extracted} onChange={this.changeHandler} placeholder="Date" />
                            </div>
                            <div class="four wide field">
                                <label>
                                    URL
                                </label>
                                <input type="text" name="url" value={url} onChange={this.changeHandler} />
                            </div>
                        </div>
                        <div class="inline fields">
                            <div class="one wide field"/>
                            <div class="five wide field">
                                <div class="ui pointing below label">
                                    Content
                                </div>
                            </div>
                            <div class="seven wide field">
                                <label>
                                    Match
                                </label>
                                <input type="text" name="match" value={match} onChange={this.changeHandler} />
                            </div>
                            <div class="two wide field">
                                <button class="fluid ui primary button">
                                    Change
                                </button>
                            </div>
                        </div>
                        <div class="inline fields">
                            <div class="one wide field"/>
                            <div class="fourteen wide field">
                                <textarea name="content" value={content} onChange={this.changeHandler} />
                            </div>
                        </div>
                        <div class="inline fields">
                            <div class="eleven wide field" />
                            <div class="two wide field">
                                <button class="fluid ui red button">
                                    Delete
                                </button>
                            </div>
                            <div class="two wide field">
                                <button type="submit" class="fluid ui primary button">
                                    Save
                                </button>
                            </div>
                        </div>
                    </form>
				</div>
			</div>
		);
	}
}

export default AddUnstructuredData;