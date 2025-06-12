import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';

const CustomerList = ({ setSelectedOperation, filteredCustomers = [], setFilteredCustomers, searchQuery, setSearchQuery, refreshFlag }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedFormNo, setSelectedFormNo] = useState(null);

  const fetchCustomers = useCallback(async () => {
    try {
      const url = `/Transaction/pagedSearch?q=${encodeURIComponent(searchQuery)}&page=${currentPage}&status=${encodeURIComponent(selectedStatus)}&branch=${encodeURIComponent(selectedBranch)}`;
      const res = await api.get(url);
      setFilteredCustomers(res.data);
    } catch (err) {
      console.error('Veri alınamadı:', err);
    }
  }, [currentPage, searchQuery, selectedStatus, selectedBranch, setFilteredCustomers]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers, refreshFlag]);

  const clearFilters = () => {
  if (searchQuery.trim() !== '') {
    // 🔁 sadece arama yapılmışsa veriyi geri getir
    setSearchQuery('');
    setFilteredCustomers([]);
    setCurrentPage(1);
  }

  setSelectedStatus('');
  setSelectedBranch('');
};


  const handleSelectTransaction = async (formNo) => {
    try {
      setSelectedFormNo(formNo);
      const res = await api.get(`/Transaction/${formNo}`);
      const formattedData = {
        customer: {
          name: res.data.ad,
          surname: res.data.soyad,
          tel: res.data.telefon,
          homeTel: res.data.evTel,
          mail: res.data.mail,
          customerId: res.data.customerId
        },
        product: {
          plate: res.data.plaka,
          brand: res.data.marka,
          type: res.data.tip,
          model: res.data.model
        },
        status: res.data.status,
        problem: res.data.problem,             
        result: res.data.result,           
        price: res.data.price,       
        department: res.data.department,
        workerName: res.data.workerName,
        customerId: res.data.customerId,
        formNo: res.data.formNo
      };

      setSelectedOperation(formattedData);
    } catch (error) {
      console.error("İşlem detayları alınamadı:", error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '6px', flex: '1 0 auto', overflow: 'hidden' }}>
        <table width="100%" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>Form No</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Surname</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Price</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((c, index) => (
              <tr
                key={c.formNo || index}
                onClick={() => handleSelectTransaction(c.formNo)}
                style={{
                  cursor: 'pointer',
                  ...tdStyle,
                  backgroundColor: selectedFormNo === c.formNo ? '#90EE90' : 'transparent'
                }}
              >
                <td style={tdStyle}>{c.formNo}</td>
                <td style={tdStyle}>{c.ad}</td>
                <td style={tdStyle}>{c.soyad}</td>
                <td style={tdStyle}>{c.telefon}</td>
                <td style={tdStyle}>{c.kategori || '-'}</td>
                <td style={tdStyle}>{c.ucret || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '20px', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>◀</button>
          <div style={{ backgroundColor: '#4CAF50', color: 'white', padding: '6px 16px', borderRadius: '4px', fontWeight: 'bold' }}>
            Page: {currentPage}
          </div>
          <button onClick={() => setCurrentPage(currentPage + 1)}>▶</button>
        </div>

        <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="green-select">
            <option value="">Durum Seç</option>
            <option value="Başlamadı">Başlamadı</option>
            <option value="İşlemde">İşlemde</option>
            <option value="İade Edildi">İade Edildi</option>
            <option value="Tamamlandı">Tamamlandı</option>
            <option value="Teslim Edildi">Teslim Edildi</option>
          </select>

          <button onClick={clearFilters} className="green-button">Clear Filters</button>

          <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)} className="green-select">
            <option value="">Şube Seç</option>
            <option value="Dükkan">Dükkan</option>
            <option value="Şube 1">Şube 1</option>
            <option value="Şube 2">Şube 2</option>
            <option value="Şube 3">Şube 3</option>
            <option value="Şube 4">Şube 4</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const thStyle = {
  padding: '8px',
  border: '1px solid #ddd',
  textAlign: 'left',
  backgroundColor: '#4CAF50',
  color: 'white'
};

const tdStyle = {
  padding: '8px',
  border: '1px solid #ddd',
};

export default CustomerList;
