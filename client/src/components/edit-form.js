import React, { Component } from 'react';
import { Form, Container, Button, Message} from 'semantic-ui-react'
import ChooseDataModal from "./choose-data-modal";
import {bindEdit,bindStructuredData,bindUnstructureData} from "../data-binding";
import {Edit,StructuredData,UnstructuredData} from "../domain";
import {STRUCTURED_DATA_FIELDS,EDIT_TYPES,EDIT_NAMES} from "../constants"
import DataPair from "./data-pair";
import { withRouter } from 'react-router-dom';
import {genSummary} from "../edit-utils";

/**
 * An edit form which for creating and editing edits
 */
export class EditForm extends Component {

	/**
	 * Creates a new edit form
	 * @param {*} props id if passed in must be a number, data may be passed and should be
	 * an instance of edit 
	 */
	constructor(props)
	{

		super(props)	

		let id = Number.parseInt(props.id)
	
		if(this.props.id !== undefined && this.props.id !== null && Number.isInteger(id) === false)
		{

			throw new Error("Id must be a number");

		}

		if(props.data !== undefined && (props.data instanceof Edit) === false )
		{

			throw new Error("inputted data must be of type edit");

		}
		
		this.state = {data: props.data,
			target: props.target,
			queryId:id,
			isNew:(this.props.id === undefined || this.props.id === null) && props.data === undefined,
			isMissing:false,
			isError:false,
			hasData: props.data !== undefined,
			isSaveSuccessful: false,
			replaceTypes: this.genDropDownItems(EDIT_TYPES,EDIT_NAMES),
			fieldTypes: this.genDropDownItems(STRUCTURED_DATA_FIELDS),
			isSaving: false,
			//validation state properties 
			isSaveAttempted: false,
			isValid: {settings:{}}
			}	


		if(this.state.isNew)
		{

			this.state.data = new Edit(null,null,null,false,{},"","","")

		}
	}

	//********************** GENERATORS **********************//

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
	 * Generates error messages if the field is in an error state
	 * @param {*} value the value to check (key)
	 * @param {*} message the message if in error state
	 */
	genIsError(value,message)
	{

	

		let {isValid,isSaveAttempted} = this.state;		

		if(isValid[value] === undefined || isValid[value] === true || isSaveAttempted === false )
		{	

			return undefined;

		}
		else
		{

			return {content:message}			

		}
	}

	/**
	 * Generate error message if a field in the setting is in an erro state
	 * @param {*} value the value in the settings (key)
	 * @param {*} message the message to be rendered if in an error state 
	 */
	genIsErrorSettings(value,message)
	{

		let {isValid,isSaveAttempted} = this.state; 

		if((isValid["settings"] === undefined || isValid["settings"][value]  || isValid["settings"][value]) || isSaveAttempted === false)
		{

			return undefined;

		}
		else
		{

			return {content:message}		

		}

	}

	/**
	 * Generates summary text of the target of the edit 
	 */
	genDataSummaryText()
	{

		let target = this.state.target;

		let summary = genSummary(target)

		return summary === "Entire Corpus" ? "No Data Selected" : summary

	}

	/**
	 * updates the settings fields based
	 * ont the type of edit 
	 * @param {*} edit 
	 */
	updateSettingsOnTypeChange(edit)
	{

		switch(edit.type)
		{

			case "replace":
				delete edit.settings.field;
				return;

			case "replacewithfield":
				edit.settings.field = undefined;
				return; 
			

		}

	}
	//********************** Validation **********************//

	/**
	 * Checks if an edit has valid properties.
	 * Adds the isValid object which lists for each property if it
	 * is valid or invalid
	 * @param {*} edit the edit to validate 
	 */
	isEditValid(edit)
	{
	
		let isValidObj = {};		

		let isValid = true;

		Object.keys(edit).forEach((item) => 
		{

			let isFieldValid = this.isFieldValid(edit,item);

			isValidObj[item] = isFieldValid;

			isValid = isValid ? isFieldValid : false;

		})
	
		//weird implementation detail
		//but the validity of the setting object is overwritten
		//but if it's not valid then the next operation is skipped 
		//and it returns false anyway. 
		isValidObj.settings = {};

		if(edit.settings === undefined || edit.settings === null)
		{

			edit.settings = {};

		}

		Object.keys(edit.settings).forEach((item) => 
		{

			let isSettingValid = this.isSettingValid(edit,item);

			isValidObj.settings[item] = true;

			isValid = isValid ? isSettingValid : false; 

		})

		this.setState({isValid:isValidObj})

		return isValid; 

		
	}

