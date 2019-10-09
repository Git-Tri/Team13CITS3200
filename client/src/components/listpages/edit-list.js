import React, { Component } from 'react';
import EditListTable from "../tables/edit-list-table";
import {bindEdit, bindUnstructureData, bindStructuredData} from "../../data-binding";
import { withRouter } from 'react-router-dom';
import ListPage from "./list-page"
import {Form, Container} from 'semantic-ui-react';
import {EDIT_TYPES,EDIT_NAMES} from "../../constants";
import DataPair from "../data-pair";
import ChooseDataModal from "../choose-data-modal";
import {SearchRequest} from "../../domain"
import {genSummary} from "../../edit-utils";
import {StructuredData,UnstructuredData} from "../../domain";

export class EditList extends ListPage {

	constructor(props)
	{

		super(props)
        
        this.state.headerText = "Edit List"
        this.state.route = "editList"
        this.state.replaceTypes = this.genDropDownItems(EDIT_TYPES,EDIT_NAMES)
        this.state.isCorpusSearchChecked = undefined; 
        this.state.corpusChoices = this.genDropDownItems([true,false],["yes","no"])
        this.state.searchTarget = undefined;
        this.state.unstructuredDataSearches = {};
        this.state.structuredDataSearches ={};

	}

    /**
     * creates the body of a request with three different categories of searches 
     */
    genBody()
    {

        return{editSearches:Object.values(this.state.searches),
                unstructuredDataSearches:Object.values(this.state.unstructuredDataSearches),
                structuredDataSearches:Object.values(this.state.structuredDataSearches) }


    }

    /**
     * creates a text searches on the edit and it's target
     * @param {*} e not used
     * @param {*} param1 the name and value of the search
     */
    handleTextSearchChange(e,{name,value})
    {

        this.state.unstructuredDataSearches[name] = new SearchRequest("text",value,["author","title"]);

        this.state.structuredDataSearches[name] = new SearchRequest("text",value,["competitionName","home","away"])

        this.handleSearchChange(name,new SearchRequest("text",value,["replace","replaceWith","type"]));

    }

    
	/**
	 * Generates summary text of the target of the edit 
	 */
	genDataSummaryText()
	{	

        let target = this.state.searchTarget;

        let summary = genSummary(target)

		return summary === "Entire Corpus" ? "No Data Selected" : summary

	}


    /**
	 * Generates drop down list items from a list of items (values) and names
	 * @param {*} items the values to be stored in the object
	 * @param {*} names the name of the field 
	 */
	genDropDownItems(items,names)
	{

		return items.map((item,index) => 
		{

			//taken from https://stackoverflow.com/questions/7225407/convert-camelcasetext-to-sentence-case-text
			let text = names !== undefined ? names[index] : item.replace(/([a-z])([A-Z][a-z])/g, "$1 $2").charAt(0).toUpperCase()+item.slice(1).replace(/([a-z])([A-Z][a-z])/g, "$1 $2");

			return {key:item,text:text,value:item};

		})

    }
    

    /**
     * handle chosen data by creating a search for that specific piece of data 
     * @param {*} chosenData 
     */
    handleChosenData(chosenData)
    {

        this.setState({isCorpusSearchChecked:false,searchTarget:chosenData})

        if(chosenData instanceof StructuredData)
		{

			this.handleSearchChange("target",new SearchRequest("exact",chosenData.id,"structuredDataID"));

		}
		else if(chosenData instanceof UnstructuredData)
		{

			this.handleSearchChange("target",new SearchRequest("exact",chosenData.id,"unstructuredDataID"))

		}
		else
		{

			this.setState({isError: true});

		}

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
    loadData(result)
    {

        let editList = result.editList.map((d) => bindEdit(d));

        let unstructuredData = result.unstructuredData.map((u) => bindUnstructureData(u))

        let structuredData = result.structuredData.map((u) => bindStructuredData(u)); 

        let allData = structuredData.concat(unstructuredData);

        let target = [];

        editList.forEach((e,index) => target[index] = allData
                .find((i) => i.id === e.structuredDataID || i.id === e.unstructuredDataID))

        this.setState({data:editList,isLoaded: true, isError: false,target: target})               
            
    }

    /**
     * renders the search component on the list page 
     */
    renderSearch()
    {

        return(
            <div>
                    
                
                    <Form.Input
                    placeholder="search"
                    name="search"
                    icon="search"
                    onChange={this.handleTextSearchChange.bind(this)}
                    />
                    <Form.Group inline>
                        <Form.Select 
                        clearable
                        placeholder='Search by Type'
                        name='type'
                        options={this.state.replaceTypes}
                        label="Type:"                        
                        onChange={(e,{name,value}) => 
                            this.handleSearchChange(name,new SearchRequest("exact",value,"type"))}
                        />
                        <Form.Select 
                        clearable
                        placeholder='yes/no'
                        name='isCorpus'
                        options={this.state.corpusChoices}
                        label="Entire Corpus:"
                        value={this.state.isCorpusSearchChecked}
                        onChange={(e,{name,value}) => 
                        {
                            this.setState({isCorpusSearchChecked:value},() => 
                            this.handleSearchChange(name,
                                new SearchRequest("exact",value,"isCorpus")));                            
                        }}                        
                        />
                        {this.state.isCorpusSearchChecked ? true : <DataPair label="Data" text={this.genDataSummaryText()}/>}
					    {this.state.isCorpusSearchChecked ? true : <ChooseDataModal onSelect={this.handleChosenData.bind(this)}></ChooseDataModal>}
                    </Form.Group>
            </div>
        
                        
        )


        

    }


    /**
     * renders the page in loading state 
     */
	renderLoaded()
	{



		return (
				<div>
					<p> A list of all edits. Click on an edit to view it in detail </p>				
					<div id="container">
                        <EditListTable 
                            totalPages={this.state.totalPages}
                            onPageChange={this.handlePageChange.bind(this)}
                            page={this.state.page}
                            paging={this.state.paging}                        
                            onSelect={this.routeToEdit.bind(this)} 
                            items={{edits:this.state.data,targets:this.state.target}}/>
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