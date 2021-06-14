import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import RedirectPathContextProvider from './context/redirect-path';

/*Import Global CSS*/
import './globalCSS/index.css';
import './globalCSS/colors+shadows.css';
import './globalCSS/type.css';
import './globalCSS/layout.css';


ReactDOM.render(
  <RedirectPathContextProvider>
    <App />
  </RedirectPathContextProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
