import React, { useState } from 'react';
import './App.css';

import SearchBar from './components/SearchBar';
import CustomerList from './components/CustomerList';
import CustomerDetail from './components/CustomerDetail';
import VehicleDetail from './components/VehicleDetail';
import FinancialDetail from './components/FinancialDetail';
import ComplaintDetail from './components/ComplaintDetail';

function App() {
  const [searchText, setSearchText] = useState('');
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [page, setPage] = useState(1);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const refreshList = () => {
    setRefreshFlag(!refreshFlag);
  };

  return (
    <div className="App">
      {/* 🔍 Arama Alanı */}
      <div className="top-section">
        <SearchBar searchText={searchText} onChange={setSearchText} />
      </div>

      {/* 📄 Ana İçerik: Sol Liste + Sağ Formlar */}
      <div className="layout-container">
        <div className="left-section">
          <CustomerList
            searchText={searchText}
            setSelectedOperation={setSelectedOperation}
            refreshFlag={refreshFlag}
            page={page}
            setPage={setPage}
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
