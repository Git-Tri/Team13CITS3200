import React, { Component } from 'react';
import PageHeader from './page-header.js';
import { Button, Loader, Message, Segment, Container, TextArea,Form} from 'semantic-ui-react';
import {bindCompetition} from "../data-binding"
import {ImportRequest} from "../domain";

class ImportStructuredData extends Component {

	constructor(props)
    {
        
        super(props)

        this.state = {items: [],isSaving: false, isLoaded: false,isImportSuccessful: false, isError: false, request: new ImportRequest() }


    }

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
     * Loads all edits and bind the parsed json to edit objects
     */
    loadData()
    {

        fetch("/competitions")
            .then(res => res.json())
            .then(result => 
                {

                    let data = result.map(r => bindCompetition(r));
					
					let values = data.map(c => c.id);

					let names = data.map(c => c.name);					

					this.setState({items:this.genDropDownItems(values,names),isLoaded: true, isError: false})
                })
            .catch(err => this.setState({isError: true}));

    }

	loadIfNotAlready()
	{

		if(this.state.isLoaded === false)
		{

			this.loadData();

		}


	}

	handleChange(e, { name, value })
	{

		let request = this.state.request; 

		if(name === "begin" || name === "end")
		{

			let dateParts = value.split("-")

			value = new Date(dateParts[0],Number.parseInt(dateParts[1])-1,dateParts[2],0,0,0,0);

		}

		request[name] = value;

		console.log(request)

		this.setState({ request: request});		

	}

	saveData()
	{

			this.setState({isSaving: true})

			fetch("/importdata",
			{method: "POST",
			body: JSON.stringify(this.state.request),
			headers: {
				'Content-Type': 'application/json'
			}}).then((res) => 
			{

				console.log(res)

				if(res.ok)
				{

					console.log("lol?")

					this.setState({isSaving: false, isError: false,isImportSuccessful: true},() => console.log(this.state))
					
				}
				else
				{
					
					this.setState({isError: true});

				}
			})



	}

	renderErrorMessage()
	{

		if(this.state.isError)
		{

			return(  
				<Message negative>
					<Message.Header>An error has occured</Message.Header>
					<p>Something has gone wrong! Reloading the page may fix the issue</p>
				  </Message>
				  )

		}

	}

	renderSuccessMessage()
	{

		console.log("message")

		if(this.state.isImportSuccessful)
		{

			console.log("message")

			return(<Message positive>
				<Message.Header>Successfully imported data into the corpus!</Message.Header>
		   </Message>)

		}

	}

	render() {

		this.loadIfNotAlready();
		return (
			<div className="page">
				<PageHeader 
					header={"Import Structured Data"}
					sidebarVisible={this.props.sidebarVisible}
					handleSidebarClick={this.props.handleSidebarClick}
				/>
				<div id="container" style={{height:"100vh"}}>
					<br/>
					<Container>
						<Form loading={! this.state.isLoaded || this.state.isSaving}>
							<Form.Group inline>
								<Form.Input
								placeholder="dd/mm/yyyy"
								name="begin"
								label="Begin:"
								type="date"
								onChange={this.handleChange.bind(this)}
								/>
								<Form.Input
								placeholder="dd/mm/yyyy"
								name="end"
								label="End:"
								type="date"
								onChange={this.handleChange.bind(this)}
								/>
								<Form.Select
								label="Competition"
								name="compId"
								options={this.state.items}
								onChange={this.handleChange.bind(this)}
								/>
							</Form.Group>
							<Button primary onClick={this.saveData.bind(this)}>Import</Button>
						</Form>
						{this.renderSuccessMessage()}
						{this.renderErrorMessage()}
					</Container>
				</div>
			</div>
		);
	}
}

export default ImportStructuredData;