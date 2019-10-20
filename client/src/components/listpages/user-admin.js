import React, { Component } from 'react';
import UserTable from "../tables/user-table";
import { bindUser } from "../../data-binding";
import { withRouter } from 'react-router-dom';
import ListPage from './list-page.js';
import { Message, Container } from 'semantic-ui-react'
import { SearchRequest } from "../../domain"

class UserAdmin extends ListPage {
    constructor(props) {
        super(props)
        this.state.isLoaded = false;
        this.state.search = "";
        this.state.uname = "";
        this.state.code = "";
        this.state.isAdmin = false;
        this.state.headerText = "User Admin";
        this.state.route = "/getusers";
        this.state.message = '';
        this.state.hasMessage = false;
    }

    /**
    * deals with filling out inputs in the form
    * @param e - the event that caused the change
    **/
    changeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value })
        if (e.target.name === "search") {
            this.handleSearchChange(e.target.name, new SearchRequest("text", e.target.value, "username"))
        }
    }

    /**
    * loads all the unstructured data into the list
    **/
    loadData(data) {

        data.users = data.users.map((d) => bindUser(d));

        this.setState({ data: data.users, isLoaded: true, isError: false });

    }

    /**
     * adds a new user
     */
    addUser() {
        if (this.state.uname.length < 8 || this.state.code.length < 8 || this.state.uname.length > 50 || this.state.code.length > 50) {
            this.setState({
                message: 'Username and code must be between 8 and 50 characters.',
                hasMessage: true
            })
            return
        }
        var admin = 0
        if (this.state.isAdmin) {
            admin = 1
        }
        var toSend = `{"username" : "${this.state.uname}", "regkey" : "${this.state.code}", "admin" : ${admin}}`
        var request = new XMLHttpRequest()
        request.open("POST", "/createuser", true)
        request.setRequestHeader('Content-Type', 'application/json')
        request.send(toSend)
        request.onload = function () {
            if (request.status != 200) {
                let theMessage = 'Error performing action.'
                if (request.status === 418) {
                    theMessage = 'That username already exists.'
                }
                this.setState({
                    message: theMessage,
                    hasMessage: true
                })
            }
            else {
                this.search()
                this.setState({
                    hasMessage: false,
                    uname: '',
                    code: ''
                })
            }
        }.bind(this)
        request.onerror = function () {
            this.setState({
                message: 'Error performing action.',
                hasMessage: true
            })
        }.bind(this)
    }

    /**
     * deals with the is admin checkbox
     */
    adminCheck() {
        this.setState({ isAdmin: !this.state.isAdmin })
    }

    /**
     * deletes, promotes or demotes a user
     * @param {any} str - first character defines the action, rest is the username to be applied to
     */
    action(str) {
        var username = str.substring(1)
        var method = "DELETE"
        var endpoint = "/removeuser"
        if (str[0] !== 'r') {
            method = "PUT"
            if (str[0] === 'p') {
                endpoint = "/promoteuser"
            }
            else {
                endpoint = "/demoteuser"
            }
        }
        var request = new XMLHttpRequest()
        request.open(method, endpoint + `?username=${username}`, true)
        request.setRequestHeader('Content-Type', 'application/json')
        request.send()
        request.onload = function () {
            if (request.status != 200) {
                this.setState({
                    message: 'Error performing action.',
                    hasMessage: true
                })
            }
            else {
                this.search()
            }
        }.bind(this)
        request.onerror = function () {
            this.setState({
                message: 'Error performing action.',
                hasMessage: true
            })
        }.bind(this)
    }

    renderLoaded() {

        return (<div class="inline fields" >
            <div class="one wide field" />
            <div class="fourteen wide field">
                <UserTable
                    totalPages={this.state.totalPages}
                    onPageChange={this.handlePageChange.bind(this)}
                    page={this.state.page}
                    paging={this.state.paging}
                    items={this.state.data}
                    onSelect={this.action.bind(this)}>
                </UserTable>
            </div>
        </div>)

    }

    renderSearch() {

        const { search, uname, code, isAdmin, message, hasMessage } = this.state

        return (<div id="container">
            <form class="ui form">
                <div class="inline fields">
                    <div class="one wide field" />
                    <div class="five wide field">
                        <label>
                            Username
                        </label>
                        <input type="text" name="uname" value={uname} onChange={this.changeHandler} />
                    </div>
                    <div class="four wide field">
                        <label>
                            Code
                        </label>
                        <input type="text" name="code" value={code} onChange={this.changeHandler} />
                    </div>
                    <div class="two wide field">
                        <div class="ui checkbox">
                            <input type="checkbox" name="example" onChange={this.adminCheck.bind(this)} />
                                <label>Is Admin</label>
                        </div>
                    </div>
                    <div class="three wide field">
                        <button className="fluid ui positive button" type="button" onClick={this.addUser.bind(this)}>
                            Add User
                        </button>
                    </div>
                </div>
                <div class="inline fields">
                    <div class="one wide field" />
                    <div class="fourteen wide field">
                        {hasMessage ? <Message negative> {message} </Message> : undefined}
                    </div>
                    <div class="one wide field" />
                </div>
                <div class="inline fields">
                    <div class="one wide field" />
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
            </form>
        </div>)

    }

}

export default withRouter(UserAdmin);
