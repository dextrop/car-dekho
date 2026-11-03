import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '@carcompare/ui';
import '@carcompare/ui/styles.css';
import './app.css';
import { CompareProvider } from './store/compare.jsx';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <CompareProvider>
          <App />
        </CompareProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);
