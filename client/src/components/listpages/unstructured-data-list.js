import React, { Component } from 'react';
import UnstructuredDataTable from "../tables/unstructured-data-table";
import { bindUnstructureData } from "../../data-binding";
import { withRouter } from 'react-router-dom';
import ListPage from './list-page.js';

class UnstructuredDataList extends ListPage {
    constructor(props) {
        super(props)
        this.state.isLoaded = false;
        this.state.search = "";
        this.state.start = "";
        this.state.end = "";
        this.state.match = "";
        this.state.league = "";
        this.state.headerText = "Unstructured Data List"
        this.state.route = "/UnstructuredDataList"
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
    loadData(data)
    {

        console.log(data)

        data.unstructuredData = data.unstructuredData.map((d) => bindUnstructureData(d));
        
        this.setState({ data: data.unstructuredData, isLoaded: true, isError: false });                
        
    }

    /**
     * takes the user to the add unstructured data page with the id of the selected data
     * @param {any} data - the selected data
     */
    routeToUnstructuredData(data) {
        this.props.history.push("/add_unstructured_data?id=" + data.id + "&isbackable=true")
    }

    renderLoaded()
    {      
    
        return(<div class="inline fields" >
        <div class="one wide field"/>
        <div class="fourteen wide field">
            <UnstructuredDataTable             
                totalPages={this.state.totalPages}
                onPageChange={this.handlePageChange.bind(this)}
                page={this.state.page}
                paging={this.state.paging}                
                items={this.state.data} onSelect={this.routeToUnstructuredData.bind(this)}>
            </UnstructuredDataTable>
        </div>
    </div>)

    }

    renderSearch()
    {

        const { search, start, end, match, league, data } = this.state

        return(<div id="container">
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

export default withRouter(UnstructuredDataList);
