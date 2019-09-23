import MatchList from './match-list';
import renderer from 'react-test-renderer';
import React from 'react';
import {shallow, mount, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from "enzyme-to-json";

configure({ adapter: new Adapter() });

describe("Match List Tests",function() {
	let page;
	let mockSubmit;

	beforeEach(() => {
		mockSubmit = jest.fn();
		page = shallow(<MatchList submit={mockSubmit} />);
	});

	it("should match snapshot",() => {
		expect(page).toMatchSnapshot();
	})

	//More tests to come

})
