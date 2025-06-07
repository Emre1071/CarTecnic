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
  const [searchText, setSearchText] = useState('');
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [page, setPage] = useState(1);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const refreshList = () => {
    setRefreshFlag(!refreshFlag);
  };

  // 🔒 useCallback ile fonksiyonu sabitle
  const handleSearch = useCallback(async (text) => {
    try {
      const res = await api.get(`/Transaction/search?q=${text}`);
      setSearchResults(res.data);
      setShowPopup(true);
    } catch (err) {
      console.error('Arama hatası:', err);
    }
  }, []);

  const handleCustomerSelect = async (customerId) => {
    try {
      const res = await api.get(`/Customer/filter-by-customer/${customerId}`);
      setFilteredCustomers(res.data); // 🔁 CustomerList'e props olarak geç!
    } catch (err) {
      console.error("Müşteri filtreleme hatası:", err);
    }
  };



  return (
    <div className="App">
      {/* 🔍 Arama Alanı */}
      <div className="top-section">
        <SearchBar
          onSearch={handleSearch}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          setShowPopup={setShowPopup}
          onCustomerSelect={(id) => {
            setSearchQuery(''); // 🔁 Sayfalı aramayı sıfırla
            handleCustomerSelect(id);
          }}
          onEnterSearch={(query) => {
            setSearchQuery(query);          // sayfalı arama başlat
            setFilteredCustomers([]);      // eski veriyi sil
          }}
        />

      </div>

      {/* 📄 Ana İçerik */}
      <div className="layout-container">
        <div className="left-section">
          <CustomerList
            setSelectedOperation={setSelectedOperation}
            filteredCustomers={filteredCustomers}
            setFilteredCustomers={setFilteredCustomers}
            searchQuery={searchQuery}
          />
        </div>

        <div className="main-grid">
          <div className="grid-item">
            <CustomerDetail
              selectedOperation={selectedOperation}
              setSelectedOperation={setSelectedOperation}
              page={page}
              refreshList={refreshList}
            />
          </div>
          <div className="grid-item">
            <VehicleDetail
              selectedOperation={selectedOperation}
              setSelectedOperation={setSelectedOperation}
              page={page}
              refreshList={refreshList}
            />
          </div>
          <div className="grid-item">
            <FinancialDetail
              selectedOperation={selectedOperation}
              setSelectedOperation={setSelectedOperation}
              page={page}
              refreshList={refreshList}
            />
          </div>
          <div className="grid-item">
            <ComplaintDetail
              selectedOperation={selectedOperation}
              setSelectedOperation={setSelectedOperation}
              page={page}
              refreshList={refreshList}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
