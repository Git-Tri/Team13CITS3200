
import React from 'react';

/**
 * Creates a simple data pair with a label and a text valued
 * passed into the function
 * @param {*} props the props passed in, must contain a label and text properties 
 */
function DataPair(props)
{

    if(props.text === undefined || props.label === undefined)
    {

        throw new Error("text and label must be defined")

    }

    return(
    <div style={{padding:"0px 15px 0px 15px"}}>
        <b style={{padding:"0px 0px 0px 15px"}}> {props.label}:</b>{props.text}        
    </div>);

}

export default DataPair;