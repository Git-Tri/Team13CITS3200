import React, { Component } from 'react';
import PageHeader from './PageHeader.js';
import { UnstructuredData } from "../domain";


class AddUnstructuredData extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: '',
            matchid: '',
            title: '',
            author: '',
            published: '',
            extracted: '',
            url: '',
            match: '',
            data: ''
        }
        var exists = false;
    }

    changeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    submitHandler = (e) => {
        e.preventDefault()
        var toSend = new UnstructuredData(this.state.id, this.state.matchid, this.state.title, this.state.author, this.state.url, this.state.published, this.state.extracted, this.state.data)
        console.log(this.state)
        console.log(toSend)
        var request = new XMLHttpRequest()
        if (!this.exists) {
            request.open('POST', '/unstructuredData', true)
            request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
            request.send(JSON.stringify(this.state))
        }
        else {
            request.open('PUT', '/unstructuredData', true)
            request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
            request.send(JSON.stringify(this.state))
        }
        request.onload = function () {
            if (request.status != 200) {
                alert(`Error ${request.status}: ${request.statusText}`)
            }
            else {
                alert(`Saved`)
            }
        }
        request.onerror = function () {
            alert("Save failed")
        }
    }

    deleteHandler = (e) => {
        e.preventDefault()
        if (this.exists) {
            var request = new XMLHttpRequest()
            request.open('DELETE', '/unstructuredData', true)
            request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
            request.send(JSON.stringify(this.state.id))
            request.onload = function () {
                if (request.status != 200) {
                    alert(`Error ${request.status}: ${request.statusText}`)
                }
                else {
                    alert(`Deleted`)
                }
            }
            request.onerror = function () {
                alert("Delete failed")
            }
        }
        else {
            console.log("You can't delete what doesn't exist.")
        }
    }

    load = (id) => {
        var request = new XMLHttpRequest()
        request.open('GET', `/unstructuredData?id=${id}`, true)
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
        request.send()
        request.onload = function () {
            if (request.status != 200) {
                alert(`Error ${request.status}: ${request.statusText}`)
            }
            else {
                // what to do with the retrieved data
            }
        }
        request.onerror = function () {
            alert("Load failed")
        }
    }

    render() {
        const { id, matchid, title, author, published, extracted, url, match, data } = this.state
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
                                <textarea name="data" value={data} onChange={this.changeHandler} />
                            </div>
                        </div>
                        <div class="inline fields">
                            <div class="eleven wide field" />
                            <div class="two wide field">
                                <button class="fluid ui red button" onClick={this.deleteHandler} >
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