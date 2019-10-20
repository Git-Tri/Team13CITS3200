import React, { Component } from 'react';
import PageHeader from '../page-header.js';
import { Button, Loader, Message, Container, Form, Dimmer} from 'semantic-ui-react'
import {SearchRequest} from "../../domain";
import DelayEngine from "../../delay-engine";

export class ListPage extends Component {

	constructor(props)
	{

		super(props)

		this.state = {
            data: [],
            target:[],
             isLoaded: false,
              isError: false,
              page:1,
              totalPages:NaN,
              paging:false,
              searches:{},
              delayEngine: new DelayEngine(750)}

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
     * handles changing of pages
     * @param {*} page the page to change to
     */
    handlePageChange(page)
    {

        this.state.page = page;

        this.setState({paging: true, page:page})
    }

    /**
     * handles standard searches by child components 
     */
    handleSearchChange(key,search)
    {      
        
        if(search === undefined && key !== undefined)
        {
            
            delete this.state.searches[key]
            
            this.setState({searches:this.state.searches},() => 
            {



                this.state.delayEngine.start(() => this.search());

            })


        }
        

        if(search !== undefined &&
           search !== null &&
           typeof(search) === "object" &&
           search instanceof SearchRequest)
        {



            this.state.searches[key] = search;

            this.setState({searches:this.state.searches},() => 
            {



                this.state.delayEngine.start(() => this.search());

            })

            

        }
        
    }

    /**
     * starts a search 
     */
    search()
    {

        this.state.delayEngine.stop();        

        this.sendRequest(Object.values(this.state.searches));       

    }

    /**
     * Sends a request to the server and then passes the result to child component's load data function
     * @param {*} searches the searches to perform if there are any
     */
    sendRequest(searches)
    {
        
        if(this.state.route === undefined)
        {

            throw new Error("this.state.route should be defined");

        }

        
        let body;

        //genBody allows for more complex searching, not neccessary for most list pages 
        if(this.genBody === undefined)
        {

                
            if(searches !== undefined)
            {

                body = JSON.stringify({searches:searches})

            }
            else
            {

                body = ""

            }

        }
        else
        {

            body = JSON.stringify(this.genBody());

        }


        fetch(this.state.route+"?page=" + this.state.page,{method: "POST",
            body: body,
            headers: {
                'Content-Type': 'application/json'
            }})
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

                

                this.setState({totalPages:result.pages,isLoaded: true,paging:false});

                if(result !== undefined)
                {

                    this.loadData(result);

                }

                

            }).catch(err => 
            {
                this.setState({isError: true})
            });
            


    }

    /**
     * loads the data if it is not already loaded
     */
	loadIfNotAlready()
	{

		if((this.state.isLoaded === false || this.state.paging === true) && this.state.isError === false)
		{

            if(this.loadData === undefined)
            {

                throw new Error("Load data must be defined by child component")

            }

			this.sendRequest();

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
            <Button color="red" onClick={() => this.sendRequest()}>Try Again?</Button>
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
     * renders the page in loading state 
     */
    renderLoading()
    {

        return(<Loader active >Loading your edits</Loader>)

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

            this.renderLoading()

        }

    }

	

    /**
     * renders the page 
     */
	render() {

		this.loadIfNotAlready();

		return (<div className="page">
           <Dimmer active={! this.state.isLoaded}>
                <Loader active={! this.state.isLoaded}> Loading</Loader>
           </Dimmer>
			<PageHeader 
				header={this.state.headerText != undefined ? this.state.headerText : "List Page"}
				sidebarVisible={this.props.sidebarVisible}
				handleSidebarClick={this.props.handleSidebarClick}
			/>           
			<Container>
            <Container textAlign="center">
                <Form>
                {this.renderSearch !== undefined ? this.renderSearch() : undefined}
                </Form>
            </Container>
    
			<br/>
            <div id="container" style={{minHeight:"100vh"}}>
                {this.executeRender()}    
            </div>
            </Container>	
            
		</div>)
		
	}
}

export default ListPage;