import {AddEdit} from "./AddEdit";
import renderer from 'react-test-renderer';
import React from 'react';
import {filterConsoleError,unfilterConsoleError} from "../TestUtils";
import {shallow, mount} from "enzyme";
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ErrorTester from "./ErrorTester"
import {Edit} from "../domain"

configure({ adapter: new Adapter() });

//NOTE: only doing shallow tests to get around router issues 
//testing the functionality of edit form is done in Editform.test.js
describe("Add Edit Tests",function()
{


    beforeAll(() =>
    {

        return new Promise(function(resolve,reject)
        {

            filterConsoleError();               

            resolve();

        })

    });


    test("Should render correctly for new edit",() => 
    {

        let wrapper = shallow(<AddEdit id={null}/>)

        expect(wrapper).toMatchSnapshot();

    })

    test("Should render correctly for existing edit",() => 
    {

        let wrapper = shallow(<AddEdit id={1} data={new Edit(1,1,1,true,{},"some","all","replace")}/>)

        expect(wrapper).toMatchSnapshot();

    })


    afterAll(() =>
    {

        return new Promise(function(resolve,reject)
        {

            unfilterConsoleError();

            resolve();

        })

    });
})