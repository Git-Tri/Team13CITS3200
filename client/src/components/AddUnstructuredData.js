import React, { Component } from 'react';
import { Message, Container } from 'semantic-ui-react'
import PageHeader from './PageHeader.js';
import { UnstructuredData } from "../domain";
import ChooseMatchModal from "./ChooseMatchModal";
import { withRouter } from "react-router-dom";


class AddUnstructuredData extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: new URLSearchParams(props.location.search).get("id"),
            matchid: '',
            title: 'New unstructured data',
            author: '',
            published: '',
            extracted: '',
            url: '',
            match: '',
            data: '',
            exists: false,
            message: '',
            hasMessage: false
        }

        if (this.state.id !== null) {
            this.load()
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
     * loads the data with id passed into the page if one exists
     */
    load() {
        fetch("unstructuredData?id=" + this.state.id)
            .then(res => res.json())
            .then(result => {
                console.log(result)
                if (result.unstructuredData.extracted !== null) {
                    var split = result.unstructuredData.extracted.split('-')
                    var ext = `${split[0]}-${split[1]}-${parseInt(split[2])}`
                    if (parseInt(split[2]) < 10) {
                        ext = ext.slice(0, -1) + '0' + parseInt(split[2])
                    }
                }
                if (result.unstructuredData.published !== null) {
                    split = result.unstructuredData.published.split('-')
                    var pub = `${split[0]}-${split[1]}-${parseInt(split[2])}`
                    if (parseInt(split[2]) < 10) {
                        pub = pub.slice(0, -1) + '0' + parseInt(split[2])
                    }
                }
                console.log(ext + ' ' + pub)
                this.setState({
                    exists: true,
                    matchid: result.match.id,
                    match: `${result.match.home} vs ${result.match.away}`,
                    author: result.unstructuredData.author,
                    title: result.unstructuredData.title,
                    url: result.unstructuredData.url,
                    data: result.unstructuredData.data,
                    extracted: ext,
                    published: pub
                })
            })
            .catch(err => {
                console.log('error loading' + err)
            })
              
    }

    /**
    * deals with submission of the form
    * @param e - the event that caused the submission
    **/
    submit = (e) => {
        e.preventDefault()
        console.log(this.state.published)
        var split = this.state.published.split('-')
        var pub = new Date(split[0], split[1]-1, split[2], 0, 0, 0)
        split = this.state.extracted.split('-')
        var ext = new Date(split[0], split[1]-1, split[2], 0, 0, 0)
        var toSend = new UnstructuredData(this.state.id, this.state.matchid, this.state.title, this.state.author, this.state.url, pub, ext, this.state.data)
        if (!this.valid(toSend)) {
            return
        }
        console.log(toSend)
        var request = new XMLHttpRequest()
        var method = 'PUT'
        var idtext = `?id=${this.state.id}`
        if (!this.state.exists) {
            method = 'POST'
            idtext = ''
        }
        request.open(method, '/unstructuredData' + idtext, true)
        request.setRequestHeader('Content-Type', 'application/json')
        request.send(JSON.stringify(toSend))
        request.onload = function () {
            if (request.status != 200) {
                this.setState({ message: `Error ${request.status}: ${request.statusText}`, hasMessage: true })
            }
            else {
                this.props.history.goBack()
            }
        }.bind(this)
        request.onerror = function () {
            this.setState({ message: 'save failed', hasMessage: true })
        }.bind(this)
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
            request.setRequestHeader('Content-Type', 'application/json')
            request.send()
            request.onload = function () {
                if (request.status != 200) {
                    this.setState({ message: `Error ${request.status}: ${request.statusText}`, hasMessage: true })
                }
                else {
                    this.props.history.goBack();
                }
            }.bind(this)
            request.onerror = function () {
                this.setState({ message: 'delete failed', hasMessage: true })
            }.bind(this)
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
        })
    }

    /**
     * renders the page
     */
    render() {
        const { id, matchid, title, author, published, extracted, url, match, data, exists, message, hasMessage } = this.state
		return (
			<div className="page">
				<PageHeader 
					header={title}
					sidebarVisible={this.props.sidebarVisible}
					handleSidebarClick={this.props.handleSidebarClick}
				/>
                <Container>
                <div id="container" style={{ height: "100vh" }}>
                    <form className="ui form">
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
                            <div className="one wide field" />
                            <div className="two wide field">
                                <button className="fluid ui primary button" type="button">
                                    Toggle: edited
                                </button>
                            </div>
                            <div className="eight wide field">
                                {hasMessage ? <Message negative> {message} </Message> : undefined}
                            </div>
                            <div className="two wide field">
                                {!this.state.exists ? "" : <button className="fluid ui red button" type="button" onClick={this.delete.bind(this)} >
                                    Delete
                                </button>}
                            </div>
                            <div className="two wide field">
                                <button className="fluid ui primary button" type="button" onClick={this.submit.bind(this)} >
                                    Save
                                </button>
                            </div>
                        </div>
                    </form>
				</div>
                </Container>
			</div>
		);
	}
}

export default withRouter(AddUnstructuredData);