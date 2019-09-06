import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import PageHeader from './components/PageHeader'
import MatchList from './components/MatchList'
import { BrowserRouter } from 'react-router-dom'

import ReactTestUtils from 'react-dom/test-utils';


it('should render the app', () => {
  const router = document.createElement('BrowserRouter');
  ReactDOM.render(<App />, router);
  ReactDOM.unmountComponentAtNode(router);
});

it('should render the header', () => {
	const page = document.createElement('div');
	ReactDOM.render(<PageHeader />,page);
	ReactDOM.unmountComponentAtNode(page);
})

it('should render MatchList', () => {
	const page = document.createElement('div');
	ReactDOM.render(<MatchList />,page);
	ReactDOM.unmountComponentAtNode(page);
})