import React, { Component } from 'react';
import PageHeader from './PageHeader.js';
import { UnstructuredData } from "../domain";
import ChooseMatchModal from "./ChooseMatchModal";


class AddUnstructuredData extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: null,
            matchid: '',
            title: 'New unstructured data',
            author: '',
            published: '',
            extracted: '',
            url: '',
            match: '',
            data: '',
            exists: false
        }
    }

    /**
    * deals with filling out inputs in the form
    * @param e - the event that caused the change
    **/
    changeHandler = (e) => {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

    /**
     * loosely validates inputs
     * @param {any} data the data collected by the form which will be sent if it passes validation
     */
    valid(data) {
        if (data.title === '') {
            alert('title is required')
            return false
        }
        if (data.author === '') {
            alert('author is required')
            return false
        }
        return true
    }

    /**
    * deals with submission of the form
    * @param e - the event that caused the submission
    **/
    submit = (e) => {
        e.preventDefault()
        var toSend = new UnstructuredData(this.state.id, this.state.matchid, this.state.title, this.state.author, this.state.url, this.state.published, this.state.extracted, this.state.data)
        if (!this.valid(toSend)) {
            return
        }
        console.log(toSend)
        var request = new XMLHttpRequest()
        if (!this.state.exists) {
            request.open('POST', '/unstructuredData', true)
            request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
            request.send(JSON.stringify(toSend))
        }
        else {
            request.open('PUT', '/unstructuredData', true)
            request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
            request.send(JSON.stringify(toSend))
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

    /**
    * deals with deleting the data
    * @param e - the event that caused the delete
    **/
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
            alert("Can't delete an entry that doesn't exist")
        }
    }

    /**
     * deals with the match chosen by the choose match modal
     * @param {any} chosenMatch - the chosen match
     */
    handleChosenMatch(chosenMatch) {
        console.log(chosenMatch)
        this.setState({
            matchid: chosenMatch.id,
            match: `${chosenMatch.home} vs ${chosenMatch.away}`,
            exists: true
        })
    }

    /**
     * renders the page
     */
    render() {
        const { id, matchid, title, author, published, extracted, url, match, data, exists } = this.state
		return (
			<div className="page">
				<PageHeader 
					header={"Add Unstructured Data"}
					sidebarVisible={this.props.sidebarVisible}
					handleSidebarClick={this.props.handleSidebarClick}
				/>
                <div id="container" style={{ height: "100vh" }}>
                    <form className="ui form" id="dataform">
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
                                    {title}
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
                            <div className="required ten wide field">
                                <label>
                                    Title
                                </label>
                                <input type="text" name="title" value={title} onChange={this.changeHandler} />
                            </div>
                            <div className="required four wide field">
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
                                    Match:
                                </label>
                                <label>
                                    {match} 
                                </label>
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