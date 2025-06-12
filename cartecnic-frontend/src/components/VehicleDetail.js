import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaPlus } from 'react-icons/fa';
import { MdSave } from 'react-icons/md';

const VehicleDetail = ({ selectedOperation, setSelectedOperation, page, refreshList, currentCustomer, setCurrentVehicle }) => {
  const [vehicle, setVehicle] = useState({
    plate: '',
    brand: '',
    type: '',
    model: ''
  });

  useEffect(() => {
    if (selectedOperation && selectedOperation.product) {
      setVehicle({
        plate: selectedOperation.product.plate || '',
        brand: selectedOperation.product.brand || '',
        type: selectedOperation.product.type || '',
        model: selectedOperation.product.model || ''
      });
    } else {
      setVehicle({
        plate: '',
        brand: '',
        type: '',
        model: ''
      });
    }
  }, [selectedOperation]);

  useEffect(() => {
    setCurrentVehicle(vehicle); // tüm alanlar güncellensin
  }, [vehicle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicle((prev) => ({ ...prev, [name]: value }));
  };

  
 const handleSave = async () => {
  try {
    const isUpdate = !!selectedOperation?.product?.plate;
    let customerId = null;

    if (isUpdate) {
      // 🔧 Güncelleme: customerId zaten selectedOperation içinde vardır
      customerId = selectedOperation.customerId;
    } else {
      // ➕ Yeni kayıt: telefonla müşteri sorgulanmalı
      const tel = currentCustomer?.tel?.trim();
      if (!tel) {
        alert("Telefon numarası bulunamadı.");
        return;
      }

      const res = await api.get(`/Customer/find-by-tel?tel=${tel}`);
      customerId = res.data?.customerId;

      if (!customerId) {
        alert("Müşteri bulunamadı, lütfen önce müşteri kaydını yapınız.");
        return;
      }
    }

    const payload = {
      plate: vehicle.plate,
      brand: vehicle.brand,
      type: vehicle.type,
      model: vehicle.model,
      customerId: customerId
    };

    if (isUpdate) {
      await api.put(`/Vehicle/${vehicle.plate}`, payload); // veya uygun ID
      alert("Araç başarıyla güncellendi.");
    } else {
      await api.post('/Vehicle', payload);
      alert("Araç başarıyla eklendi.");
    }

    refreshList(page);

  } catch (err) {
    console.error(err);
    alert('❌ Araç kaydı sırasında bir hata oluştu.');
  }
};

  const handleClear = () => {
    setVehicle({ plate: '', brand: '', type: '', model: '' });
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
      <h3>Vehicle Information</h3>

      <div style={{ flexGrow: 1 }}>
        <label style={labelStyle}>Plate:</label>
        <input name="plate" value={vehicle.plate} onChange={handleChange} style={inputStyle} />

        <label style={labelStyle}>Brand:</label>
        <input name="brand" value={vehicle.brand} onChange={handleChange} style={inputStyle} />

        <label style={labelStyle}>Model:</label>
        <input name="model" value={vehicle.model} onChange={handleChange} style={inputStyle} />

        <label style={labelStyle}>Type:</label>
        <input name="type" value={vehicle.type} onChange={handleChange} style={inputStyle} />
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

export default VehicleDetail;
