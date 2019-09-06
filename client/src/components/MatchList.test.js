import MatchList from "./MatchList";
import renderer from 'react-test-renderer';
import React from 'react';

import {shallow, mount} from "enzyme";
import { configure } from 'enzyme';



describe("Match List Tests",function() {
	test("Should render MatchList correctly",() => {
		let page = renderer.create(<MatchList />)
		expect(page.toJSON()).toMatchSnapshot();
	})


})