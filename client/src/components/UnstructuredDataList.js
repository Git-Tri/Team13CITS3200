import React, { Component } from 'react';
import PageHeader from './PageHeader.js';
import UnstructuredDataTable from "./UnstructuredDataTable";
import { UnstructuredData } from "../domain";
import { bindUnstructureData } from "../Databinding";
import { withRouter } from 'react-router-dom';

class UnstructuredDataList extends Component {
    constructor(props) {
        super(props)
        this.isLoaded = false;
        this.state = {
            search: '',
            start: '',
            end: '',
            match: '',
            league: '',
            data: []
        }
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
    load = () => {
        var request = new XMLHttpRequest()
        request.open('GET', '/allChooseableData', true)
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
        request.send()
        request.onload = () => {
            if (request.status != 200) {
                alert(`Error ${request.status}: ${request.statusText}`)
            }
            else {
                let data = JSON.parse(request.responseText)
                console.log(data)
                data.unstructuredData = data.unstructuredData.map((d) => bindUnstructureData(d));
                
                this.setState({ data: data.unstructuredData });
                
            }
        }
        request.onerror = function () {
            alert("Load failed")
        }
    }

    /**
     * takes the user to the add unstructured data page with the id of the selected data
     * @param {any} data - the selected data
     */
    routeToUnstructuredData(data) {
        this.props.history.push("/add_unstructured_data?id=" + data.id + "&isbackable=true")
    }

    /**
     * renders the page
     */
    render() {
        if (!this.isLoaded) {
            this.load()
            this.isLoaded = true;
        }
        const { search, start, end, match, league, data } = this.state
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
				<div id="container" style={{height:"100vh"}}>
                    <form class="ui form">
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
                                <input type="date" name="start" value={start} onchange={this.changeHandler}/>
                                <input type="date" name="end" value={end} onchange={this.changeHandler}/>
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
                                <UnstructuredDataTable items={this.state.data} onSelect={this.routeToUnstructuredData.bind(this)}>
                                </UnstructuredDataTable>
                            </div>
                        </div>
                    </form>
				</div>
			</div>
		);
	}
}

export default withRouter(UnstructuredDataList);
