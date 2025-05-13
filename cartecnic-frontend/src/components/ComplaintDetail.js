import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaPlus } from 'react-icons/fa';
import { MdSave } from 'react-icons/md';

const ComplaintDetail = ({ selectedOperation, setSelectedOperation, page, refreshList }) => {
  const [complaint, setComplaint] = useState({
    status: '',
    branch: '',
    fault: '',
    result: '',
    processCost: 0
  });

  const statusOptions = ['Başlamadı', 'İşlemde', 'İade Edildi', 'Tamamlandı'];

  useEffect(() => {
    if (selectedOperation) {
      setComplaint({
        status: selectedOperation.status || '',
        branch: selectedOperation.branch || '',
        fault: selectedOperation.fault || '',
        result: selectedOperation.result || '',
        processCost: selectedOperation.processCost || 0
      });
    } else {
      setComplaint({ status: '', branch: '', fault: '', result: '', processCost: 0 });
    }
  }, [selectedOperation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComplaint(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (selectedOperation) {
        await api.put(`/Operation/${selectedOperation.operationId}`, { ...selectedOperation, ...complaint });
      } else {
        alert('Lütfen önce müşteri ve ürün seçin.');
        return;
      }

      setComplaint({ status: '', branch: '', fault: '', result: '', processCost: 0 });
      setSelectedOperation(null);
      refreshList(page);
    } catch (err) {
      console.error('Kayıt sırasında hata:', err);
      alert('Kayıt sırasında hata oluştu.');
    }
  };

  const handleClear = () => {
    setComplaint({ status: '', branch: '', fault: '', result: '', processCost: 0 });
    setSelectedOperation(null);
  };

  const buttonStyle = {
    backgroundColor: 'green',
    border: 'none',
    padding: '8px',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  return (
    <div className="box">
      <h3>Şikayet Bilgileri</h3>

      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ flex: 1 }}>
          <label>Durum:</label>
          <select name="status" value={complaint.status} onChange={handleChange}>
            {statusOptions.map((opt, idx) => (
              <option key={idx} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1 }}>
          <label>Şube:</label>
          <select name="branch" value={complaint.branch} onChange={handleChange}>
            <option value="Dükkan">Dükkan</option>
            <option value="Şube 1">Şube 1</option>
            <option value="Şube 2">Şube 2</option>
            <option value="Şube 3">Şube 3</option>
            <option value="Şube 4">Şube 4</option>
          </select>
        </div>
      </div>

      <div>
        <label>Arıza Açıklaması:</label>
        <input type="text" name="fault" value={complaint.fault} onChange={handleChange} />
      </div>

      <div>
        <label>Sonuç:</label>
        <input type="text" name="result" value={complaint.result} onChange={handleChange} />
      </div>

      <div>
        <label>Ücret (TL):</label>
        <input type="number" name="processCost" value={complaint.processCost} onChange={handleChange} />
      </div>

      <div style={{ marginTop: '10px', display: 'flex', gap: '12px' }}>
        <button onClick={handleClear} style={buttonStyle}><FaPlus size={16} color="white" /></button>
        <button onClick={handleSave} style={buttonStyle}><MdSave size={20} color="white" /></button>
      </div>
    </div>
  );
};

export default ComplaintDetail;
