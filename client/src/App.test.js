import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom'

it('renders without crashing', () => {
  const router = document.createElement('BrowserRouter');
  ReactDOM.render(<App />, router);
  ReactDOM.unmountComponentAtNode(router);
});
