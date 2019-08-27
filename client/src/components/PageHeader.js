import React, { Component } from 'react';
import { Header, Button } from 'semantic-ui-react';

class PageHeader extends Component {
	render() {
		return (
			<div>
				<Button onClick={this.props.handleSidebarClick} >
					{(this.props.sidebarVisible?"Hide":"Show")+" sidebar"}
				</Button>
				<Header>
					{this.props.header}
				</Header>
			</div>
		);
	}
}

export default PageHeader;