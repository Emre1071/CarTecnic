import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === 'admin' && password === 'admin') {
      navigate('/dashboard');
    } else {
      setError('⚠ Kullanıcı adı veya şifre hatalı');
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
    fontSize: '14px'
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 30, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2 style={{ textAlign: 'center', color: '#4CAF50' }}>🔐 Admin Girişi</h2>

      <label style={labelStyle}>Kullanıcı Adı:</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Şifre:</label>
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
        Giriş Yap
      </button>
    </div>
  );
};

export default Login;
