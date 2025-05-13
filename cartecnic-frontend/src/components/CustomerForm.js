import React, { useState } from 'react';
import api from '../../services/api';
import './CustomerPanel.css';

const CustomerForm = ({ onSaved }) => {
  const [form, setForm] = useState({
    name: '',
    surname: '',
    tel: '',
    homeTel: '',
    mail: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await api.post('/customer', form);
      alert('Kayıt eklendi!');
      onSaved();
      setForm({ name: '', surname: '', tel: '', homeTel: '', mail: '' });
    } catch (err) {
      console.error(err);
      alert('Hata oluştu!');
    }
  };

  return (
    <div className="customer-form">
      <input name="name" placeholder="Ad" value={form.name} onChange={handleChange} />
      <input name="surname" placeholder="Soyad" value={form.surname} onChange={handleChange} />
      <input name="tel" placeholder="Cep Tel" value={form.tel} onChange={handleChange} />
      <input name="homeTel" placeholder="Ev Tel" value={form.homeTel} onChange={handleChange} />
      <input name="mail" placeholder="Mail" value={form.mail} onChange={handleChange} />
      <button onClick={handleSave}>Kaydet</button>
    </div>
  );
};

export default CustomerForm;
