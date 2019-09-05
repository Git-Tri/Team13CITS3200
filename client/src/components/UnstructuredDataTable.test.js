import UnstructuredDataTable from "./UnstructuredDataTable";
import renderer from 'react-test-renderer';
import React, { Component } from 'react';
import ErrorTester from "./ErrorTester";
import {UnstructuredData} from "../domain";
import {filterConsoleError,unfilterConsoleError} from "../TestUtils";
import {shallow, mount} from "enzyme";

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });


describe("Unstructured Data Table Tests",function()
{



    beforeAll(() =>
        {

            return new Promise(function(resolve,reject)
            {

                filterConsoleError();

                resolve();

            })

        });

    /*
    const testStructuredData = [
        new StructuredData(1,new Date(),"some team","some other team",1,"some comp","some plan",{}),
        new StructuredData(2,new Date(),"some team","some other team",1,"some comp","some plan",{})
        ];
    */
    const testUnstructuredData = [
        new UnstructuredData(1,1,"some title","some author","some url",new Date(),new Date(),"some data"),
        new UnstructuredData(2,1,"some title really really really really really long title","some author","some url",new Date(),new Date(),"some data"),
        ];

    

    test("Should throw error- when given undefined items",(done) => 
    {

    renderer.create(<ErrorTester              
             onError={(e,em) => {
                    expect(e.message).toEqual("Props.items should contain a list of unstructured data"); 
                    done();}
                    }>
                 <UnstructuredDataTable ></UnstructuredDataTable>
             </ErrorTester>
            );       

    });

    test("Should throw error when given non-array items",(done) => 
    {

        renderer.create(<ErrorTester              
            onError={(e,em) => {
                   expect(e.message).toEqual("Props.items should contain a list of unstructured data"); 
                   done();}
                   }>
                <UnstructuredDataTable items={"not an item"}></UnstructuredDataTable>
            </ErrorTester>
           );       

    });

    test("Should throw error when one item is undefined",(done) => 
    {

        let missingItemData = testUnstructuredData.slice();

        missingItemData.push(undefined);


        renderer.create(<ErrorTester              
            onError={(e,em) => {
                   expect(e.message).toEqual("props.data must be an instance of unstructured data"); 
                   done();}
                   }>
                <UnstructuredDataTable items={missingItemData}></UnstructuredDataTable>
            </ErrorTester>
           );       

    });

    test("Should throw error when item id wrong type",(done) => 
    {

        let wrongIDItemData = testUnstructuredData.slice();

        wrongIDItemData.push(new UnstructuredData("bob",1,"some title really really really really really long title","some author","some url",new Date(),new Date(),"some data"));

        renderer.create(<ErrorTester              
            onError={(e,em) => {
                   expect(e.message).toEqual("every piece of data should have valid id, published, title and author"); 
                   done();}
                   }>
                <UnstructuredDataTable items={wrongIDItemData}></UnstructuredDataTable>
            </ErrorTester>
           );       

    });

    test("Should throw error when item date wrong type",(done) => 
    {

        let wrongIDItemData = testUnstructuredData.slice();

        wrongIDItemData.push(new UnstructuredData(1,1,"some title really really really really really long title","some author","some url","some date",new Date(),"some data"));

        renderer.create(<ErrorTester              
            onError={(e,em) => {
                   expect(e.message).toEqual("every piece of data should have valid id, published, title and author"); 
                   done();}
                   }>
                <UnstructuredDataTable items={wrongIDItemData}></UnstructuredDataTable>
            </ErrorTester>
           );       

    });

    test("Should throw error when item author wrong type",(done) => 
    {

        let wrongIDItemData = testUnstructuredData.slice();

        wrongIDItemData.push(new UnstructuredData(1,1,"some title really really really really really long title",undefined,"some url",new Date(),new Date(),"some data"));

        renderer.create(<ErrorTester              
            onError={(e,em) => {
                   expect(e.message).toEqual("every piece of data should have valid id, published, title and author"); 
                   done();}
                   }>
                <UnstructuredDataTable items={wrongIDItemData}></UnstructuredDataTable>
            </ErrorTester>
           );       

    });

    test("Should throw error when item title wrong type",(done) => 
    {

        let wrongIDItemData = testUnstructuredData.slice();

        wrongIDItemData.push(new UnstructuredData(1,1,null,"some author","some url",new Date(),new Date(),"some data"));

        renderer.create(<ErrorTester              
            onError={(e,em) => {
                   expect(e.message).toEqual("every piece of data should have valid id, published, title and author"); 
                   done();}
                   }>
                <UnstructuredDataTable items={wrongIDItemData}></UnstructuredDataTable>
            </ErrorTester>
           );       

    });


    test("Should render correctly for correct input",() => 
    {        
                 
        let Component = renderer.create(<UnstructuredDataTable items={testUnstructuredData.slice()}/>)

        expect(Component.toJSON()).toMatchSnapshot();

    })

    test("Should render correctly for correct input with onSelect handler",() => 
    {        
        
        let Component = renderer.create(<UnstructuredDataTable onSelect={() => {}} items={testUnstructuredData.slice()}/>)

        expect(Component.toJSON()).toMatchSnapshot();

    })

    test("Should call callback when onselect is trigerred",(done) => 
    {

        let wrapper = mount(<UnstructuredDataTable onSelect={() => done()} items={testUnstructuredData.slice()}/>)

        wrapper.state().selectFunc(testUnstructuredData[0]);


    })

    test("Should render correctly with selected row",() => 
    {

        let wrapper = shallow(<UnstructuredDataTable onSelect={() => {}} items={testUnstructuredData.slice()}/>)

        wrapper.state().selectFunc(testUnstructuredData[0]);

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

