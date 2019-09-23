import React from "react";

/**
 * Catches an error and uses the onError callback to allow tests to pass
 * this component is meant for testing purposes only
 * when testing place the error component as a child to this component 
 * then pass in an onError prop or check the state of this component
 * derived from: https://codepen.io/gaearon/pen/wqvxGa?editors=0010
 */
class ErrorTester extends React.Component {
    constructor(props) {
      super(props);
      this.state = { error: null, errorInfo: null };
    }
    
    componentDidCatch(error, errorInfo) {
      this.setState({
        error: error,
        errorInfo: errorInfo
      })

      this.props.onError(error,errorInfo);
    }
    
    render() {
      if (this.state.errorInfo) {
        return (
          <p> Good news an error occurred</p>
          );
      }
      return this.props.children;
    }  
  }

  export default ErrorTester;
