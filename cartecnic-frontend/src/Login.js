import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './services/api'; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post('/User/login', {
        username,
        password
      });

      localStorage.setItem('currentUser', JSON.stringify(res.data)); 
      navigate('/dashboard'); 
    } catch (err) {
      alert('Login failed: ' + (err.response?.data || 'Error'));
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px'
  };

  const labelStyle = {
    fontWeight: '600',
    marginBottom: '4px',
    display: 'block',
    fontSize: '14px',
    color: '#fff'
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: 'url("/araba-servisi-araba-cekme.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div style={{
        maxWidth: 400,
        width: '100%',
        padding: 30,
        backgroundColor: 'rgba(0,0,0,0.75)',
        borderRadius: 10
      }}>
        <h2 style={{ textAlign: 'center', color: '#4CAF50', marginBottom: 20 }}>🔐 Admin Login</h2>

        <label style={labelStyle}>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />

        <label style={labelStyle}>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}

        <button
          onClick={handleLogin}
          style={{
            backgroundColor: 'green',
            color: 'white',
            width: '100%',
            padding: '10px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '15px',
            fontWeight: 'bold'
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
