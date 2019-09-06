import * as constants from "./Constants";

describe("Constants Tests",() => 
{

    function constantTests(name,data,type)
    {

        test(name + " should exist",() => expect(data).toBeDefined());

        test(name + " should have type " + type,() => expect(typeof(data)).toEqual(type));

    }

    constantTests("APP_NAME",constants.APP_NAME,"string");

    constantTests("MAX_TITLE_SIZE",constants.MAX_TITLE_SIZE,"number");

})