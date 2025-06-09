import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FaPlus } from 'react-icons/fa';
import { MdSave } from 'react-icons/md';

const FinancialDetail = ({ selectedOperation, refreshList, page }) => {
  const [totalDebt, setTotalDebt] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    if (selectedOperation && selectedOperation.customerId) {
      fetchFinancials(selectedOperation.customerId);
    }
  }, [selectedOperation]);

  const fetchFinancials = async (customerId) => {
    try {
      const debtRes = await api.get(`/Finance/total-debt/${customerId}`);
      const paidRes = await api.get(`/Finance/total-paid/${customerId}`);
      setTotalDebt(debtRes.data.total || 0);
      setTotalPaid(paidRes.data.total || 0);
    } catch (err) {
      console.error('Finansal veriler alınamadı', err);
    }
  };

  const handleSavePayment = async () => {
    if (!paymentAmount || !paymentType) {
      alert("Ödeme tutarı ve türü boş bırakılamaz.");
      return;
    }

    try {
      await api.post('/Finance/payment', {
        customerId: selectedOperation.customerId,
        amount: parseFloat(paymentAmount),
        type: paymentType
      });

      setPaymentAmount('');
      setPaymentType('');
      setShowPaymentForm(false); // ✅ form gizlenir
      fetchFinancials(selectedOperation.customerId);
      refreshList(page);
    } catch (err) {
      console.error('Ödeme kaydedilemedi:', err);
      alert("Ödeme sırasında hata oluştu.");
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc'
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
        <label style={labelStyle}>Toplam Borç (TL):</label>
        <input value={totalDebt} readOnly style={inputStyle} />

        <label style={labelStyle}>Toplam Ödeme (TL):</label>
        <input value={totalPaid} readOnly style={inputStyle} />

        <label style={labelStyle}>Kalan Borç (TL):</label>
        <input value={totalDebt - totalPaid} readOnly style={inputStyle} />

        {showPaymentForm && (
          <>
            <label style={labelStyle}>Ödeme Tutarı (TL):</label>
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              style={inputStyle}
            />

            <label style={labelStyle}>Ödeme Türü:</label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              style={inputStyle}
            >
              <option value="">Seçiniz</option>
              <option value="Nakit">Nakit</option>
              <option value="Kredi Kartı">Kredi Kartı</option>
              <option value="Havale">Havale</option>
            </select>
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setShowPaymentForm(true)}
          style={buttonStyle}
        >
          <FaPlus size={14} color="white" />
        </button>
        {showPaymentForm && (
          <button
            onClick={handleSavePayment}
            style={buttonStyle}
          >
            <MdSave size={16} color="white" />
          </button>
        )}
      </div>
    </div>
  );
};

export default FinancialDetail;
