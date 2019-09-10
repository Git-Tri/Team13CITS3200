import ChooseDataModal from "./ChooseDataModal";
import renderer from 'react-test-renderer';
import React from 'react';
import ErrorTester from "./ErrorTester";
import {StructuredData,UnstructuredData} from "../domain";
import {filterConsoleError,unfilterConsoleError} from "../TestUtils";
import {shallow, mount} from "enzyme";
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from "enzyme-to-json";

configure({ adapter: new Adapter() });

describe("Chose Data Modal Tests",function()
{

    const testStructuredData = [
        new StructuredData(1,new Date("1991-04-20T00:00:00.000Z"),"some team","some other team",1,"some comp",{}),
        new StructuredData(2,new Date("1991-04-20T00:00:00.000Z"),"some team","some other team",1,"some comp",{})
        ];
    
   const testUnstructuredData = [
    new UnstructuredData(1,1,"some title","some author","some url",new Date("1991-04-20T00:00:00.000Z"),new Date("1991-04-20T00:00:00.000Z"),"some data"),
    new UnstructuredData(2,1,"some title really really really really really long title","some author","some url",new Date("1991-04-20T00:00:00.000Z"),new Date("1991-04-20T00:00:00.000Z"),"some data"),
    ];

    const testData ={structuredData: testStructuredData, unstructuredData: testUnstructuredData}    

    const loadDataMock = ChooseDataModal.prototype.loadData = jest.fn();

    beforeAll(() =>
        {

            return new Promise(function(resolve,reject)
            {

                filterConsoleError();               

                resolve();

            })

        });

    test("should render correctly when closed",function()
    {

        expect(renderer.create(<ChooseDataModal onSelect={() => {}}/>)
            .toJSON())
            .toMatchSnapshot();

    });

    test("should call load data when modal opens",function()
    {
        
        let component = mount(<ChooseDataModal onSelect={() =>{}}/>);

        component.find("Button").simulate("click");

        expect(loadDataMock).toHaveBeenCalledTimes(1);

    });

    test("should render single selection correctly",function()
    {

        let component = mount(<ChooseDataModal onSelect={() =>{}}/>);

        component.instance().handleSelection(testStructuredData[0]);

        expect(toJson(component)).toMatchSnapshot();
        

    });

    test("should render double selection correctly",function()
    {
        
        let component = mount(<ChooseDataModal onSelect={() =>{}}/>);

        component.instance().handleSelection(testStructuredData[0]);

        component.instance().handleSelection(testStructuredData[0]);

        expect(toJson(component)).toMatchSnapshot();

    });

    test("should close on double selection",function()
    {

        let component = mount(<ChooseDataModal onSelect={() =>{}}/>);

        component.instance().handleSelection(testStructuredData[0]);

        component.instance().handleSelection(testStructuredData[0]);

        expect(component.state().isModalOpen).toEqual(false); 

    });

    test("should render Error correctly",function(done)
    {

        let component = mount(<ChooseDataModal onSelect={() =>{}}/>);

        component.setState({isError: true,isModalOpen: true},() => 
        {

            expect(toJson(component)).toMatchSnapshot();

            done();

        })


    });

    test("should render loaded data correctly",function(done)
    {

        let component = mount(<ChooseDataModal onSelect={() =>{}}/>);

        component.setState({isModalOpen: true, isLoaded: true, data: testData},() => 
        {

            expect(toJson(component)).toMatchSnapshot();

            done();

        })


    });

    test("should render loading correctly",function(done)
    {

        let component = mount(<ChooseDataModal onSelect={() =>{}}/>);

        component.setState({isModalOpen: true},() => 
        {

            expect(toJson(component)).toMatchSnapshot();

            done();

        })


    });

    test("should call load data when modal opens",function(done)
    {
        
        let component = mount(<ChooseDataModal onSelect={() =>{}}/>);

        component.setState({isModalOpen: true},() => 
        {

            component.instance().handleChooseButtonClick();

            expect(toJson(component)).toMatchSnapshot();

            done();

        })

    });

    test("should render error message when sub-component fails",function(done)
    {

        
        let component = mount(<ChooseDataModal onSelect={() =>{}}/>);

        let brokenUnstructuredData = testUnstructuredData.slice();

        brokenUnstructuredData.push(undefined);

        let brokenTestData = {unstructuredData: brokenUnstructuredData, structuredData: testStructuredData};

        component.setState({isModalOpen: true, isLoaded: true, data: brokenTestData},() => 
        {

            expect(toJson(component)).toMatchSnapshot();

            done();

        })

    })

    /*
        should render error message when sub-component fails 

    */
    afterAll(() =>
    {

        return new Promise(function(resolve,reject)
        {

            unfilterConsoleError();

            resolve();

        })

    });

})