import React, { useEffect, useState } from 'react';
import api from '../services/api';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customer');
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <table border="1" cellPadding="6">
      <thead>
        <tr>
          <th>Ad</th>
          <th>Soyad</th>
          <th>Telefon</th>
          <th>Ev Tel</th>
          <th>E-posta</th>
        </tr>
      </thead>
      <tbody>
        {customers.map(c => (
          <tr key={c.customerId}>
            <td>{c.name}</td>
            <td>{c.surname}</td>
            <td>{c.tel}</td>
            <td>{c.homeTel}</td>
            <td>{c.mail}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CustomerList;
