import React, { useState, useCallback } from 'react';
import './App.css';

import SearchBar from './components/SearchBar';
import CustomerList from './components/CustomerList';
import CustomerDetail from './components/CustomerDetail';
import VehicleDetail from './components/VehicleDetail';
import FinancialDetail from './components/FinancialDetail';
import ComplaintDetail from './components/ComplaintDetail';
import api from './services/api';

function App() {
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const refreshList = () => {
    // Burada başka işlemler yapılacaksa bırakılabilir
  };

  const handleSearch = useCallback(async (text) => {
    try {
      const res = await api.get(`/Transaction/search?q=${text}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error('Arama hatası:', err);
    }
  }, []);

  const handleCustomerSelect = async (customerId) => {
    try {
      const res = await api.get(`/Customer/filter-by-customer/${customerId}`);
      setFilteredCustomers(res.data);
    } catch (err) {
      console.error("Müşteri filtreleme hatası:", err);
    }
  };

  return (
    <div className="App">
      <div className="top-section">
        <SearchBar
          onSearch={handleSearch}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          setShowPopup={() => {}} // Eğer kullanılmıyorsa boş fonksiyonla geçilir
          onCustomerSelect={(id) => {
            setSearchQuery('');
            handleCustomerSelect(id);
          }}
          onEnterSearch={(query) => {
            setSearchQuery(query);
            setFilteredCustomers([]);
          }}
        />
      </div>

      <div className="layout-container">
        <div className="left-section">
          <CustomerList
            setSelectedOperation={setSelectedOperation}
            filteredCustomers={filteredCustomers}
            setFilteredCustomers={setFilteredCustomers}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>

        <div className="main-grid">
          <div className="grid-item">
            <CustomerDetail
              selectedOperation={selectedOperation}
              setSelectedOperation={setSelectedOperation}
              page={1}
              refreshList={refreshList}
            />
          </div>
          <div className="grid-item">
            <VehicleDetail
              selectedOperation={selectedOperation}
              setSelectedOperation={setSelectedOperation}
              page={1}
              refreshList={refreshList}
            />
          </div>
          <div className="grid-item">
            <FinancialDetail
              selectedOperation={selectedOperation}
              setSelectedOperation={setSelectedOperation}
              page={1}
              refreshList={refreshList}
            />
          </div>
          <div className="grid-item">
            <ComplaintDetail
              selectedOperation={selectedOperation}
              setSelectedOperation={setSelectedOperation}
              page={1}
              refreshList={refreshList}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
