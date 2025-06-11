import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaPlus } from 'react-icons/fa';
import { MdSave } from 'react-icons/md';

const VehicleDetail = ({ selectedOperation, setSelectedOperation, page, refreshList }) => {
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

      setVehicle({
        plate: '',
        brand: '',
        type: '',
        model: ''
      });
      setSelectedOperation(null);
      refreshList(page);
    } catch (err) {
      alert('Araç kaydı sırasında hata oluştu!');
      console.error(err);
    }
  };

  const handleClear = () => {
    setVehicle({
      plate: '',
      brand: '',
      type: '',
      model: ''
    });
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
      <h3>Araç Bilgileri</h3>

      <div style={{ flexGrow: 1 }}>
        <label style={labelStyle}>Plaka:</label>
        <input name="plate" value={vehicle.plate} onChange={handleChange} style={inputStyle} />

        <label style={labelStyle}>Marka:</label>
        <input name="brand" value={vehicle.brand} onChange={handleChange} style={inputStyle} />

        <label style={labelStyle}>Model:</label>
        <input name="model" value={vehicle.model} onChange={handleChange} style={inputStyle} />

        <label style={labelStyle}>Tür:</label>
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
