import React, { Component } from 'react';
import PageHeader from './PageHeader.js';
import { Button, Header, Icon, Modal } from 'semantic-ui-react'
import ChooseDataModal from "./ChooseDataModal";

class AddEdit extends Component {

	render() {
		return (
			<div className="page">
				<PageHeader 
					header={"Add Edit"}
					sidebarVisible={this.props.sidebarVisible}
					handleSidebarClick={this.props.handleSidebarClick}
				/>
				<div id="container" style={{height:"100vh"}}>
					<ChooseDataModal onSelect={(d) => {console.log(JSON.stringify(d))}}></ChooseDataModal>
				</div>
			</div>
		);
	}
}


export default AddEdit;