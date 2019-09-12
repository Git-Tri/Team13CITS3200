import MatchList from './MatchList';
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

	it("should call handleChange on searchtext", () => {
		const mockEvent = {
			target: {
				name: 'searchtext',
				value: "Sample text"
			}
		};
		const expected = {
			searchtext: "Sample text",
			startdate: '0000-00-00',
			enddate: '0000-00-00',
			competition: ''
		};
		page.instance().handleChange(mockEvent);
		expect(page.state()).toEqual(expected);
	});

})
