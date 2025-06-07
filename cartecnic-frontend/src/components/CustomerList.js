import React, { useEffect, useState } from 'react';
import api from '../services/api';

const pageSize = 20; // Sayfa başına gösterilecek kayıt

const CustomerList = ({ setSelectedOperation, filteredCustomers = [], setFilteredCustomers, searchQuery, setSearchQuery }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedFormNo, setSelectedFormNo] = useState(null);

  useEffect(() => {
    fetchCustomers(); // her aramada ve sayfa değişiminde çalışsın
  }, [currentPage, searchQuery]);

  const fetchCustomers = async () => {
    try {
      const url = `/Transaction/pagedSearch?q=${encodeURIComponent(searchQuery)}&page=${currentPage}`;
      const res = await api.get(url);
      setFilteredCustomers(res.data);
    } catch (err) {
      console.error('Veri alınamadı:', err);
    }
  };



  const clearFilters = () => {
    setSelectedStatus('');
    setSelectedBranch('');
    setSearchQuery(''); // ✅ arama temizlensin
    setFilteredCustomers([]);
    setCurrentPage(1); // başa dön
  };
  const paginatedData = filteredCustomers; // Zaten sayfalı geliyor

  const nextPage = () => {
    setCurrentPage(currentPage + 1); // Backend sayfalama yapıyor, kontrol orada
  };


  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
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

  const handleSelectTransaction = async (formNo) => {
    try {
      setSelectedFormNo(formNo); // Seçili satırı güncelle
      const res = await api.get(`/Transaction/${formNo}`);
      // API'den gelen veriyi tablolara uygun formata dönüştür
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

      {/* LİSTE KUTUSU */}
      <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '6px', flex: '1 0 auto', overflow: 'hidden' }}>
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
