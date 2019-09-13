import DataPair from "./DataPair";
import renderer from 'react-test-renderer';
import React from 'react';
import {filterConsoleError,unfilterConsoleError} from "../TestUtils";
import {shallow, mount} from "enzyme";
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from "enzyme-to-json";
import ErrorTester from "./ErrorTester"

configure({ adapter: new Adapter() });


describe("Data Pair Tests",function()
{


    beforeAll(() =>
    {

        return new Promise(function(resolve,reject)
        {

            filterConsoleError();               

            resolve();

        })

    });

    test("Should throw error when given undefined label",(done) => 
    {

    renderer.create(<ErrorTester              
             onError={(e,em) => {
                    expect(e.message).toEqual("text and label must be defined"); 
                    done();}
                    }>
                 <DataPair text="hello" />
             </ErrorTester>
            );       

    });

    test("Should throw error when given undefined text",(done) => 
    {

    renderer.create(<ErrorTester              
             onError={(e,em) => {
                    expect(e.message).toEqual("text and label must be defined"); 
                    done();}
                    }>
                 <DataPair label="world"/>
             </ErrorTester>
            );       

    });

    test("Should render correctly",() => 
    {

        let wrapper = renderer.create(<DataPair label="hello" text="world"/>)

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