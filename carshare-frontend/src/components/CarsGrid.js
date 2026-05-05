import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';

function CarsGrid({ voitures, onRefresh }) {
  const { user } = useAuth();
  const { t } = useLanguage();

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه السيارة؟')) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/voitures/${id}`, {
        data: { proprietaire_id: user?.id }
      });
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('خطأ: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleReserve = async (carId) => {
    if (!user) {
      alert('الرجاء تسجيل الدخول أولا');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/reservations`, {
        car_id: carId,
        client_id: user.id,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        total_price: 0
      });
      alert('تم الحجز بنجاح');
window.dispatchEvent(new Event('reservationUpdated'));
    } catch (err) {
      alert('خطأ: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="cars-grid">
      {voitures.map(voiture => (
        <div key={voiture.id} className="car-card">
          <div className="car-info">
            <h3>{voiture.marque} {voiture.modele}</h3>
            {voiture.matricule && <p className="matricule">{voiture.matricule}</p>}
            <p className="price">{voiture.prix_par_jour} {t('priceDay')}</p>
            <p className="location">{voiture.ville}</p>
            {voiture.description && <p className="description">{voiture.description}</p>}

            {user?.role === 'client' && (
              <button className="btn-reserver" onClick={() => handleReserve(voiture.id)}>
                {t('reserve')}
              </button>
            )}

            {user?.role === 'fournisseur' && parseInt(voiture.proprietaire_id) === parseInt(user?.id) && (
              <button onClick={() => handleDelete(voiture.id)} className="btn-delete">
                {t('delete')}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CarsGrid;