	/**
	 * Checks if a field is valid 
	 * @param {*} edit the edit to validate the field for
	 * @param {*} field the name of the property 
	 */
	isFieldValid(edit,field)
	{

		let value = edit[field];

		let validateText = (t) => 
		{

			return t.length > 0; 

		}

		switch(field)
		{

			case "replace":
				return validateText(value);

			case "type":
				return EDIT_TYPES.includes(value);

			case "isCorpus":
				return (value === true && edit.structuredDataID == null && edit.unstructuredDataID == null) ||
					value === false && (Number.isInteger(edit.structuredDataID) || Number.isInteger(edit.unstructuredDataID));

			case "replaceWith":
				return validateText(value);
			
			case "editID":
				return Number.isInteger(value) || value === undefined || value === null;
			
			case "settings": 
				return typeof(value) === "object";

			case "structuredDataID":
				return (Number.isInteger(value) && edit.unstructuredDataID === null && edit.isCorpus === false) ||
					value === null && (edit.isCorpus || Number.isInteger(edit.unstructuredDataID));				

			case "unstructuredDataID":
					return (Number.isInteger(value) && edit.structuredDataID === null && edit.isCorpus === false) ||
					value === null && (edit.isCorpus || Number.isInteger(edit.structuredDataID));

			case "order":
					return true;

			default:
					return false; 

		}

	}

	/**
	 * checks if a field on the settings is valid
	 * @param {*} edit the edit to validate
	 * @param {*} field the field to validate 
	 */
	isSettingValid(edit,field)
	{	

		let value = edit.settings[field];

		switch(field)
		{

			case "field":
				return STRUCTURED_DATA_FIELDS.includes(value);
			
			case "fields":
				return value.every((f) => STRUCTURED_DATA_FIELDS.includes(f));

			default:
				return false;

		}

	}


	//********************** HANDLERS **********************//

	/**
	 * handles changes in text inputs or drop downs
	 * @param {*} e not used
	 * @param {*} param1 the name and value of the control
	 */
	handleChange(e, { name, value })
	{

		let data = this.state.data; 

		data[name] = value;

		this.updateSettingsOnTypeChange(data);

		this.state.isValid[name] = this.isFieldValid(data,name);

		this.setState({ data: data, isValid:this.state.isValid });		

	}

	/**
	 * Handles changes in the settings 
	 * @param {*} e not used
	 * @param {*} param1 the name and value of the control 
	 */
	handleSettingChange(e,{name, value})
	{

		let data = this.state.data; 

		data.settings[name] = value;

		this.state.isValid.settings[name] = this.isSettingValid(data,name);

		this.setState({ data: data, isValid:this.state.isValid })

	}

	/**
	 * handles changes in the isCorpus text box 
	 */
	handleChecked()
	{

		let data = this.state.data;

		data.isCorpus = ! data.isCorpus

		if(data.isCorpus)
		{

			data.unstructuredDataID = null;

			data.structuredDataID = null;

		}

		this.state.isValid.isCorpus = this.isFieldValid(data,"isCorpus");

		this.setState({data:data,isValid:this.state.isValid,target:undefined})

	}

	/**
	 * Handles choosing data in the data choosing modal
	 * @param {*} chosenData the choosen data 
	 */
	handleChosenData(chosenData)
	{

		let edit = this.state.data;

		//reset
		edit.structuredDataID = null;

		edit.unstructuredDataID = null;

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

		this.state.isValid.isCorpus = this.isFieldValid(edit,"isCorpus");


		this.setState({data:edit,isValid:this.state.isValid,target: chosenData});

	}

	//********************** SERVER COMMUNICATION **********************//

