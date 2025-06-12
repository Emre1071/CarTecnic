import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaPlus } from 'react-icons/fa';
import { MdSave } from 'react-icons/md';

const ComplaintDetail = ({ selectedOperation, setSelectedOperation, page, refreshList, financialRef, currentCustomer, currentVehicle }) => {
  const [complaint, setComplaint] = useState({
    status: '',
    branch: '',
    problem: '',
    result: '',
    price: 0,
    department: '',
    workerName: ''
  });

  const statusOptions = ['Başlamadı', 'İşlemde', 'İade Edildi', 'Tamamlandı', 'Teslim Edildi'];
  const departmentOptions = ['Mekanik', 'Elektrik', 'Kaporta', 'Boya', 'Klima'];
  const workerOptions = [
    'Ahmet Yılmaz',
    'Mehmet Demir',
    'Mustafa Çelik',
    'Ali Kaya',
    'Burak Şahin',
    'Hakan Acar',
    'Kemal Arslan',
    'Onur Koç',
    'Serkan Güneş',
    'Eren Öztürk'
  ];

  useEffect(() => {
    if (selectedOperation) {
      setComplaint({
        status: selectedOperation.status || '',
        branch: selectedOperation.branch || '',
        problem: selectedOperation.problem || '',
        result: selectedOperation.result || '',
        price: selectedOperation.price || 0,
        department: selectedOperation.department || '',
        workerName: selectedOperation.workerName || ''
      });
    } else {
      setComplaint({
        status: '',
        branch: '',
        problem: '',
        result: '',
        price: 0,
        department: '',
        workerName: ''
      });
    }
  }, [selectedOperation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComplaint(prev => ({ ...prev, [name]: value }));
  };

 const handleSave = async () => {
  try {
    const isUpdate = !!selectedOperation?.formNo;
    let customerId, plate;

    if (isUpdate) {
      // Güncelleme işlemi → customerId ve plate zaten operation içinde var
      customerId = selectedOperation.customerId;
      plate = selectedOperation.product?.plate;
    } else {
      // Yeni kayıt → currentCustomer ve currentVehicle üzerinden alınır
      const tel = currentCustomer?.tel?.trim();
      plate = currentVehicle?.plate?.trim();

      if (!tel || !plate) {
        alert("Müşteri telefon veya plaka eksik.");
        return;
      }

      const res = await api.get(`/Customer/find-by-tel?tel=${tel}`);
      customerId = res.data?.customerId;

      if (!customerId) {
        alert("Telefon numarasına ait müşteri bulunamadı.");
        return;
      }
    }

    const payload = {
      customerId,
      plate,
      Status: complaint.status,
      Branch: complaint.branch,
      Problem: complaint.problem,
      Result: complaint.result,
      Price: parseFloat(complaint.price),
      Department: complaint.department,
      WorkerName: complaint.workerName
    };

    if (isUpdate) {
      await api.put(`/Transaction/${selectedOperation.formNo}`, {
        ...payload,
        transactionId: selectedOperation.formNo
      });
      alert("Şikayet güncellendi.");
    } else {
      await api.post('/Transaction', payload);
      alert("Yeni şikayet başarıyla eklendi.");
    }

    refreshList(page);
  } catch (err) {
    console.error("Kayıt hatası:", err);
    alert("❌ Şikayet kaydı sırasında hata oluştu.");
  }
};



  const handleClear = () => {
    setComplaint({
      status: '',
      branch: '',
      problem: '',
      result: '',
      price: 0,
      department: '',
      workerName: ''
    });

    setSelectedOperation(prev => ({
      ...prev,
      formNo: null,  
      problem: '',
      result: '',
      price: 0,
      department: '',
      workerName: ''
    }));

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
      <h3>Şikayet Bilgileri</h3>

      <div style={{ flexGrow: 1 }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Durum:</label>
            <select name="status" value={complaint.status} onChange={handleChange} style={inputStyle}>
              {statusOptions.map((opt, idx) => (
                <option key={idx} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Şube:</label>
            <select name="branch" value={complaint.branch} onChange={handleChange} style={inputStyle}>
              <option value="Dükkan">Dükkan</option>
              <option value="Şube 1">Şube 1</option>
              <option value="Şube 2">Şube 2</option>
              <option value="Şube 3">Şube 3</option>
              <option value="Şube 4">Şube 4</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Departman:</label>
            <select name="department" value={complaint.department} onChange={handleChange} style={inputStyle}>
              {departmentOptions.map((opt, idx) => (
                <option key={idx} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Çalışan:</label>
            <select name="workerName" value={complaint.workerName} onChange={handleChange} style={inputStyle}>
              {workerOptions.map((opt, idx) => (
                <option key={idx} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        <label style={labelStyle}>Arıza Açıklaması:</label>
        <input type="text" name="problem" value={complaint.problem} onChange={handleChange} style={inputStyle} />

        <label style={labelStyle}>Sonuç:</label>
        <input type="text" name="result" value={complaint.result} onChange={handleChange} style={inputStyle} />

        <label style={labelStyle}>Ücret (TL):</label>
        <input type="number" name="price" value={complaint.price} onChange={handleChange} style={inputStyle} />
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'start' }}>
        <button onClick={handleClear} style={buttonStyle}><FaPlus size={14} color="white" /></button>
        <button onClick={handleSave} style={buttonStyle}><MdSave size={16} color="white" /></button>
      </div>
    </div>
  );
};

export default ComplaintDetail;
