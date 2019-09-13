import React, { Component } from 'react';
import PageHeader from './PageHeader.js';
import { withRouter } from 'react-router-dom';
import EditForm from "./EditForm"


/**
 * The page for adding an edit 
 * @param {*} props should only be passed in for testing purposes 
 */
export function AddEdit(props) 
{


	//allow passing in of id for testing 
	let id = props.id === undefined ? 
		new URLSearchParams(props.location.search).get("id") : props.id;

	let isNew = ! (id === undefined || id === null);

	let headerText = isNew ? "Create new Edit" : "View Edit";

	//data prop should always be undefined in production
	//passed in testing purposes 
	return (
		<div className="page">
			<PageHeader 
				header={headerText}
				sidebarVisible={props.sidebarVisible}
				handleSidebarClick={props.handleSidebarClick}
			/>
			<div id="container" style={{height:"100vh"}}>
				<EditForm id={id} data={props.data}/>
			</div>
		</div>
	);

}





export default withRouter(AddEdit);