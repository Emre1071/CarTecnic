import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Main from './Main'; // 🔁 App yerine artık Main kullanıyoruz
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);

reportWebVitals();
