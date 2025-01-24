import React from 'react';
import ReactDOM from 'react-dom/client'; // Import 'createRoot' from 'react-dom/client'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { sendToVercelAnalytics } from './vitals';
import { BrowserRouter } from 'react-router-dom';

// Create a root element and render the app with createRoot
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals(sendToVercelAnalytics);
