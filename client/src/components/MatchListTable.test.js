import MatchListTable from "./MatchListTable";
import renderer from 'react-test-renderer';
import React from 'react';
import ErrorTester from "./ErrorTester";
import {Match} from "../domain";
import {filterConsoleError,unfilterConsoleError} from "../TestUtils";
import {shallow, mount} from "enzyme";
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

describe("Match List Table Tests",function()
{

    beforeAll(() =>
        {
            return new Promise(function(resolve,reject)
            {
                filterConsoleError();
                resolve();
            })
        });
    
    const testMatchList = [
            new Match(1,new Date("1991-04-20T00:00:00.000Z"),"team A","team B",1,"comp A"),
            new Match(2,new Date("1991-04-20T00:00:00.000Z"),"team C","test D",1,"comp B")
        ];
    
    test("Should throw error when given undefined items",(done) => 
    {
    renderer.create(<ErrorTester              
             onError={(e,em) => {
                    expect(e.message).toEqual("Props.items should contain a list of match data"); 
                    done();}
                    }>
                 <MatchListTable ></MatchListTable>
             </ErrorTester>
            );       
    });
    test("Should throw error when given non-array items",(done) => 
    {
        renderer.create(<ErrorTester              
            onError={(e,em) => {
                   expect(e.message).toEqual("Props.items should contain a list of match data"); 
                   done();}
                   }>
                <MatchListTable items={"not an item"}></MatchListTable>
            </ErrorTester>
           );       
    });
    test("Should throw error when one item is undefined",(done) => 
    {
        let missingItemData = testMatchList.slice();
        missingItemData.push(undefined);
        renderer.create(<ErrorTester              
            onError={(e,em) => {
                   expect(e.message).toEqual("props.data must be an instance of match data"); 
                   done();}
                   }>
                <MatchListTable items={missingItemData}></MatchListTable>
            </ErrorTester>
           );       
    });

    test("Should throw error when item id wrong type",(done) => 
    {
        let wrongIDItemData = testMatchList.slice();
        wrongIDItemData.push(new Match("not an id",new Date(),"some team","some other team",1,"some comp",{}));
        renderer.create(<ErrorTester              
            onError={(e,em) => {
                   expect(e.message).toEqual("every piece of data should have valid date, home, away, comp name"); 
                   done();}
                   }>
                <MatchListTable items={wrongIDItemData}></MatchListTable>
            </ErrorTester>
           );       
    });

    test("Should render correctly for correct input",() => 
    {        
                 
        let Component = renderer.create(<MatchListTable items={testMatchList.slice()}/>)
        expect(Component.toJSON()).toMatchSnapshot();
    })

    test("Should render correctly for correct input with onSelect handler",() => 
    {        
        
        let Component = renderer.create(<MatchListTable onSelect={() => {}} items={testMatchList.slice()}/>)
        expect(Component.toJSON()).toMatchSnapshot();
    })

    test("Should call callback when onselect is trigerred",(done) => 
    {
        let wrapper = mount(<MatchListTable onSelect={() => done()} items={testMatchList.slice()}/>)
        wrapper.state().selectFunc(testMatchList[0]);

    })

    test("Should render correctly with selected row",() => 
    {
        let wrapper = shallow(<MatchListTable onSelect={() => {}} items={testMatchList.slice()}/>)
        wrapper.state().selectFunc(testMatchList[0]);
        expect(wrapper).toMatchSnapshot();

    })

    test("Should render correctly for correct with no data",() => 
    {        
        
        let Component = renderer.create(<MatchListTable onSelect={() => {}} items={[]}/>)
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
