import React, { Component } from 'react';
import UserTable from "../tables/user-table";
import { bindUser } from "../../data-binding";
import { withRouter } from 'react-router-dom';
import ListPage from './list-page.js';
import { Message, Container } from 'semantic-ui-react'

class UserAdmin extends ListPage {
    constructor(props) {
        super(props)
        this.state.isLoaded = false;
        this.state.search = "";
        this.state.username = "";
        this.state.code = "";
        this.state.isAdmin = false;
        this.state.headerText = "User Admin"
        this.state.route = "/getusers"
    }

    /**
    * deals with filling out inputs in the form
    * @param e - the event that caused the change
    **/
    changeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    /**
    * loads all the unstructured data into the list
    **/
    loadData(data) {

        console.log(data)

        data.user = data.user.map((d) => bindUser(d));

        this.setState({ data: data.user, isLoaded: true, isError: false });

    }

    /**
     * adds a new user
     */
    addUser() {
        var admin = "false"
        if (this.state.isAdmin) {
            admin = "true"
        }
        var toSend = `{"username" : "${this.state.username}", "regkey" : "${this.state.code}", "admin" : "${admin}"}`
        console.log(toSend)
        var request = new XMLHttpRequest()
        request.open("POST", "/createuser", true)
        request.setRequestHeader('Content-Type', 'application/json')
        request.send(toSend)
        request.onload = function () {
            if (request.status != 200) {
                alert("boutta head out")
            }
            else {
                if (this.state.exists) {
                    console.log(request.statusText)
                }
            }
        }.bind(this)
        request.onerror = function () {
            alert("boutta head in")
        }.bind(this)
    }

    /**
     * deals with the is admin checkbox
     */
    adminCheck() {
        this.setState({ isAdmin: !this.state.isAdmin })
    }

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
                alert("boutta head out")
            }
            else {
                if (this.state.exists) {
                    console.log(request.statusText)
                }
            }
        }.bind(this)
        request.onerror = function () {
            alert("boutta head in")
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

        const { search, username, code, isAdmin } = this.state

        return (<div id="container">
            <form class="ui form">
                <div class="inline fields">
                    <div class="one wide field" />
                    <div class="five wide field">
                        <label>
                            Username
                        </label>
                        <input type="text" name="username" value={username} onchange={this.changeHandler} />
                    </div>
                    <div class="four wide field">
                        <label>
                            Code
                        </label>
                        <input type="text" name="code" value={code} onChange={this.changeHandler} />
                    </div>
                    <div class="two wide field">
                        <div class="ui checkbox">
                            <input type="checkbox" name="example"/>
                                <label>Is Admin</label>
                        </div>
                    </div>
                    <div class="three wide field">
                        <button className="fluid ui positive button" type="button">
                            Add User
                        </button>
                    </div>
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

    /**
     * renders the page
     
    render() {
        if (!this.state.isLoaded) {
            this.load()
            this.state.isLoaded = true;
        }
        
        var test = [
            new UnstructuredData(1, 1, "some title", "some author", "some url", new Date("1991-04-20T00:00:00.000Z"), new Date("1991-04-20T00:00:00.000Z"), "some data"),
            new UnstructuredData(2, 1, "some title really really really really really long title", "some author", "some url", new Date("1991-04-20T00:00:00.000Z"), new Date("1991-04-20T00:00:00.000Z"), "some data"),
        ];
		return (
			<div className="page">
				<PageHeader 
					header={"Unstructured Data List"}
					sidebarVisible={this.props.sidebarVisible}
					handleSidebarClick={this.props.handleSidebarClick}
				/>
                <Container>
				
                </Container>
			</div>
		);
    }
    */
}

export default withRouter(UserAdmin);
