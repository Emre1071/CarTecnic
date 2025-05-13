import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaPlus } from 'react-icons/fa';
import { MdSave } from 'react-icons/md';

const VehicleDetail = ({ selectedOperation, setSelectedOperation, page, refreshList }) => {
  const [vehicle, setVehicle] = useState({
    plate: '',
    brand: '',
    type: '',
    model: '',
    customerId: ''
  });

  useEffect(() => {
    if (selectedOperation && selectedOperation.product) {
      setVehicle({
        plate: selectedOperation.product.plate || '',
        brand: selectedOperation.product.brand || '',
        type: selectedOperation.product.type || '',
        model: selectedOperation.product.model || '',
        customerId: selectedOperation.customerId || ''
      });
    } else {
      setVehicle({ plate: '', brand: '', type: '', model: '', customerId: '' });
    }
  }, [selectedOperation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicle((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (selectedOperation && selectedOperation.productId) {
        await api.put(`/Product/${selectedOperation.productId}`, vehicle);
      } else {
        await api.post('/Product', vehicle);
      }

      setVehicle({ plate: '', brand: '', type: '', model: '', customerId: '' });
      setSelectedOperation(null);
      refreshList(page);
    } catch (err) {
      alert('Araç kaydı sırasında hata oluştu!');
      console.error(err);
    }
  };

  const handleClear = () => {
    setVehicle({ plate: '', brand: '', type: '', model: '', customerId: '' });
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
      <h3>Araç Bilgileri</h3>

      <div>
        <label>Plaka:</label>
        <input name="plate" value={vehicle.plate} onChange={handleChange} />
      </div>

      <div>
        <label>Marka:</label>
        <input name="brand" value={vehicle.brand} onChange={handleChange} />
      </div>

      <div>
        <label>Tür:</label>
        <input name="type" value={vehicle.type} onChange={handleChange} />
      </div>

      <div>
        <label>Model:</label>
        <input name="model" value={vehicle.model} onChange={handleChange} />
      </div>

      <div>
        <label>Müşteri ID:</label>
        <input name="customerId" value={vehicle.customerId} onChange={handleChange} />
      </div>

      <div style={{ marginTop: '10px', display: 'flex', gap: '12px' }}>
        <button onClick={handleClear} style={buttonStyle}><FaPlus size={16} color="white" /></button>
        <button onClick={handleSave} style={buttonStyle}><MdSave size={20} color="white" /></button>
      </div>
    </div>
  );
};

export default VehicleDetail;
