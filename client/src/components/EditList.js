import React, { Component } from 'react';
import PageHeader from './PageHeader.js';
import EditListTable from "./EditListTable";
import {bindEdit} from "../Databinding";
import { Button, Loader, Message} from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

export class EditList extends Component {

	constructor(props)
	{

		super(props)

		this.state = {data: undefined, isLoaded: false, isError: false}

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

        fetch("/editList")
            .then(res => res.json())
            .then(result => 
                {

					result.editList = result.editList.map((d) => bindEdit(d));
					
					let edits = result.editList

					this.setState({data:edits,isLoaded: true, isError: false})
                })
            .catch(err => this.setState({isError: true}));

    }

    /**
     * loads the data if it is not already loaded
     */
	loadIfNotAlready()
	{

		if(this.state.isLoaded === false)
		{

			this.loadData();

		}


	}

    /**
     * renders the page in loading state 
     */
	renderLoaded()
	{

		return (
				<div>
					<p> A list of all edits. Click on an edit to view it in detail </p>				
					<div id="container" style={{height:"100vh"}}>
						<EditListTable onSelect={this.routeToEdit.bind(this)} items={this.state.data}/>
					</div>
				</div>
		);

	}

	 /**
     * Renders the page if an error has occured
     */
    renderError()
    {

        return(  
        <Message negative>
            <Message.Header>An error has occured</Message.Header>
            <p>Failed to get data from the server.</p>
            <Button color="red" onClick={this.loadData.bind(this)}>Try Again?</Button>
          </Message>
          )

    }

    /**
     * navigates to an edit page with parameters given by inputted edit
     * @param {*} edit the edit inputted 
     */
	routeToEdit(edit)
	{

		this.props.history.push("/add_edit?id=" + edit.editID + "&isBack=true");
		
	}

    /**
     * renders the page if the data is still loading 
     */
    renderLoading()
    {

        return(<Loader>Loading Data</Loader>)

    }
    
    /**
     * Chooses which render that should be rendered based on 
     * state of the object 
     */
    executeRender()
    {

        if(this.state.isError)
        {

            return this.renderError();

        }
        else if(this.state.isLoaded)
        {

            return this.renderLoaded();

        }
        else
        {

            return this.renderLoading();

        }

    }

	

    /**
     * renders the page 
     */
	render() {

		this.loadIfNotAlready();

		return (<div className="page">
			<PageHeader 
				header={"Edit List"}
				sidebarVisible={this.props.sidebarVisible}
				handleSidebarClick={this.props.handleSidebarClick}
			/>
			<br/>
							
			<div id="container" style={{height:"100vh"}}>
				{this.executeRender()}
			</div>
		</div>)
		
	}
}

export default withRouter(EditList);