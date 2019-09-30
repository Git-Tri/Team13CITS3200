import React, { Component } from 'react';
import { Tab, Button, Header, Modal, Loader, Message, Container } from 'semantic-ui-react';
import StructuredDataTable from './tables/structured-data-table';
import { Match } from "../domain";
import { bindMatch } from "../data-binding";
import MatchListTable from './tables/match-list-table';


/**
 * Shows all unstructured and structured data and allows the user
 * to select a piece of data 
 */
class ChooseMatchModal extends Component {

    constructor(props) {

        super(props);

        if (typeof (this.props.onSelect) != "function") {

            throw Error("Choose Match Modal requires onSelect prop which is a function")

        }

        this.state = {
            isLoaded: false,
            data: ['sss'],
            isError: false,
            lastSelectedId: -1,
            isModalOpen: false,
            selectedItem: undefined,
            isNoChooseError: false
        };

        

    }

    /**
     * Handles any errors cuased by a sub-component 
     * @param {*} error the error recieved
     * @param {*} errorInfo information about the error
     */
    componentDidCatch(error, errorInfo) {

        this.setState({ isError: true });

    }

    /**
     * Loads all match data 
     * and binds those objects to match data types 
     */
    loadData() {

        fetch("/matchList")
            .then(res => res.json())
            .then(result => {

                
                let matches = result.matches.map((d) => bindMatch(d));

                this.setState({ data: matches, isLoaded: true, isError: false });

            })
            .catch(err => {
                this.setState({ isError: true })
            });

    }

    /**
     * handles the click on the choose button
     * will update state to display an error if no item is selected
     */
    handleChooseButtonClick() {


        if (this.state.lastSelectedId != -1) {

            this.props.onSelect(this.state.selectedItem);

            this.handleClose();

        }
        else {

            this.setState({ isNoChooseError: true });


        }
    }

    /**
     * handles the selection of data
     * @param {*} data should be type unstructured or structured data 
     */
    handleSelection(data) {

        if(data.id === this.state.lastSelectedId)
        {

            this.props.onSelect(data);      

            this.setState({isModalOpen: false,isNoChooseError: false});

        }
        else
        {

            this.setState({ lastSelectedId: data.id, selectedItem: data });

        }

        

    }


    /**
     * Renders the page if the data has been loaded 
     */
    renderLoaded() {
        return (<div>
            <Tab menu={{ pointing: true }} panes={
                [
                    {
                        menuItem: 'Match',
                        render: () =>
                            <Tab.Pane>
                                <MatchListTable items={this.state.data}
                                    onSelect={this.handleSelection.bind(this)} />
                            </Tab.Pane>
                    },

                ]} />
            <Message warning attached hidden={!this.state.isNoChooseError}>
                Please select an item before clicking choose. You can select an item by clicking on a table row
            </Message>
            <br />
            <Button primary onClick={this.handleChooseButtonClick.bind(this)}>Choose</Button>
        </div>);

    }

    /**
     * Renders the page if an error has occured
     */
    renderError() {

        return (
            <Message negative>
                <Message.Header>An error has occured</Message.Header>
                <p>Failed to get data from the server.</p>
                <Button color="red" onClick={this.loadData.bind(this)}>Try Again?</Button>
            </Message>
        )

    }

    /**
     * renders the page if the data is still loading 
     */
    renderLoading() {

        return (<Loader>Loading Data</Loader>)

    }

    /**
     * Chooses which render that should be rendered based on 
     * state of the object 
     */
    executeRender() {

        if (this.state.isError) {

            return this.renderError();

        }
        else if (this.state.isLoaded) {

            return this.renderLoaded();

        }
        else {

            return this.renderLoading();

        }

    }

    /**
     * handles modal opening 
     */
    handleOpen() { this.setState({ isModalOpen: true }) }

    /**
     * handles the modal closing
     */
    handleClose() {
        this.setState({
            isModalOpen: false,
            lastSelectedId: -1,
            isNoChooseError: false,
            selectedItem: undefined
        });
    }


    /**
     * renders the component 
     */
    render() {

        let loadIfNotAlready = () => {


            if (this.state.isLoaded === false) {

                this.loadData();

            }

        }

        return (
            <Modal
                closeIcon
                onOpen={loadIfNotAlready.bind(this)}
                trigger={<Button primary type ="button" onClick={this.handleOpen.bind(this)}>{this.props.text !== undefined ? this.props.text : "Change"}</Button>}
                onClose={this.handleClose.bind(this)}
                open={this.state.isModalOpen}>
                <Modal.Header>Choose Match</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Header>Please select a match</Header>
                        <br />
                    </Modal.Description>
                    {this.executeRender()}
                </Modal.Content>
            </Modal>
        );


    }
}

export default ChooseMatchModal;