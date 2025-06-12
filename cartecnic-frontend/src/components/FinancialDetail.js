import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import api from '../services/api';
import { FaPlus } from 'react-icons/fa';
import { MdSave } from 'react-icons/md';
import { AiOutlineTable } from 'react-icons/ai';

const FinancialDetail = forwardRef(({ selectedOperation, refreshList, page }, ref) => {
  const [totalDebt, setTotalDebt] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentList, setPaymentList] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (selectedOperation?.customerId) {
      fetchFinancials(selectedOperation.customerId);
    }
  }, [selectedOperation]);

  const fetchFinancials = async (customerId) => {
    try {
      const res = await api.get(`/Financial/summary/${customerId}`);
      setTotalDebt(parseFloat(res.data.totalDebt));
      setTotalPaid(parseFloat(res.data.totalPaid));
    } catch (err) {
      console.error('Finansal veriler alınamadı', err);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await api.get(`/Financial/payments/${selectedOperation.customerId}`);
      setPaymentList(res.data);
      setShowPopup(true);
    } catch (err) {
      console.error('Ödeme listesi alınamadı', err);
    }
  };

  const handleSavePayment = async () => {
    if (!selectedOperation?.customerId) {
      alert("Geçerli bir müşteri seçilmedi.");
      return;
    }

    const parsedAmount = parseFloat(paymentAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0 || !paymentType) {
      alert("Ödeme tutarı ve türü boş bırakılamaz.");
      return;
    }

    try {
      await api.post('/Financial/add-payment', {
        customerId: selectedOperation.customerId,
        paymentAmount: parsedAmount,
        paymentType: paymentType
      });

      setPaymentAmount('');
      setPaymentType('');
      setShowPaymentForm(false);
      fetchFinancials(selectedOperation.customerId);
      refreshList(page);
    } catch (err) {
      console.error('Ödeme kaydedilemedi:', err);
      alert("Ödeme sırasında hata oluştu.");
    }
  };

  useImperativeHandle(ref, () => ({
    refreshFinancials: () => {
      if (selectedOperation?.customerId) {
        fetchFinancials(selectedOperation.customerId);
      }
    }
  }));

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
        <button onClick={() => setShowPaymentForm(true)} style={buttonStyle}>
          <FaPlus size={14} color="white" />
        </button>
        {showPaymentForm && (
          <button onClick={handleSavePayment} style={buttonStyle}>
            <MdSave size={16} color="white" />
          </button>
        )}
        <button onClick={fetchPayments} style={buttonStyle}>
          <AiOutlineTable size={16} color="white" />
        </button>
      </div>

      {/* 🧾 Popup */}
      {showPopup && (
        <div style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          border: '2px solid #4CAF50',
          borderRadius: '8px',
          padding: '20px',
          zIndex: 1000,
          minWidth: '400px',
        }}>
          <h4 style={{ marginBottom: '10px' }}>Ödeme Geçmişi</h4>
          <table width="100%" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Tutar (TL)</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Tür</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Tarih</th>
              </tr>
            </thead>
            <tbody>
              {paymentList.map((p, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{p.paymentAmount}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{p.paymentType}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{p.paymentDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ textAlign: 'right', marginTop: '10px' }}>
            <button onClick={() => setShowPopup(false)} style={{ ...buttonStyle, backgroundColor: '#f44336' }}>Kapat</button>
          </div>
        </div>
      )}
    </div>
  );
});

export default FinancialDetail;
