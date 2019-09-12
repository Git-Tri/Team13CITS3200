import {EditForm} from "./EditForm";
import renderer from 'react-test-renderer';
import React from 'react';
import {Edit,StructuredData} from "../domain";
import {filterConsoleError,unfilterConsoleError} from "../TestUtils";
import {mount} from "enzyme";
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ErrorTester from "./ErrorTester"

configure({ adapter: new Adapter() });

describe("Edit Form Tests",function()
{
    
    const testData = new Edit(1,null,null,true,{},"apple","banna","replace")

    const badData =  new Edit(null,null,null,false,{},"","","")

    const saveDataMock = EditForm.prototype.saveData = jest.fn();

    const deleteDataMock = EditForm.prototype.deleteData = jest.fn();

    const loadDataMock = EditForm.prototype.loadData = jest.fn();

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

        saveDataMock.mockClear();

        deleteDataMock.mockClear();

    })

    test("Should throw error when given bad id",(done) => 
    {

        renderer.create(<ErrorTester              
                onError={(e,em) => {
                        expect(e.message).toEqual("Id must be a number"); 
                        done();}
                        }>
                    <EditForm id={"banna"} />
                </ErrorTester>
                );       

    });

    test("Should throw error when given bad data",(done) => 
    {

        renderer.create(<ErrorTester              
                onError={(e,em) => {
                        expect(e.message).toEqual("inputted data must be of type edit"); 
                        done();}
                        }>
                    <EditForm data={{EditId: 5, SomeOtherData: "banna"}} />
                </ErrorTester>
                );       

    });

    test("Should render correctly for new edit",() => 
    {        
                 
        let Component = renderer.create(<EditForm/>)

        expect(Component.toJSON()).toMatchSnapshot();

    })

    test("Should render viewing edit",() => 
    {        
                 
        let Component = renderer.create(<EditForm data={testData}/>)

        expect(Component.toJSON()).toMatchSnapshot();

    })

    test("Should render correctly for successful save",() => 
    {        
                 
        let Component = mount(<EditForm/>)

        Component.setState({isSaveSuccessful:true});

        expect(Component).toMatchSnapshot();

    })

    test("Should render correctly for error",() => 
    {        
                 
        let Component = mount(<EditForm/>)

        Component.setState({isError:true});

        expect(Component).toMatchSnapshot();

    })

    test("Should render correctly for missing data",() => 
    {        
                 
        let Component = mount(<EditForm/>)

        Component.setState({isMissing:true});

        expect(Component).toMatchSnapshot();

    })

    test("Should render correctly for saving new data",() => 
    {        
                 
        let Component = mount(<EditForm/>)

        Component.setState({isSaving:true});

        expect(Component).toMatchSnapshot();

    })

    test("Should render correctly for loading existing data",() => 
    {        
                 
        let Component = mount(<EditForm id={5}/>)

        expect(Component).toMatchSnapshot();

    })

    test("Should render validation errors",(done) =>
    {

        let Component = mount(<EditForm data={badData}/>)

        Component.setState({isSaveAttempted: true,
            isValid:{editID: false, 
                structuredDataID: false,
                unstructuredDataID: false,
                isCorpus: false,
                settings: {}, 
                replace: false,
                replaceWith: false,
                type: false}},() =>
        {
           
    
            expect(Component).toMatchSnapshot();

            done();

        })

    })

    test("Should render structured data selected",() => 
    {

        let structuredTestData = new Edit(1,1,null,false,{},"apple","banna","replace")

        let Component = renderer.create(<EditForm data={structuredTestData}/>)

        expect(Component.toJSON()).toMatchSnapshot();

    });

    test("Should render unstructured data selected",() => 
    {

        let unstructuredTestData = new Edit(1,null,1,false,{},"apple","banna","replace")

        let Component = renderer.create(<EditForm data={unstructuredTestData}/>)

        expect(Component.toJSON()).toMatchSnapshot();

    });

    test("Should handle change in data and render change",() => 
    {

        let Component = mount(<EditForm data={testData}/>)

        Component.instance().handleChange(null,{name:"replace",value:"bob"});

        expect(Component).toMatchSnapshot();

    });

    test("Should handle change in settings when change to replace",() => 
    {

        let replacewithTestData = new Edit(1,null,null,true,{field:"Player"},"apple","banna","replacewithfield")

        let Component = mount(<EditForm data={testData}/>)

        Component.instance().handleChange(null,{name:"replace",value:"bob"});

        expect(Component).toMatchSnapshot();

    });

    test("Should handle change in data settings and render change",() => 
    {

        const settingTestData = new Edit(1,null,null,true,{},"apple","banna","replacewithfield")

        let Component = mount(<EditForm data={settingTestData}/>)

        Component.instance().handleSettingChange(null,{name:"field",value:"Player"});

        expect(Component).toMatchSnapshot();

    });

    test("Should handle change of iscorpus and render change",() => 
    {

        const settingTestData = new Edit(1,null,null,true,{},"apple","banna","replacewithfield")

        let Component = mount(<EditForm data={settingTestData}/>)

        Component.instance().handleChecked(null);

        expect(Component).toMatchSnapshot();

    });

    test("Should handle change of iscorpus and render change",() => 
    {

        const testStructuredData = new StructuredData(1,new Date(),"some team","some away team",1,"some comp",{})

        let Component = mount(<EditForm data={testData}/>)

        Component.instance().handleChosenData(testStructuredData)

        expect(Component).toMatchSnapshot();

    });

    test("should call load data when component renders with passed in ID",function()
    {
        
        mount(<EditForm id={1}/>);

        expect(loadDataMock).toHaveBeenCalledTimes(1);

    });

    test("should call save data when save button is clicked",function()
    {
        
        let component = mount(<EditForm/>);

        component.find("Button")
            .findWhere((b) => b.text()
            .includes("Save"))
            .first()
            .simulate("click")

        expect(saveDataMock).toHaveBeenCalledTimes(1);

    });

    test("should call delete data when delete button is clicked",function()
    {
        
        let component = mount(<EditForm data={testData}/>);

        component.find("Button")
            .findWhere((b) => b.text()
            .includes("Delete"))
            .first()
            .simulate("click")

        expect(deleteDataMock).toHaveBeenCalledTimes(1);

    });



    afterAll(() =>
    {

        return new Promise(function(resolve,reject)
        {

            unfilterConsoleError();

            resolve();

        })

    });

})