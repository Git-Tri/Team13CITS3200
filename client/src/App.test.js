import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import PageHeader from './components/PageHeader'
import MatchList from './components/MatchList'
import { BrowserRouter } from 'react-router-dom'
import { act, Simulate } from 'react-dom/test-utils'

it('should render the app', () => {
  const router = document.createElement('BrowserRouter');
  ReactDOM.render(<App />, router);
  ReactDOM.unmountComponentAtNode(router);
});

it('should render the header', () => {
	const div = document.createElement('div');
	ReactDOM.render(<PageHeader />,div);
	ReactDOM.unmountComponentAtNode(div);
})

it('should render MatchList', () => {
	const div = document.createElement('div');
	ReactDOM.render(<MatchList />,div);
	ReactDOM.unmountComponentAtNode(div);
})

// it('check MatchList user inputs',() => {
//     const div = document.createElement('div');
// 	act(() => {
// 		ReactDOM.render(<MatchList/>,div);
// 	});
// 	Simulate('handleChange', { target: {searchtext: 'Text'} });
// 	expect(onChange).toHaveBeenCalledWith('Text');
// 	ReactDOM.unmountComponentAtNode(div);
// })