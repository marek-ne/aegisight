import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Updated mount point for embedded use
const rootId = 'aegisight-experience-root';
const rootElement = document.getElementById(rootId);

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.warn(`[Aegisight Scrolly] Target container #${rootId} not found.`);
}