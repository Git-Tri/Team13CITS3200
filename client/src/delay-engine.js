/**
 * An object for executing a function if no additional calls have been made after
 * a given number of miliseconds
 */
class DelayEngine
{
    /**
     * creates an object
     * @param {*} delay delay in miliseconds
     */
    constructor(delay)
    {

        this.delay = delay;

    }

    /**
     * starts the process, if called again will reset the timer
     * @param {*} callback the callback to call on success. 
     */
    start(callback)
    {

        let start = new Date();

        this.lastInput = start;
        setTimeout(() => 
        {

            if(this.lastInput === start)
            {

                callback()

            }

        },this.delay)

    }

    /**
     * stops the timer and so the code will not execute after a delay
     */
    stop()
    {

        this.lastInput = undefined;

    }

}

export default DelayEngine;