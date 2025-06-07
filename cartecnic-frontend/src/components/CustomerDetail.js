import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaPlus } from 'react-icons/fa';
import { MdSave } from 'react-icons/md';

const CustomerDetail = ({ selectedOperation, setSelectedOperation, page, refreshList }) => {
  const [customer, setCustomer] = useState({
    name: '',
    surname: '',
    tel: '',
    homeTel: '',
    mail: ''
  });


  useEffect(() => {
    if (selectedOperation && selectedOperation.customer) {
      setCustomer({
        name: selectedOperation.customer.name || '',
        surname: selectedOperation.customer.surname || '',
        tel: selectedOperation.customer.tel || '',
        homeTel: selectedOperation.customer.homeTel || '',
        mail: selectedOperation.customer.mail || ''
      });
    } else {
      setCustomer({ name: '', surname: '', tel: '', homeTel: '', mail: '' });
    }
  }, [selectedOperation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (selectedOperation && selectedOperation.customerId) {
        await api.put(`/Customer/${selectedOperation.customerId}`, customer);
      } else {
        await api.post('/Customer', customer);
      }

      setCustomer({ name: '', surname: '', tel: '', homeTel: '', mail: '' });
      setSelectedOperation(null);
      refreshList(page);
    } catch (err) {
      alert('Kayıt sırasında hata oluştu!');
      console.error(err);
    }
  };

  const handleClear = () => {
    setCustomer({ name: '', surname: '', tel: '', homeTel: '', mail: '' });
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
  padding: '6px 8px',      // 🔁 Daha ince ve dar
  borderRadius: '4px',
  cursor: 'pointer'
  };


  return (
    <div className="box" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h3>Müşteri Bilgileri</h3>

      <div style={{ flexGrow: 1 }}>
        <label style={labelStyle}>Ad:</label>
        <input name="name" value={customer.name} onChange={handleChange} style={inputStyle} />

        <label style={labelStyle}>Soyad:</label>
        <input name="surname" value={customer.surname} onChange={handleChange} style={inputStyle} />

        <label style={labelStyle}>Telefon:</label>
        <input name="tel" value={customer.tel} onChange={handleChange} style={inputStyle} />

        <label style={labelStyle}>Ev Telefonu:</label>
        <input name="homeTel" value={customer.homeTel} onChange={handleChange} style={inputStyle} />

        <label style={labelStyle}>Email:</label>
        <input name="mail" value={customer.mail} onChange={handleChange} style={inputStyle} />
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'start' }}>
        <button onClick={handleClear} style={buttonStyle}>
            <FaPlus size={14} color="white" />
          </button>
          <button onClick={handleSave} style={buttonStyle}>
          <MdSave size={16} color="white" />
        </button>

      </div>
    </div>
  );
};

export default CustomerDetail;
