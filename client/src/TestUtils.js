const trueErrorLog = console.error;

/**
 * okay this is a weird one to explain
 * basically there an issue with our dev setup (web-pack/react/create react app)
 * where if you test when a component fails it will spam the error log with
 * a message telling you the component failed 
 * since we are testing that, this is completely unneccessary
 * as such i am filtering the console.error to exclude these messages 
 * to give a more readable test output
 * using monkey patching: https://davidwalsh.name/monkey-patching
 */
export function filterConsoleError()
{

    
    console.error = (e) => 
    {

        
        if(typeof(e) === "string" && ! e.includes("React will try to recreate this component tree from scratch using the error boundary you provided"))
        {

            trueErrorLog(e);
        
        }
        else if(typeof(e) !== "string")
        {

            trueErrorLog(e);

        }
        
    }

}

export function unfilterConsoleError()
{

    console.error = trueErrorLog;

}