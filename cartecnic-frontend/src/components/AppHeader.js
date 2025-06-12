import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // ✅ Doğru yol

const AppHeader = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const menuRef = useRef();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const handlePasswordChange = () => {
    setShowModal(true);
    setShowMenu(false);
    setMessage('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSubmitPasswordChange = async () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
      setMessage("❌ Kullanıcı bilgisi bulunamadı.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("❌ Yeni şifreler eşleşmiyor.");
      return;
    }

    try {
      const res = await api.put("/User/change-password", {
        username: user.username,
        currentPassword,
        newPassword
      });
      setMessage("✅ Şifre başarıyla değiştirildi.");
      setTimeout(() => {
        setShowModal(false);
      }, 1500);
    } catch (err) {
      setMessage("❌ " + (err.response?.data || "Hata"));
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', backgroundColor: '#f9f9f9', borderBottom: '1px solid #ccc' }}>
        <div></div>
        <div style={{ position: 'relative' }} ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '8px 14px',
              border: 'none',
              borderRadius: '5px',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ⚙ Ayarlar
          </button>

          {showMenu && (
            <div style={{
              position: 'absolute',
              top: '40px',
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '6px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
              zIndex: 1000,
              width: '160px'
            }}>
              <div
                onClick={handlePasswordChange}
                style={{
                  padding: '10px',
                  borderBottom: '1px solid #eee',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                🔐 Şifreyi Değiştir
              </div>
              <div
                onClick={handleLogout}
                style={{
                  padding: '10px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                🚪 Oturumu Kapat
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Şifre Değiştir Pop-up */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: 24,
            borderRadius: 8,
            width: '360px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
          }}>
            <h3 style={{ textAlign: 'center', color: '#4CAF50' }}>🔐 Şifreyi Değiştir</h3>

            <label>Mevcut Şifre:</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={{ width: '100%', marginBottom: 10, padding: 8 }}
            />

            <label>Yeni Şifre:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ width: '100%', marginBottom: 10, padding: 8 }}
            />

            <label>Yeni Şifre (Tekrar):</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ width: '100%', marginBottom: 10, padding: 8 }}
            />

            {message && <p style={{ color: message.startsWith('✅') ? 'green' : 'red', fontSize: '14px' }}>{message}</p>}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
              <button
                onClick={handleSubmitPasswordChange}
                style={{
                  backgroundColor: 'green',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Kaydet
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  backgroundColor: '#888',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Vazgeç
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppHeader;
