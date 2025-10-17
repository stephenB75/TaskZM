import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/mobile.css'

// Import Capacitor
import { Capacitor } from '@capacitor/core';

// Add mobile-specific class to body
if (Capacitor.isNativePlatform()) {
  document.body.classList.add('mobile-app');
  document.documentElement.classList.add('mobile-app');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)