	/**
     * Loads all edits and bind the parsed json to edit objects
     */
    loadData()
    {

        fetch("/edit?id=" + this.state.queryId )
			.then(res => 
				{				

					if(res.status === 401)
					{
	
						window.location.href = "/login-form"                    
	
					}
	
					
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
					let edit = bindEdit(result.edit);

					let unstructuredData = result.unstructuredData !== undefined && result.unstructuredData !== null
						? bindUnstructureData(result.unstructuredData) : undefined;
					
					let structuredData = result.structuredData !== undefined && result.structuredData !== null
						 ? bindStructuredData(result.structuredData) : undefined;

					let target = unstructuredData === undefined ? structuredData : unstructuredData;

					this.setState({data:edit,hasData:true,isError:false,target: target})
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

	/**
	 * Saves the data. Post if a new edit, put if an old edit 
	 */
	saveData()
	{


		let method = this.state.isNew ? "POST" : "PUT";

		if(this.isEditValid(this.state.data))
		{
		
			this.setState({isSaving: true})

			fetch("/edit",
			{method: method,
			body: JSON.stringify(this.state.data),
			headers: {
				'Content-Type': 'application/json'
			}}).then((res) => 
			{

				if(res.status === 401)
                {

                    window.location.href = "/login-form"                    

                }


				if(res.ok)
				{

					if(this.state.isNew)
					{

						this.setState({data:new Edit(null,null,null,false,{},"","",""),isSaveSuccessful:true,isSaveAttempted:false,isSaving:false})


					}
					else
					{

						this.props.history.goBack();

					}

					
				}
				else
				{
					
					this.setState({isError: true,hasData: false,isSaving: false });

				}
			})

		}
		else
		{

			this.setState({isSaveAttempted: true});

		}


	}

	/**
	 * Sends a delete request for the data 
	 */
	deleteData()
	{

		fetch("/edit?id=" + this.state.data.editID,
			{method: "DELETE",
			headers: {
				'Content-Type': 'application/json'
			}}).then((res) => 
			{
				
				if(res.status === 401)
                {

                    window.location.href = "/login-form"                    

                }


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
	//********************** RENDERS COMMUNICATION **********************//

	/**
	 * Renders the extra fields for the replace with field type of edit 
	 */
	renderReplaceFieldOptions()
	{

		if(this.state.data.type == "replacewithfield")
		{

			return(<Form.Group inline>
						<Form.Select 
						error={this.genIsErrorSettings("field","Please select a field")}
						placeholder='Choose Field'
						name='field'
						options={this.state.fieldTypes}
						value={this.state.data.settings.field}
						label="Field:"
						onChange={this.handleSettingChange.bind(this)}
						/>
				   </Form.Group>)

		}

	}

	
	/**
	 * Renders the extra fields for the sequential replace if the target is not unstructured data 
	 */
	renderSeqReplaceFieldOptions()
	{

		if(this.state.data.type == "sequentialreplace" && (this.state.target == undefined || this.state.target instanceof StructuredData))
		{

			if(this.state.data.settings.fields == undefined)
			{

				this.state.data.settings.fields = []

			}

			return(<div>
					<Form.Group inline>
						<Form.Select 
						multiple selection 
						error={this.genIsErrorSettings("field","Please select a field")}
						placeholder='Choose Field'
						name='fields'
						options={this.state.fieldTypes}
						value={this.state.data.settings.fields}
						label="Fields:"
						onChange={this.handleSettingChange.bind(this)}
						/>
						
				   </Form.Group>
				   {this.renderSeqReplaceFieldWarningMessage()}
				   </div>)

		}

	}

	/**
	 * Renders a warning if you select fields on a entire corpus edit informing the user 
	 * that this means the edit will only be applied to structured data 
	 */
	renderSeqReplaceFieldWarningMessage()
	{



		if(Array.isArray(this.state.data.settings.fields) && this.state.data.settings.fields.length > 0 && this.state.data.isCorpus)
		{
			return(<Message warning visible>
					When you select a field on this type of edit, it means that the edit will only apply to structured data (matches)
				   </Message>)

		}


	}


	/**
     * renders the page in loading state 
     */
	renderHasData()
	{

		let isCorpus = this.state.data.isCorpus;

		return(<Container>
			<Form size={"large"} loading={this.state.isSaving || (! this.state.hasData && ! this.state.isNew)} >
				<Form.Group inline>
					<Form.Select 
					error={this.genIsError("type","Please select a type")}
					placeholder='Choose Type'
					name='type'
					options={this.state.replaceTypes}
					value={this.state.data.type}
					label="Type:"
					onChange={this.handleChange.bind(this)}
					/>
					<Form.Checkbox
					error={this.genIsError("isCorpus","Please tick apply to corpus or choose data")}
					name="isCorpus"
					label = "Apply to Entire Corpus"
					checked={this.state.data.isCorpus}
					onChange={this.handleChecked.bind(this)}
					/>
					{isCorpus ? undefined : <DataPair label="Data" text={this.genDataSummaryText()}/>}
					{isCorpus ? undefined : <ChooseDataModal onSelect={this.handleChosenData.bind(this)}></ChooseDataModal>}
				</Form.Group>
				<Form.Group inline>
					<Form.Input
					error={this.genIsError("replace","Please enter text to replace")}
					placeholder="text"
					name="replace"
					label="Replace:"
					value={this.state.data.replace}
					onChange={this.handleChange.bind(this)}
					/>
					<Form.Input
					error={this.genIsError("replaceWith","Please enter text to replace with ")}
					placeholder="text"
					name="replaceWith"
					label="with"
					value={this.state.data.replaceWith}
					onChange={this.handleChange.bind(this)}
					/>
				</Form.Group>
				{this.renderReplaceFieldOptions()}
				{this.renderSeqReplaceFieldOptions()}
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
	
	/**
	 * renders the erorr message if it has data already 
	 */
    renderErrorWithData()
    {

        return(  
        <Message negative>
            <Message.Header>An error has occured</Message.Header>
            <p>Something has gone wrong! Reloading the page may fix the issue</p>
          </Message>
          )

	}

	/**
	 * Renders the 404 error message 
	 */
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
	 * Renders a successful save message 
	 */
	renderSaveSuccessful()
	{

		if(this.state.isSaveSuccessful)
		{

			return(<Message positive>
						<Message.Header>Successfully added an edit to the corpus!</Message.Header>
				   </Message>)

		}

	}
    /**
     * renders the page if the data is still loading 
     */

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

            return this.renderHasData();

        }

    }

	/**
	 * renders the component 
	 */
	render() {

		

		this.loadIfNotAlready()

		return (
				<div>
					{this.executeRender()}
					{this.renderSaveSuccessful()}
				</div>
		);
	}
}


export default withRouter(EditForm);