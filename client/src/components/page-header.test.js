import PageHeader from "./PageHeader";
import renderer from 'react-test-renderer';
import React from 'react';
import ErrorTester from "./ErrorTester";
import { shallow, mount } from "enzyme";
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

describe("PageHeader Tests",function()
{   

    beforeAll(() =>
        {
            return new Promise(function(resolve,reject)
            {
                filterConsoleError();               
                resolve();
            })
        });

    test("should render correctly",() => 
    {
        var mockSidebarClick = jest.fn()
        let wrapper = shallow(<PageHeader
                                header={"Match List"}
                                sidebarVisible={true}
                                handleSidebarClick={mockSidebarClick}
                            />)
        expect(wrapper).toMatchSnapshot();
    })

    test("should render correctly with isbackable",() => 
    {
        var mockSidebarClick = jest.fn()
        let wrapper = shallow(<PageHeader
                                header={"Match List"}
                                sidebarVisible={true}
                                handleSidebarClick={mockSidebarClick}
                                isbackable={true}
                            />)
        expect(wrapper).toMatchSnapshot();
    })

    test("should render correctly with content",() => 
    {
        var mockSidebarClick = jest.fn()
        let wrapper = shallow(<PageHeader
                                header={"Match List"}
                                sidebarVisible={true}
                                handleSidebarClick={mockSidebarClick}
                            >
                                <div>Sample content</div>
                            </PageHeader>
                        )
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
