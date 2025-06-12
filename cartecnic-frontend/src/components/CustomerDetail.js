import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaPlus } from 'react-icons/fa';
import { MdSave } from 'react-icons/md';

// ✅ E-posta doğrulama fonksiyonu
const isValidEmail = (email) => {
  if (!email) return true; // boşsa geçerli say (zorunlu değilse)
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const CustomerDetail = ({ selectedOperation, setSelectedOperation, page, refreshList, setCurrentCustomer }) => {
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
    const updated = { ...customer, [name]: value };
    setCustomer(updated);
    setCurrentCustomer(updated); // dışarıya aktar
  };

  const checkDuplicateTel = async (tel) => {
    try {
      const res = await api.get(`/Customer/find-by-tel?tel=${tel}`);
      return res.data ? true : false;
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn("Müşteri bulunamadı, yeni kayıt yapılabilir.");
      } else {
        console.error("Telefon kontrolü sırasında hata:", err);
      }
      return false; 
    }
  };



  const handleSave = async () => {
    try {
      if (!customer.name || !customer.surname || !customer.tel) {
        alert("İsim, soyisim ve telefon zorunludur.");
        return;
      }

      if (customer.mail && !isValidEmail(customer.mail)) {
        alert("Geçerli bir e-posta adresi giriniz.");
        return;
      }

      const preparedCustomer = {
        ...customer,
        customerId: selectedOperation?.customerId,
        mail: customer.mail?.trim() === "" ? null : customer.mail.trim(),
        homeTel: customer.homeTel?.trim() === "" ? null : customer.homeTel.trim()
      };

      if (!selectedOperation?.customerId) {
        const isDuplicate = await checkDuplicateTel(customer.tel);
        if (isDuplicate) {
          alert("Bu telefon numarasıyla kayıtlı müşteri zaten var!");
          return;
        }

        // ✅ Yeni müşteri ekleme
        await api.post('/Customer', preparedCustomer);
        alert("Müşteri başarıyla eklendi!");
      } else if (selectedOperation.customerId) {
        // ✅ Mevcut müşteri güncelleme
        await api.put(`/Customer/${selectedOperation.customerId}`, preparedCustomer);
        alert("Müşteri bilgileri başarıyla güncellendi!");
      } else {
        const isDuplicate = await checkDuplicateTel(customer.tel);
        if (isDuplicate) {
          alert("Bu telefon numarasıyla kayıtlı müşteri zaten var!");
          return;
        }
      }

      refreshList(page);

    } catch (err) {
      console.error(err.response?.data || err);
      alert('❌ Kayıt sırasında bir hata oluştu!');
    }
  };




  const handleClear = () => {
    setCustomer({ name: '', surname: '', tel: '', homeTel: '', mail: '' });
    setSelectedOperation(null);
  };

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
      <h3>Customer Information</h3>

      <div style={{ flexGrow: 1 }}>
        <label style={labelStyle}>Name:</label>
        <input name="name" value={customer.name} onChange={handleChange} style={inputStyle} />

        <label style={labelStyle}>Surname:</label>
        <input name="surname" value={customer.surname} onChange={handleChange} style={inputStyle} />

        <label style={labelStyle}>Phone:</label>
        <input name="tel" value={customer.tel} onChange={handleChange} style={inputStyle} />

        <label style={labelStyle}>Home Phone:</label>
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
