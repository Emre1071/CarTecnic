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

  const buttonStyle = {
    backgroundColor: 'green',
    border: 'none',
    padding: '8px',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  return (
    <div className="box">
      <h3>Müşteri Bilgileri</h3>

      <div>
        <label>Ad:</label>
        <input name="name" value={customer.name} onChange={handleChange} />
      </div>

      <div>
        <label>Soyad:</label>
        <input name="surname" value={customer.surname} onChange={handleChange} />
      </div>

      <div>
        <label>Telefon:</label>
        <input name="tel" value={customer.tel} onChange={handleChange} />
      </div>

      <div>
        <label>Ev Tel:</label>
        <input name="homeTel" value={customer.homeTel} onChange={handleChange} />
      </div>

      <div>
        <label>E-Posta:</label>
        <input name="mail" value={customer.mail} onChange={handleChange} />
      </div>

      <div style={{ marginTop: '10px', display: 'flex', gap: '12px' }}>
        <button onClick={handleClear} style={buttonStyle}><FaPlus size={16} color="white" /></button>
        <button onClick={handleSave} style={buttonStyle}><MdSave size={20} color="white" /></button>
      </div>
    </div>
  );
};

export default CustomerDetail;
