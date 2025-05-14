import React, { useEffect, useState } from 'react';
import api from '../services/api';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');

  const itemsPerPage = 10;

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customer');
      setCustomers(res.data);
      setFilteredCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const clearFilters = () => {
    setSelectedStatus('');
    setSelectedBranch('');
    setFilteredCustomers(customers);
  };

  const paginatedData = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredCustomers.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      {/* LİSTE KUTUSU */}
      <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '6px', flex: '1 0 auto' }}>
        {/* TABLO */}
        <table width="100%" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>Form No</th>
              <th style={thStyle}>Ad</th>
              <th style={thStyle}>Soyad</th>
              <th style={thStyle}>Telefon</th>
              <th style={thStyle}>Kategori</th>
              <th style={thStyle}>Ücret</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((c, index) => (
              <tr key={c.customerId || index}>
                <td style={tdStyle}>{c.formNo || '-'}</td>
                <td style={tdStyle}>{c.name}</td>
                <td style={tdStyle}>{c.surname}</td>
                <td style={tdStyle}>{c.tel}</td>
                <td style={tdStyle}>{c.category || '-'}</td>
                <td style={tdStyle}>{c.price ? `${c.price} TL` : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SAYFA & FİLTRE BUTONLARI */}
      <div style={{ marginTop: '20px', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          <button onClick={prevPage} style={{ backgroundColor: 'green', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '4px' }}>
            ◀
          </button>
          <div style={{ backgroundColor: '#4CAF50', color: 'white', padding: '6px 16px', borderRadius: '4px', fontWeight: 'bold' }}>
            Sayfa: {currentPage}
          </div>
          <button onClick={nextPage} style={{ backgroundColor: 'green', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '4px' }}>
            ▶
          </button>
        </div>

        <div style={{
          marginTop: '15px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc', width: '150px' }}
          >
            <option value="">Durum Seç</option>
            <option value="Başlamadı">Başlamadı</option>
            <option value="Devam Ediyor">Devam Ediyor</option>
            <option value="Tamamlandı">Tamamlandı</option>
          </select>

          <button
            onClick={clearFilters}
            style={{
              backgroundColor: 'green',
              color: 'white',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '4px',
              width: '150px'
            }}
          >
            Filtreyi Temizle
          </button>

          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc', width: '150px' }}
          >
            <option value="">Şube Seç</option>
            <option value="Dükkan">Dükkan</option>
            <option value="Servis">Servis</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
