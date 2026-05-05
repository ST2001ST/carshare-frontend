import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';

function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [reservationsCount, setReservationsCount] = useState(0);
  const [reservationsList, setReservationsList] = useState([]);

  useEffect(() => {
    if (user?.role === 'client') {
      fetchReservationsCount();
      fetchReservationsList();
    }
  }, [user]);

  const fetchReservationsCount = async () => {
    if (!user) return;
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/reservations/client/${user.id}/count`);
      setReservationsCount(response.data.count);
    } catch (error) {
      console.error('خطأ في جلب عدد الحجوزات:', error);
    }
  };

  const fetchReservationsList = async () => {
    if (!user) return;
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/reservations/client/${user.id}`);
      setReservationsList(response.data);
    } catch (error) {
      console.error('خطأ في جلب قائمة الحجوزات:', error);
    }
  };

  const showReservations = () => {
    if (reservationsList.length === 0) {
      alert('📭 لا توجد حجوزات');
      return;
    }

    let message = '🚗 حجوزاتي:\n\n';
    reservationsList.forEach((res, index) => {
      message += `${index + 1}. ${res.marque} ${res.modele} - ${res.prix_par_jour} درهم/اليوم\n`;
    });
    alert(message);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="CarShare" className="logo-img" />
        </Link>
        <div className="nav-links">
          <Link to="/">{t('home')}</Link>
          <Link to="/cars">{t('cars')}</Link>
          {user?.role === 'fournisseur' && (
            <Link to="/dashboard" className="dashboard-link">{t('dashboard')}</Link>
          )}
        </div>
        <div className="nav-right">
          {/* زر الحجوزات (يظهر فقط للزبون) */}
          {user?.role === 'client' && (
            <button onClick={showReservations} className="reservations-btn">
              🔔 {reservationsCount > 0 && <span className="badge">{reservationsCount}</span>}
            </button>
          )}

          {!user ? (
            <Link to="/login" className="btn-login">{t('login')}</Link>
          ) : (
            <div className="user-info">
              <span>{t('welcome')} {user.name}</span>
              <button onClick={logout} className="btn-logout">{t('logout')}</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
