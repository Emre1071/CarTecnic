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

  const buttonStyle = {
    backgroundColor: 'green',
    border: 'none',
    padding: '8px',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  return (
    <div className="box">
      <h3>Finansal Bilgiler</h3>

      <div>
        <label>Müşteri ID:</label>
        <input name="customerId" value={finance.customerId} onChange={handleChange} />
      </div>

      <div>
        <label>Ödeme Türü:</label>
        <select name="paymentType" value={finance.paymentType} onChange={handleChange}>
          <option value="Nakit">Nakit</option>
          <option value="Kredi">Kredi</option>
          <option value="Havale">Havale</option>
        </select>
      </div>

      <div>
        <label>Ödeme Tutarı (TL):</label>
        <input type="number" name="paymentAmount" value={finance.paymentAmount} onChange={handleChange} />
      </div>

      <div style={{ marginTop: '10px', display: 'flex', gap: '12px' }}>
        <button onClick={handleClear} style={buttonStyle}><FaPlus size={16} color="white" /></button>
        <button onClick={handleSave} style={buttonStyle}><MdSave size={20} color="white" /></button>
      </div>
    </div>
  );
};

export default FinancialDetail;
