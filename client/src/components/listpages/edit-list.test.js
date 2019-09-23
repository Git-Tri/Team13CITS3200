import {EditList} from "./edit-list";
import renderer from 'react-test-renderer';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import {Edit,StructuredData,UnstructuredData} from "../../domain";
import {filterConsoleError,unfilterConsoleError,createTestMemoryWrapper} from "../../TestUtils";
import {shallow, mount} from "enzyme";
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from "enzyme-to-json";
import PageHeader from "../PageHeader";


configure({ adapter: new Adapter() });

describe("Edit List Tests",function()
{

    const testData = [new Edit(1,1,null,false,{},"apple","banna","replace"),
        new Edit(2,null,1,false,{},"football","soccer","replace"),
        new Edit(3,1,null,false,{field:"player"},"gary jones","player 1","replacewithfield"),
        new Edit(4,null,null,true,{},"reece","ryan","replace")]

    const targets = [new StructuredData(1,new Date("1991-04-20T00:00:00.000Z"),"some team","some other team",1,"some comp",{}),
        new UnstructuredData(1,1,"some title","some author","some url",new Date("1991-04-20T00:00:00.000Z"),new Date("1991-04-20T00:00:00.000Z"),"some data"),
        new StructuredData(1,new Date("1991-04-20T00:00:00.000Z"),"some team","some other team",1,"some comp",{}),
        undefined]

    const loadDataMock = EditList.prototype.loadData = jest.fn();

    const routeMock = EditList.prototype.routeToEdit = jest.fn();

    beforeAll(() =>
        {

            return new Promise(function(resolve,reject)
            {

                filterConsoleError();               

                resolve();

            })

        });

    afterEach(() => 
    {

        loadDataMock.mockClear();

        routeMock.mockClear();

    })

    test("should render correctly on first load",function()
    {

        expect(renderer.create(createTestMemoryWrapper(() => (<EditList></EditList>)))
            .toJSON())
            .toMatchSnapshot();

    });

    test("should call load data when component renders",function()
    {
        
        mount(createTestMemoryWrapper(() => (<EditList></EditList>)));

        expect(loadDataMock).toHaveBeenCalledTimes(1);

    });

    test("should call route on selection",function()
    {

        let component = mount(createTestMemoryWrapper(() => (<EditList></EditList>)));

        component.find(EditList).instance().routeToEdit();
        
        expect(routeMock).toHaveBeenCalledTimes(1);

    });

    test("should render Error correctly",function(done)
    {

        let component = mount(createTestMemoryWrapper(() => (<EditList></EditList>)));

        component.setState({isError: true},() => 
        {

            expect(toJson(component)).toMatchSnapshot();

            done();

        })


    });

    test.only("should render loaded data correctly",function(done)
    {

        let component = mount(createTestMemoryWrapper(() => (<EditList></EditList>)));

        component.find(EditList).setState({isLoaded: true, data: testData,target: targets},() => 
        {

            expect(toJson(component.find(EditList))).toMatchSnapshot();

            done();

        })


    });

    test("should call route function when click on cell",function(done)
    {
        
        let component = mount(createTestMemoryWrapper(() => (<EditList></EditList>)));

        component.find(EditList).setState({isLoaded: true, data: testData,target: targets},() => 
        {

            component.find(EditList).find("EditRow").first().simulate("click");

            expect(routeMock).toHaveBeenCalledTimes(1);  

            done();

        })



    });

    test("should render loading correctly",function()
    {

        let component = mount(createTestMemoryWrapper(() => (<EditList></EditList>)));
     
        expect(toJson(component)).toMatchSnapshot();   

    });
  

    test("should render error message when sub-component fails",function(done)
    {

        
        let component = mount(createTestMemoryWrapper(() => (<EditList></EditList>)));

        let brokenData = testData.slice();

        brokenData.push(undefined);

        component.setState({isLoaded: true, data: brokenData},() => 
        {

            expect(toJson(component)).toMatchSnapshot();

            done();

        })

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