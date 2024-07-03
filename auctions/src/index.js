import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import reportWebVitals from './reportWebVitals';
import {ThirdwebProvider} from '@thirdweb-dev/react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThirdwebProvider activeChain={'sepolia'} clientId='753433ff61cbbe5ee9a161ead8aa0cbd'>
    <App/>
  </ThirdwebProvider>
);

reportWebVitals();
