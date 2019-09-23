import React, { Component } from 'react';
import PageHeader from '../page-header.js';
import { Button, Loader, Message, Container} from 'semantic-ui-react';


export class ListPage extends Component {

	constructor(props)
	{

		super(props)

		this.state = {data: [],target:[], isLoaded: false, isError: false}

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
     * loads the data if it is not already loaded
     */
	loadIfNotAlready()
	{

		if(this.state.isLoaded === false)
		{

            if(this.loadData === undefined)
            {

                throw new Error("Load data must be defined by child component")

            }

			this.loadData();

		}


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

		this.props.history.push("/add_edit?id=" + edit.editID + "&isbackable=true");
		
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

        if(this.renderLoaded === undefined)
        {

            throw new Error("Renderloaded must be defined in child component")

        }

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
				header={this.state.headerText != undefined ? this.state.headerText : "List Page"}
				sidebarVisible={this.props.sidebarVisible}
				handleSidebarClick={this.props.handleSidebarClick}
			/>           
			<Container>
            {this.renderSearch !== undefined ? this.renderSearch() : undefined}
			<br/>
			<div id="container" style={{minHeight:"100vh"}}>
				{this.executeRender()}
			</div>
            </Container>	
		</div>)
		
	}
}

export default ListPage;