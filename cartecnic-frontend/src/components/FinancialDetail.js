import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaPlus } from 'react-icons/fa';
import { MdSave } from 'react-icons/md';

const FinancialDetail = ({ selectedOperation, setSelectedOperation, page, refreshList }) => {
  const [finance, setFinance] = useState({
    customerId: '',
    paymentType: 'Nakit',
    paymentAmount: 0
  });

  useEffect(() => {
    if (selectedOperation) {
      setFinance({
        customerId: selectedOperation.customerId || '',
        paymentType: selectedOperation.paymentType || 'Nakit',
        paymentAmount: selectedOperation.paymentAmount || 0
      });
    } else {
      setFinance({ customerId: '', paymentType: 'Nakit', paymentAmount: 0 });
    }
  }, [selectedOperation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFinance((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await api.post('/Financial', finance);

      setFinance({ customerId: '', paymentType: 'Nakit', paymentAmount: 0 });
      setSelectedOperation(null);
      refreshList(page);
    } catch (err) {
      alert('Ödeme kaydında hata oluştu!');
      console.error(err);
    }
  };

  const handleClear = () => {
    setFinance({ customerId: '', paymentType: 'Nakit', paymentAmount: 0 });
    setSelectedOperation(null);
  };

  // ✅ Stiller
  const inputStyle = {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
    boxSizing: 'border-box',
    marginBottom: '10px'
  };

  const labelStyle = {
    fontWeight: '600',
    marginBottom: '4px',
    display: 'block',
    fontSize: '14px'
  };

  const buttonStyle = {
    backgroundColor: 'green',
    border: 'none',
    padding: '6px 8px',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  return (
    <div className="box" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h3>Finansal Bilgiler</h3>

      <div style={{ flexGrow: 1 }}>
        <label style={labelStyle}>Müşteri ID:</label>
        <input name="customerId" value={finance.customerId} onChange={handleChange} style={inputStyle} />

        <label style={labelStyle}>Ödeme Türü:</label>
        <select name="paymentType" value={finance.paymentType} onChange={handleChange} style={inputStyle}>
          <option value="Nakit">Nakit</option>
          <option value="Kredi">Kredi</option>
          <option value="Havale">Havale</option>
        </select>

        <label style={labelStyle}>Ödeme Tutarı (TL):</label>
        <input
          type="number"
          name="paymentAmount"
          value={finance.paymentAmount}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'start' }}>
        <button onClick={handleClear} style={buttonStyle}><FaPlus size={14} color="white" /></button>
        <button onClick={handleSave} style={buttonStyle}><MdSave size={16} color="white" /></button>
      </div>
    </div>
  );
};

export default FinancialDetail;
