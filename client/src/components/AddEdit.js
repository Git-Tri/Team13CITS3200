import React, { Component } from 'react';
import PageHeader from './PageHeader.js';
import { Button, Header, Icon, Modal } from 'semantic-ui-react'
import { Form, Container, Button, Loader, Message} from 'semantic-ui-react'
import ChooseDataModal from "./ChooseDataModal";
import { withRouter } from 'react-router-dom';
import {bindEdit} from "../Databinding";
import {Edit,StructuredData,UnstructuredData} from "../domain";


const replaceTypes = [
	{key:"r",text:"Replace",value:"replace"},
	{key:"rf",text:"Replace Field",value:"replacewithfield"},
	];

export class AddEdit extends Component {

	constructor(props)
	{

		super(props)	

		let id = this.getIdFromQueryParams(this.props.location.search);

		if(props.data !== undefined && (props.data instanceof Edit) === false )
		{

			throw new Error("inputted data must be of type edit");

		}
		
		this.state = {data: props.data,
			queryId:id,
			isNew:id === undefined || id === null,
			isEditable:this.props.editable !== undefined ? this.props.editable : true,
			isBackable:this.getIsBackableFromQueryParams(this.props.location.search) === "true",
			isMissing:false,
			isError:false,
			hasData: props.data !== undefined}	


		if(this.state.isNew)
		{

			this.state.data = new Edit(null,null,null,false,{},"","","")

		}
	}

	genHeaderText()
	{

		if(this.state.isNew)
		{

			return "Create new Edit"

		}
		else
		{

			return "View Edit"

		}


	}

	handleChange(e, { name, value })
	{

		let data = this.state.data; 

		data[name] = value;

		this.setState({ data: data })
	
	}

	handleChecked()
	{

		let data = this.state.data;

		data.isCorpus = ! data.isCorpus

		if(data.isCorpus)
		{

			data.uid = null;

			data.sid = null;

		}

		this.setState({data:data})

	}

	handleChosenData(chosenData)
	{

		let edit = this.state.data;

		if(chosenData instanceof StructuredData)
		{

			edit.structuredDataID = chosenData.id;

		}
		else if(chosenData instanceof UnstructuredData)
		{

			edit.unstructuredDataID = chosenData.id;

		}
		else
		{

			this.setState({isError: true});

		}

		this.setState({data:edit});

		console.log(edit);

	}


	/**
     * Loads all edits and bind the parsed json to edit objects
     */
    loadData()
    {

        fetch("/edit?id=" + this.state.queryId )
			.then(res => 
				{				

					
					if(res.ok)
					{
						
						return res.json()

					}				
					else if(res.status == 404)
					{

						throw new Error(404);

					}
					else 
					{

						throw new Error(500);

					}				
				})
            .then(result => 
                {
					result = bindEdit(result);

					this.setState({data:result,hasData:true,isError:false})
                })
            .catch(err => {

				switch(err.message)
				{

					

					case "404":
						if(! this.state.isMissing)
						{
							
							this.setState({isMissing: true })

						}
						return;

					default: 
						if(! this.state.isError)
						{
							
							this.setState({isError: true})
	
						}
						return;
				}							
				});
	}

	saveData()
	{

		let method = this.state.isNew ? "POST" : "PUT";

		fetch("/edit",
			{method: method,
			body: JSON.stringify(this.state.data),
			headers: {
				'Content-Type': 'application/json'
			}}).then((res) => 
			{

				if(res.ok)
				{

					this.props.history.goBack();

				}
				else
				{
					
					this.setState({isError: true,hasData: false});

				}


			})

	}

	deleteData()
	{

		fetch("/edit?id=" + this.state.data.editID,
			{method: "DELETE",
			headers: {
				'Content-Type': 'application/json'
			}}).then((res) => 
			{

				if(res.ok)
				{

					this.props.history.goBack();

				}
				else
				{
					
					this.setState({isError: true,hasData: false});

				}
			})
	}

    /**
     * loads the data if it is not already loaded
     */
	loadIfNotAlready()
	{

		if(this.state.hasData === false && this.state.isNew === false)
		{
		
			this.loadData();

		}

	}


