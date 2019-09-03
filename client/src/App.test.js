import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import PageHeader from './components/PageHeader'
import MatchList from './components/MatchList'
import { BrowserRouter } from 'react-router-dom'

it('app render', () => {
  const router = document.createElement('BrowserRouter');
  ReactDOM.render(<App />, router);
  ReactDOM.unmountComponentAtNode(router);
});

it('header renders', () => {
	const div = document.createElement('div');
	ReactDOM.render(<PageHeader />,div);
	ReactDOM.unmountComponentAtNode(div);
})

it('MatchList renders', () => {
	const div = document.createElement('div');
	ReactDOM.render(<MatchList />,div);
	ReactDOM.unmountComponentAtNode(div);
})