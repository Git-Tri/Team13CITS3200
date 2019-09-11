import StructuredDataTable from "./StructuredDataTable";
import renderer from 'react-test-renderer';
import React from 'react';
import ErrorTester from "./ErrorTester";
import {StructuredData} from "../domain";
import {filterConsoleError,unfilterConsoleError} from "../TestUtils";
import {shallow, mount} from "enzyme";

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });


describe("Structured Data Table Tests",function()
{



    beforeAll(() =>
        {

            return new Promise(function(resolve,reject)
            {

                filterConsoleError();

                resolve();

            })

        });

    
    const testStructuredData = [
        new StructuredData(1,new Date("1991-04-20T00:00:00.000Z"),"some team","some other team",1,"some comp",{}),
        new StructuredData(2,new Date("1991-04-20T00:00:00.000Z"),"some team","some other team",1,"some comp",{})
        ];
    

    test("Should throw error when given undefined items",(done) => 
    {

    renderer.create(<ErrorTester              
             onError={(e,em) => {
                    expect(e.message).toEqual("Props.items should contain a list of structured data"); 
                    done();}
                    }>
                 <StructuredDataTable ></StructuredDataTable>
             </ErrorTester>
            );       

    });

    test("Should throw error when given non-array items",(done) => 
    {

        renderer.create(<ErrorTester              
            onError={(e,em) => {
                   expect(e.message).toEqual("Props.items should contain a list of structured data"); 
                   done();}
                   }>
                <StructuredDataTable items={"not an item"}></StructuredDataTable>
            </ErrorTester>
           );       

    });

    test("Should throw error when one item is undefined",(done) => 
    {

        let missingItemData = testStructuredData.slice();

        missingItemData.push(undefined);

        renderer.create(<ErrorTester              
            onError={(e,em) => {
                   expect(e.message).toEqual("props.data must be an instance of structured data"); 
                   done();}
                   }>
                <StructuredDataTable items={missingItemData}></StructuredDataTable>
            </ErrorTester>
           );       

    });

    test("Should throw error when item id wrong type",(done) => 
    {

        let wrongIDItemData = testStructuredData.slice();

        wrongIDItemData.push(new StructuredData("not an id",new Date(),"some team","some other team",1,"some comp",{}));

        renderer.create(<ErrorTester              
            onError={(e,em) => {
                   expect(e.message).toEqual("every piece of data should have valid date, home, away, comp name and plan"); 
                   done();}
                   }>
                <StructuredDataTable items={wrongIDItemData}></StructuredDataTable>
            </ErrorTester>
           );       

    });


    test("Should render correctly for correct input",() => 
    {        
                 
        let Component = renderer.create(<StructuredDataTable items={testStructuredData.slice()}/>)

        expect(Component.toJSON()).toMatchSnapshot();

    })

    test("Should render correctly for correct input with onSelect handler",() => 
    {        
        
        let Component = renderer.create(<StructuredDataTable onSelect={() => {}} items={testStructuredData.slice()}/>)

        expect(Component.toJSON()).toMatchSnapshot();

    })

    test("Should call callback when onselect is trigerred",(done) => 
    {

        let wrapper = mount(<StructuredDataTable onSelect={() => done()} items={testStructuredData.slice()}/>)

        wrapper.state().selectFunc(testStructuredData[0]);


    })

    test("Should render correctly with selected row",() => 
    {

        let wrapper = shallow(<StructuredDataTable onSelect={() => {}} items={testStructuredData.slice()}/>)

        wrapper.state().selectFunc(testStructuredData[0]);

        expect(wrapper).toMatchSnapshot();


    })

    test("Should render correctly for correct with no data",() => 
    {        
        
        let Component = renderer.create(<StructuredDataTable onSelect={() => {}} items={[]}/>)

        expect(Component.toJSON()).toMatchSnapshot();

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

