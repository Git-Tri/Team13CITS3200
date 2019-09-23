import React, { Component } from 'react';
import EditListTable from "../tables/edit-list-table";
import {bindEdit, bindUnstructureData, bindStructuredData} from "../../data-binding";
import { withRouter } from 'react-router-dom';
import ListPage from "./list-page"

export class EditList extends ListPage {

	constructor(props)
	{

		super(props)
        
        this.state.headerText = "Edit List"

	}

     /**
     * Handles any errors cuased by a sub-component 
     * @param {*} error the error recieved
     * @param {*} errorInfo information about the error
     */
    componentDidCatch(error, errorInfo)
    {

        this.setState({isError: true});

    }


	/**
     * Loads all edits and bind the parsed json to edit objects
     */
    loadData()
    {

        console.log("error")

        fetch("/editList")
            .then(res => res.json())
            .then(result => 
                {

					let editList = result.editList.map((d) => bindEdit(d));

                    let unstructuredData = result.unstructuredData.map((u) => bindUnstructureData(u))

                    let structuredData = result.structuredData.map((u) => bindStructuredData(u)); 

                    let allData = structuredData.concat(unstructuredData);

                    let target = [];

                    editList.forEach((e,index) => target[index] = allData
                            .find((i) => i.id === e.structuredDataID || i.id === e.unstructuredDataID))

					this.setState({data:editList,isLoaded: true, isError: false,target: target})
                })
            .catch(err => this.setState({isError: true}));

    }


    /**
     * renders the page in loading state 
     */
	renderLoaded()
	{

        console.log(this.state)

		return (
				<div>
					<p> A list of all edits. Click on an edit to view it in detail </p>				
					<div id="container" style={{height:"100vh"}}>
						<EditListTable onSelect={this.routeToEdit.bind(this)} items={{edits:this.state.data,targets:this.state.target}}/>
					</div>
				</div>
		);

	}


    /**
     * navigates to an edit page with parameters given by inputted edit
     * @param {*} edit the edit inputted 
     */
	routeToEdit(edit)
	{

		this.props.history.push("/add_edit?id=" + edit.editID + "&isbackable=true");
		
	}

}

export default withRouter(EditList);