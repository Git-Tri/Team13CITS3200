import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom'

import ReactTestUtils from 'react-dom/test-utils';


it('should render the app', () => {
  const router = document.createElement('BrowserRouter');
  ReactDOM.render(<App />, router);
  ReactDOM.unmountComponentAtNode(router);
});
