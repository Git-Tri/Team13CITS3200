import React, { Component } from 'react';
import PageHeader from './PageHeader.js';
import { UnstructuredData } from "../domain";
import ChooseMatchModal from "./ChooseMatchModal";


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
            data: '',
            exists: true
        }
    }

    changeHandler = (e) => {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

    submit = (e) => {
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

    delete = (e) => {
        e.preventDefault()
        if (this.state.exists) {
            var request = new XMLHttpRequest()
            console.log(this.state.id)
            request.open('DELETE', `/unstructuredData?id=${this.state.id}`, true)
            request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
            request.send()
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

    handleChosenMatch(chosenMatch) {
        console.log(chosenMatch)
    }

    render() {
        console.log(this.state)
        const { id, matchid, title, author, published, extracted, url, match, data, exists } = this.state
        this.state.id = 1
        this.state.exists = true
		return (
			<div className="page">
				<PageHeader 
					header={"Add Unstructured Data"}
					sidebarVisible={this.props.sidebarVisible}
					handleSidebarClick={this.props.handleSidebarClick}
				/>
                <div id="container" style={{ height: "100vh" }}>
                    <form className="ui form">
                        <div className="inline fields">
                            <div className="one wide field"/>
                            <div className="two wide field">
                                <button className="fluid ui primary button" type="button">
                                    Edit
                                </button>
                            </div>
                            <div className="three wide field"/>
                            <div className="four wide field">
                                <h1>
                                    New Unstructured Data (or a proper header if available)
                                </h1>
                            </div>
                            <div className="three wide field" />
                            <div className="two wide field">
                                <button className="fluid ui primary button" type="button">
                                    Toggle: Edited
                                </button>
                            </div>
                        </div>
                        <div className="inline fields">
                            <div className="one wide field"/>
                            <div className="ten wide field">
                                <label>
                                    Title
                                </label>
                                <input type="text" name="title" value={title} onChange={this.changeHandler} />
                            </div>
                            <div className="four wide field">
                                <label>
                                    Author
                                </label>
                                <input type="text" name="author" value={author} onChange={this.changeHandler} />
                            </div>
                        </div>
                        <div className="inline fields">
                            <div className="one wide field"/>
                            <div className="five wide field">
                                <label>
                                    Published
                                </label>
                                <input type="date" name="published" value={published} onChange={this.changeHandler}/>
                            </div>
                            <div className="five wide field">
                                <label>
                                    Extracted
                                </label>
                                <input type="date" name="extracted" value={extracted} onChange={this.changeHandler}/>
                            </div>
                            <div className="four wide field">
                                <label>
                                    URL
                                </label>
                                <input type="text" name="url" value={url} onChange={this.changeHandler} />
                            </div>
                        </div>
                        <div className="inline fields">
                            <div className="one wide field"/>
                            <div className="five wide field">
                                <div className="ui pointing below label">
                                    Content
                                </div>
                            </div>
                            <div className="seven wide field">
                                <label>
                                    Match
                                </label>
                                <input type="text" name="match" value={match} onChange={this.changeHandler} />
                            </div>
                            <div className="two wide field">
                                <ChooseMatchModal onSelect= { this.handleChosenMatch.bind(this) } ></ChooseMatchModal>
                            </div>
                        </div>
                        <div className="inline fields">
                            <div className="one wide field"/>
                            <div className="fourteen wide field">
                                <textarea name="data" value={data} onChange={this.changeHandler} />
                            </div>
                        </div>
                        <div className="inline fields">
                            <div className="eleven wide field" />
                            <div className="two wide field">
                                <button className="fluid ui red button" type="button" onClick={this.delete} >
                                    Delete
                                </button>
                            </div>
                            <div className="two wide field">
                                <button className="fluid ui primary button" type="button" onClick={this.submit} >
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