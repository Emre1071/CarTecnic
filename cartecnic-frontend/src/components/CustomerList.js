import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './CustomerPanel.css';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);

  const fetchData = async () => {
    const res = await api.get('/customer');
    setCustomers(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="customer-list">
      <h3>Müşteri Listesi</h3>
      <ul>
        {customers.map(c => (
          <li key={c.customerId}>
            <strong>{c.name} {c.surname}</strong> – {c.tel}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerList;