	getIdFromQueryParams(queryParams)
	{
		return new URLSearchParams(queryParams).get("id");

	}

	getIsBackableFromQueryParams(queryParams)
	{

		return new URLSearchParams(queryParams).get("isbackable");

	}
	genDataSummaryTest()
	{

		let edit = this.state.data;

		if(Number.parseInt(edit.sid) > 0)
		{

			return "Structured Data: " + edit.sid; 

		}
		else if(Number.parseInt(edit.uid) > 0)
		{

			return "Unstructured Data: " + edit.uid;

		}
		else
		{

			return "No Data Selected";

		}

	}

	
	/**
     * renders the page in loading state 
     */
	renderLoaded()
	{

		let isCorpus = this.state.data.isCorpus;

		return(<Container>
			<Form size={"large"} >
				<Form.Group inline>
					<Form.Select 
					placeholder='Choose Type'
					name='type'
					options={replaceTypes}
					value={this.state.data.type}
					label="Type:"
					onChange={this.handleChange.bind(this)}
					/>
					<Form.Checkbox
					name="isCorpus"
					label = "Apply to Entire Corpus"
					checked={this.state.data.isCorpus}
					onChange={this.handleChecked.bind(this)}
					/>
					{isCorpus ? undefined : <div style={{padding:"0px 15px 0px 15px"}}>
						<b> Data:</b>
						<div style={{padding:"0px 0px 0px 5px",float:"right"}}>{this.genDataSummaryTest()} </div>
					</div>}
					{isCorpus ? undefined : <ChooseDataModal onSelect={this.handleChosenData.bind(this)}></ChooseDataModal>}
				</Form.Group>
				<Form.Group inline>
					<Form.Input
					placeholder="text"
					name="replace"
					label="Replace:"
					value={this.state.data.replace}
					onChange={this.handleChange.bind(this)}
					/>
					<Form.Input
					placeholder="text"
					name="replaceWith"
					label="with"
					value={this.state.data.replaceWith}
					onChange={this.handleChange.bind(this)}
					/>
				</Form.Group>
				<Form.Group widths="equal">
					<Button primary onClick={this.saveData.bind(this)}> Save </Button>
					{this.state.isNew ? "" : <Button negative onClick={this.deleteData.bind(this)}> Delete </Button>}
				</Form.Group>					
			</Form>						
		</Container>);

	}

	 /**
     * Renders the page if an error has occured
     */
    renderErrorWithoutData()
    {

        return(  
        <Message negative>
            <Message.Header>An error has occured</Message.Header>
            <p>Failed to get data from the server.</p>
            <Button color="red" onClick={this.loadData.bind(this)}>Try Again?</Button>
          </Message>
          )

	}
	
    renderErrorWithData()
    {

        return(  
        <Message negative>
            <Message.Header>An error has occured</Message.Header>
            <p>Something has gone wrong! Reloading the page may fix the issue</p>
          </Message>
          )

	}

	renderMissing()
	{

		return(  
			<Message warning>
				<Message.Header>We couldn't find what you are looking for </Message.Header>
				<p>404: We tried really hard and couldn't find the data you wanted :(</p>
			  </Message>
			  )

	}
    /**
     * renders the page if the data is still loading 
     */
    renderLoading()
    {

        return("Loading....")

    }
	
	/**
     * Chooses which render that should be rendered based on 
     * state of the object 
     */
    executeRender()
    {

		if((this.state.isNew || this.state.hasData) && this.state.isError )
		{

			return this.renderErrorWithData();

		}
		if(this.state.isMissing)
		{

			return this.renderMissing();

		}
        else if(this.state.isError)
        {

            return this.renderErrorWithoutData();

        }
        else if(this.state.hasData || this.state.isNew)
        {

            return this.renderLoaded();

        }
        else
        {

            return this.renderLoading();

        }

    }

	render() {

		

		this.loadIfNotAlready()

		return (
			<div className="page">
				<PageHeader 
					header={this.genHeaderText()}
					sidebarVisible={this.props.sidebarVisible}
					handleSidebarClick={this.props.handleSidebarClick}
				/>
				<div id="container" style={{height:"100vh"}}>
					{this.executeRender()}
				</div>
			</div>
		);
	}
}


export default withRouter(AddEdit);