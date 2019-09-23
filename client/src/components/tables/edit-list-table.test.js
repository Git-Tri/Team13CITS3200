import EditListTable from "./EditListTable";
import renderer from 'react-test-renderer';
import React from 'react';
import ErrorTester from "../error-tester";
import {Edit,StructuredData,UnstructuredData} from "../../domain";
import {filterConsoleError,unfilterConsoleError} from "../../test-utils";
import {shallow, mount} from "enzyme";

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });


describe("Edit List Table Tests",function()
{

    beforeAll(() =>
        {

            return new Promise(function(resolve,reject)
            {

                filterConsoleError();

                resolve();

            })

        });   
    
    const testEdit = [new Edit(1,1,null,false,{},"apple","banna","replace"),
        new Edit(2,null,1,false,{},"football","soccer","replace"),
        new Edit(3,1,null,false,{field:"player"},"gary jones","player 1","replacewithfield"),
        new Edit(4,null,null,true,{},"reece","ryan","replace")]
        

       
    const targets = [new StructuredData(1,new Date("1991-04-20T00:00:00.000Z"),"some team","some other team",1,"some comp",{}),
    new UnstructuredData(1,1,"some title","some author","some url",new Date("1991-04-20T00:00:00.000Z"),new Date("1991-04-20T00:00:00.000Z"),"some data"),
    new StructuredData(1,new Date("1991-04-20T00:00:00.000Z"),"some team","some other team",1,"some comp",{}),
    undefined]

    let testItemGen = (e) => { return{edits:e,targets:targets}};

    const testItems = testItemGen(testEdit);

    test("Should throw error when given undefined items",(done) => 
    {

    renderer.create(<ErrorTester              
             onError={(e,em) => {
                    expect(e.message).toEqual("Props.items should contain a list of edits"); 
                    done();}
                    }>
                 <EditListTable ></EditListTable>
             </ErrorTester>
            );       

    });

    test("Should throw error when given non-array items",(done) => 
    {

        renderer.create(<ErrorTester              
            onError={(e,em) => {
                   expect(e.message).toEqual("Props.items should contain a list of edits"); 
                   done();}
                   }>
                <EditListTable items={"not an item"}></EditListTable>
            </ErrorTester>
           );       

    });

    test("Should throw error when one item is undefined",(done) => 
    {

        let missingItemData = testEdit.slice();

        missingItemData.push(undefined);

        renderer.create(<ErrorTester              
            onError={(e,em) => {
                   expect(e.message).toEqual("props.data must be an instance of edit"); 
                   done();}
                   }>
                <EditListTable items={testItemGen(missingItemData)}></EditListTable>
            </ErrorTester>
           );       

    });

    test("Should throw error when item id wrong type",(done) => 
    {

        let wrongIDItemData = testEdit.slice();

        wrongIDItemData.push(new Edit("not an id",1,null,false,{},"apple","banna","replace"));

        renderer.create(<ErrorTester              
            onError={(e,em) => {
                   expect(e.message).toEqual("every piece of data should be a valid edit"); 
                   done();}
                   }>
                <EditListTable items={testItemGen(wrongIDItemData)}></EditListTable>
            </ErrorTester>
           );       

    });

    test("Should throw error with no target for edit",(done) => 
    {

        let wrongIDItemData = testEdit.slice();

        wrongIDItemData.push(new Edit(132,null,null,false,{},"apple","banna","replace"));

        renderer.create(<ErrorTester              
            onError={(e,em) => {
                   expect(e.message).toEqual("every piece of data should be a valid edit"); 
                   done();}
                   }>
                <EditListTable items={testItemGen(wrongIDItemData)}></EditListTable>
            </ErrorTester>
           );       

    });

    test("Should throw error with wrong type",(done) => 
    {

        let wrongIDItemData = testEdit.slice();

        wrongIDItemData.push(new Edit(12,1,null,false,{},"apple","banna",null));

        renderer.create(<ErrorTester              
            onError={(e,em) => {
                   expect(e.message).toEqual("every piece of data should be a valid edit"); 
                   done();}
                   }>
                <EditListTable items={testItemGen(wrongIDItemData)}></EditListTable>
            </ErrorTester>
           );       

    });

    test("Should throw error with missing settings for replacewithfield type",(done) => 
    {

        let wrongIDItemData = testEdit.slice();

        wrongIDItemData.push(new Edit(21,1,null,false,{},"apple","banna","replacewithfield"));

        renderer.create(<ErrorTester              
            onError={(e,em) => {
                   expect(e.message).toEqual("every piece of data should be a valid edit"); 
                   done();}
                   }>
                <EditListTable items={testItemGen(wrongIDItemData)}></EditListTable>
            </ErrorTester>
           );       

    });

    test("Should throw error with wrong replace field",(done) => 
    {

        let wrongIDItemData = testEdit.slice();

        wrongIDItemData.push(new Edit(1,1,null,false,null,undefined,"with","replace"));

        renderer.create(<ErrorTester              
            onError={(e,em) => {
                   expect(e.message).toEqual("every piece of data should be a valid edit"); 
                   done();}
                   }>
                <EditListTable items={testItemGen(wrongIDItemData)}></EditListTable>
            </ErrorTester>
           );       

    });

    test("Should throw error with wrong replace with field",(done) => 
    {

        let wrongIDItemData = testEdit.slice();

        wrongIDItemData.push(new Edit(1,1,null,false,null,"replace",undefined,"replace"));

        renderer.create(<ErrorTester              
            onError={(e,em) => {
                   expect(e.message).toEqual("every piece of data should be a valid edit"); 
                   done();}
                   }>
                <EditListTable items={testItemGen(wrongIDItemData)}></EditListTable>
            </ErrorTester>
           );       

    });

    test("Should render correctly for correct input",() => 
    {        
                 
        let Component = renderer.create(<EditListTable items={testItems}/>)

        expect(Component.toJSON()).toMatchSnapshot();

    })

    test("Should render correctly for correct input with onSelect handler",() => 
    {        
        
        let Component = renderer.create(<EditListTable onSelect={() => {}} items={testItems}/>)

        expect(Component.toJSON()).toMatchSnapshot();

    })

    test("Should call callback when onselect is trigerred",(done) => 
    {

        let wrapper = mount(<EditListTable onSelect={() => done()} items={testItems}/>)

        wrapper.state().selectFunc(testEdit[0]);


    })

    test("Should render correctly with selected row",() => 
    {

        let wrapper = shallow(<EditListTable onSelect={() => {}} items={testItems}/>)

        wrapper.state().selectFunc(testEdit[0]);

        expect(wrapper).toMatchSnapshot();


    })

    test("Should render correctly for correct with no data",() => 
    {        
        
        let Component = renderer.create(<EditListTable onSelect={() => {}} items={{edits:[],targets:[]}}/>)

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

