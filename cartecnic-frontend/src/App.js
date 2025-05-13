import React from 'react';
import CustomerForm from './components/CustomerForm';
import CustomerList from './components/CustomerList';
import './App.css';

function App() {
  return (
    <div className="App" style={{ padding: '30px', fontFamily: 'Arial' }}>
      <h1>🧾 Müşteri Takip Paneli</h1>

      <div style={{ marginBottom: '30px' }}>
        <h2>Yeni Müşteri Ekle</h2>
        <CustomerForm onSaved={() => window.location.reload()} />
      </div>

      <div>
        <h2>Müşteri Listesi</h2>
        <CustomerList />
      </div>
    </div>
  );
}

export default App;
