import React, { Component } from 'react';
import PageHeader from './page-header.js';
import { Button, Loader, Message, Segment, Container, TextArea,Form} from 'semantic-ui-react';
import {ImportRequest} from "../domain";
class Export extends Component {

	constructor(props)
    {
        
		super(props)
		
		let types = ["json","xml"];

		let names = ["JSON","XML"];

		this.state = {items:this.genDropDownItems(types,names),
			type:"json",
			isLoaded: true,
			isError: false,
			request: new ImportRequest(),
			isExported: false,
			export: undefined,
			exportedType: undefined }


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

		this.setState({isLoaded: false, isExported: false,exportedType: this.state.type});

	
		fetch("/export?type=" + this.state.type)
			.then((b) => 
			{
				if(b.status === 401)
                {

                    window.location.href = "/login-form"                    

                }

				
				return b.blob()
			
			})            
            .then(result => 
                {
					// 2. Create blob link to download
					const url = window.URL.createObjectURL(result);
					const link = document.createElement('a');
					link.href = url;
					link.setAttribute('download', "corpus." + this.state.type);
					// 3. Append to html page
					document.body.appendChild(link);
					// 4. Force download
					link.click();
					// 5. Clean up and remove the link
					link.parentNode.removeChild(link);

					let data = result

					this.setState({export:data,isLoaded: true, isError: false,isExported: true})
                })
            .catch(err => console.log(err));

    }


	handleChange(e, { name, value })
	{

		this.setState({ type: value});		

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


	render() {

		return (
			<div className="page">
				<PageHeader 
					header={"Import Structured Data"}
					sidebarVisible={this.props.sidebarVisible}
					handleSidebarClick={this.props.handleSidebarClick}
				/>
				<div id="container" style={{minHeight:"100vh"}}>
					<br/>
					<Container>
						<Form loading={! this.state.isLoaded}>
							<Form.Group inline>
								<Form.Select
								label="Export Type"
								name="compId"
								options={this.state.items}
								onChange={this.handleChange.bind(this)}
								value={this.state.type}
								/>
							</Form.Group>
							<Button primary onClick={this.loadData.bind(this)}>Export</Button>
						</Form>						
						{this.renderErrorMessage()}
					</Container>
				</div>
			</div>
		);
	}
}

export default Export;